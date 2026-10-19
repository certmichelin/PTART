"""Fresh-instance restore of a validated admin export. No merging or overwriting."""

import hashlib
import json
import os
import shutil
import sqlite3
import stat
import tempfile
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

from django.conf import settings
from django.contrib.admin.models import LogEntry
from django.contrib.auth.models import Group, User
from django.contrib.sessions.models import Session
from django.core.management.color import no_style
from django.db import connection, models, transaction
from django.db.migrations.recorder import MigrationRecorder

from ptart import models as m
from ptart.tools.admin_export import (
    EXPORT_MODELS,
    EXPORT_THROUGH,
    FORMAT,
    FORMAT_VERSION,
    MEDIA_FIELDS,
    _pending_ptart_migrations,
    _safe_media_source,
)

MODELS = EXPORT_MODELS + EXPORT_THROUGH
TABLES = {model._meta.db_table: model for model in MODELS}
EXTRA_GUARDS = [
    Group,
    Group.permissions.through,
    User.groups.through,
    User.user_permissions.through,
    Session,
    LogEntry,
]


class ArchiveImportError(Exception):
    """Archive or destination is unsuitable for a fresh-instance import."""


def _unpack(archive, directory):
    entries = archive.infolist()
    by_name = {entry.filename: entry for entry in entries}
    if len(by_name) != len(entries):
        raise ArchiveImportError("Duplicate ZIP entries are not supported.")
    manifest_entry = by_name.get("manifest.json")
    if manifest_entry is None or manifest_entry.file_size > 16 * 1024 * 1024:
        raise ArchiveImportError("Missing or oversized manifest (maximum 16 MiB).")
    manifest = json.loads(archive.read(manifest_entry))
    if manifest["format"] != FORMAT or manifest["format_version"] != FORMAT_VERSION:
        raise ArchiveImportError("Unsupported export format/version.")
    if set(manifest["tables"]) != set(TABLES):
        raise ArchiveImportError("Archive does not contain the expected PTART tables.")
    if manifest["database"]["path"] != "legacy.sqlite3":
        raise ArchiveImportError("Invalid database entry.")
    files = {"legacy.sqlite3": manifest["database"]}
    media_root = directory / "media"
    media_root.mkdir()
    for metadata in manifest["media"]["files"]:
        _safe_media_source(media_root, metadata["path"])
        name = "media/" + metadata["path"]
        if name in files:
            raise ArchiveImportError("Duplicate media paths in manifest.")
        files[name] = metadata
    if manifest["media"]["count"] != len(files) - 1:
        raise ArchiveImportError("Media count does not match manifest.")
    if set(by_name) != {"manifest.json", *files}:
        raise ArchiveImportError("Missing or unexpected ZIP entries.")
    if sum(entry.file_size for entry in entries) >= shutil.disk_usage(directory).free:
        raise ArchiveImportError("Not enough temporary disk space to unpack archive.")
    for entry in entries:
        kind = stat.S_IFMT(entry.external_attr >> 16)
        if entry.is_dir() or kind not in (0, stat.S_IFREG) or entry.flag_bits & 1:
            raise ArchiveImportError("ZIP entries must be regular, unencrypted files.")
    for name, metadata in files.items():
        destination = directory / name
        destination.parent.mkdir(parents=True, exist_ok=True)
        digest, size = hashlib.sha256(), 0
        with archive.open(by_name[name]) as src, destination.open("xb") as dst:
            for chunk in iter(lambda: src.read(1024 * 1024), b""):
                digest.update(chunk)
                size += len(chunk)
                dst.write(chunk)
        if size != metadata["bytes"] or digest.hexdigest() != metadata["sha256"]:
            raise ArchiveImportError(f"Checksum/size mismatch: {name}")
    return manifest


def _validate_database(source, manifest, directory):
    objects = source.execute(
        "SELECT name, type FROM sqlite_master WHERE name NOT LIKE 'sqlite_%'"
    ).fetchall()
    if {name for name, kind in objects} != set(TABLES) or any(
        kind != "table" for _, kind in objects
    ):
        raise ArchiveImportError(
            "SQLite database must contain only the expected tables."
        )
    if source.execute("PRAGMA quick_check").fetchone() != ("ok",):
        raise ArchiveImportError("SQLite integrity check failed.")
    for table, model in TABLES.items():
        columns = [field.column for field in model._meta.concrete_fields]
        actual = [row[1] for row in source.execute(f'PRAGMA table_info("{table}")')]
        metadata = manifest["tables"][table]
        if set(actual) != set(columns) or metadata["columns"] != columns:
            raise ArchiveImportError(f"Unsupported table columns: {table}")
        count = source.execute(f'SELECT COUNT(*) FROM "{table}"').fetchone()[0]
        if count != metadata["rows"]:
            raise ArchiveImportError(f"Row count mismatch: {table}")
    if not source.execute(
        "SELECT id FROM auth_user WHERE is_staff=1 AND is_active=1 LIMIT 1"
    ).fetchone():
        raise ArchiveImportError("Archive has no active staff account.")
    references = set()
    for model, field_name in MEDIA_FIELDS:
        table = model._meta.db_table
        column = model._meta.get_field(field_name).column
        for (name,) in source.execute(f'SELECT "{column}" FROM "{table}"'):
            _safe_media_source(directory / "media", name)
            references.add(name)
    if references != {entry["path"] for entry in manifest["media"]["files"]}:
        raise ArchiveImportError("Media references do not match the manifest.")


def _untouched_migration_catalog():
    """Only the exact CWE catalog installed by migration 0039 may be replaced."""
    lists = list(m.CWEs.objects.values("id", "version", "deprecated"))
    if not lists and not m.CWE.objects.exists():
        return True
    if lists != [{"id": 1, "version": "v4.16", "deprecated": False}]:
        return False
    path = Path(settings.BASE_DIR) / "data" / "cwec_v4.16.xml"
    namespace = "{http://cwe.mitre.org/cwe-7}"
    weaknesses = ET.parse(path).getroot().find(namespace + "Weaknesses")
    expected = []
    for pk, weakness in enumerate(weaknesses, 1):
        extended = weakness.find(namespace + "Extended_Description")
        text = ""
        if extended is not None:
            text = extended.text
            if text is None:
                text = extended.find("{http://www.w3.org/1999/xhtml}p").text
        expected.append(
            (
                pk,
                int(weakness.attrib["ID"]),
                weakness.attrib["Name"],
                weakness.find(namespace + "Description").text,
                text,
                1,
            )
        )
    actual = list(
        m.CWE.objects.order_by("pk").values_list(
            "id", "cwe_id", "name", "description", "extended_description", "cwes_id"
        )
    )
    return actual == expected


def _require_fresh_database():
    if connection.vendor == "postgresql":
        names = sorted({model._meta.db_table for model in MODELS + EXTRA_GUARDS})
        with connection.cursor() as cursor:
            cursor.execute(
                "LOCK TABLE "
                + ", ".join(connection.ops.quote_name(name) for name in names)
                + " IN ACCESS EXCLUSIVE MODE"
            )
    for model in MODELS + EXTRA_GUARDS:
        if model not in (m.CWE, m.CWEs) and model._base_manager.exists():
            raise ArchiveImportError(
                f"Destination database is not empty ({model._meta.db_table}). No merging is supported."
            )
    if not _untouched_migration_catalog():
        raise ArchiveImportError(
            "Destination database is not empty (custom or modified CWE catalog)."
        )


def _require_fresh_media(root):
    directories = [root] if root.exists() else []
    while directories:
        # Unlike rglob(), iterdir() does not silently skip unreadable directories.
        for path in directories.pop().iterdir():
            if not path.is_symlink() and path.is_dir():
                directories.append(path)
            elif not (
                not path.is_symlink()
                and path.name == ".gitkeep"
                and path.is_file()
                and path.stat().st_size == 0
            ):
                raise ArchiveImportError(
                    "Destination media directory is not empty. No files will be overwritten."
                )


def _insert_rows(source):
    # Raw prepared values avoid save hooks/auto_now_add changing archived data.
    with connection.cursor() as cursor:
        for table, model in TABLES.items():
            fields = model._meta.concrete_fields
            quoted = ", ".join(
                connection.ops.quote_name(field.column) for field in fields
            )
            query = source.execute(
                f'SELECT {quoted} FROM "{table}" ORDER BY "{model._meta.pk.column}"'
            )
            placeholders = ", ".join("%s" for _ in fields)
            sql = f"INSERT INTO {connection.ops.quote_name(table)} ({quoted}) VALUES ({placeholders})"
            while rows := query.fetchmany(1000):
                prepared = [
                    tuple(
                        field.get_db_prep_value(field.to_python(value), connection)
                        for field, value in zip(fields, row)
                    )
                    for row in rows
                ]
                cursor.executemany(sql, prepared)


def _reset_sequences():
    with connection.cursor() as cursor:
        if connection.vendor != "postgresql":
            for sql in connection.ops.sequence_reset_sql(no_style(), MODELS):
                cursor.execute(sql)
            return
        # setval() is not transactional: a failed import could rewind the CWE
        # sequence below seed rows restored by rollback. RESTART rolls back too.
        quote = connection.ops.quote_name
        for model in MODELS:
            pk = model._meta.pk
            if not isinstance(pk, models.AutoField):
                continue
            table = model._meta.db_table
            cursor.execute(
                "SELECT n.nspname, c.relname FROM pg_class c "
                "JOIN pg_namespace n ON n.oid=c.relnamespace "
                "WHERE c.oid=pg_get_serial_sequence(%s, %s)::regclass",
                (table, pk.column),
            )
            schema, name = cursor.fetchone()
            cursor.execute(
                f"SELECT COALESCE(MAX({quote(pk.column)}), 0) + 1 FROM {quote(table)}"
            )
            next_id = int(cursor.fetchone()[0])
            cursor.execute(
                f"ALTER SEQUENCE {quote(schema)}.{quote(name)} RESTART WITH {next_id}"
            )


def _install_media(directory, root, manifest, created):
    for entry in manifest["media"]["files"]:
        path = _safe_media_source(root, entry["path"])
        path.parent.mkdir(parents=True, exist_ok=True)
        fd = os.open(path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
        with os.fdopen(fd, "wb") as dst:
            identity = os.fstat(dst.fileno())
            created.append((path, identity.st_dev, identity.st_ino))
            with (directory / "media" / entry["path"]).open("rb") as src:
                shutil.copyfileobj(src, dst, 1024 * 1024)


def import_archive(path):
    """Validate completely, then import under one transaction; compensate media failures."""
    if connection.in_atomic_block:
        raise ArchiveImportError(
            "Import must run outside an existing database transaction."
        )
    if _pending_ptart_migrations():
        raise ArchiveImportError("Run 'manage.py migrate' before importing.")
    root = Path(settings.MEDIA_ROOT).resolve()
    created = []
    committed = False
    try:
        with tempfile.TemporaryDirectory(prefix="ptart-import-") as temp:
            directory = Path(temp)
            with zipfile.ZipFile(path) as archive:
                manifest = _unpack(archive, directory)
            applied = MigrationRecorder(connection).applied_migrations()
            migrations = sorted(name for app, name in applied if app == "ptart")
            if manifest["source"]["latest_migration"] != (
                migrations[-1] if migrations else None
            ):
                raise ArchiveImportError(
                    "Archive schema migration does not match this installation."
                )
            source = sqlite3.connect(
                (directory / "legacy.sqlite3").as_uri() + "?mode=ro&immutable=1",
                uri=True,
            )
            try:
                source.execute("PRAGMA trusted_schema=OFF")
                _validate_database(source, manifest, directory)
                with transaction.atomic():
                    _require_fresh_database()
                    _require_fresh_media(root)
                    m.CWE.objects.all().delete()
                    m.CWEs.objects.all().delete()
                    _insert_rows(source)
                    connection.check_constraints()
                    _reset_sequences()
                    _install_media(directory, root, manifest, created)
                committed = True
            finally:
                source.close()
        return manifest
    except BaseException as error:
        if committed:
            raise ArchiveImportError(
                "Data was imported, but temporary-file cleanup failed. Do not retry; verify the import and clean up temporary files."
            ) from error
        # Only remove files exclusively created by this attempt, never preexisting media.
        for item, device, inode in reversed(created):
            if (
                item.resolve().is_relative_to(root)
                and not item.is_symlink()
                and item.exists()
            ):
                identity = item.stat()
                if (identity.st_dev, identity.st_ino) == (device, inode):
                    item.unlink()
        raise
