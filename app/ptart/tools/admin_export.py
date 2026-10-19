"""Portable legacy database and referenced media for migration.

This is a migration input, not a Django restore backup: it includes application
tables, team relationships and account credentials. IDs and all statuses survive.
Writers must be paused for the final export: database snapshots cannot freeze
files being edited on disk.
"""

import datetime
import decimal
import hashlib
import json
import sqlite3
import tempfile
import zipfile
from pathlib import Path

from django.conf import settings
from django.contrib.auth.models import User
from django.db import connection, models, transaction
from django.db.migrations.executor import MigrationExecutor
from django.db.migrations.recorder import MigrationRecorder
from django.utils import timezone
from django_otp.plugins.otp_totp.models import TOTPDevice
from rest_framework.authtoken.models import Token

from ptart import models as m


FORMAT = "ptart-legacy-export"
FORMAT_VERSION = 1
SECRET_TABLES = ("auth_user", "authtoken_token", "otp_totp_totpdevice")
EXPORT_MODELS = [
    User,
    Token,
    TOTPDevice,
    m.Tool,
    m.Methodology,
    m.Module,
    m.Case,
    m.CWEs,
    m.CWE,
    m.Label,
    m.Template,
    m.Project,
    m.Assessment,
    m.Flag,
    m.AttackScenario,
    m.Recommendation,
    m.Host,
    m.Service,
    m.Cvss3,
    m.Cvss4,
    m.Hit,
    m.Comment,
    m.HitReference,
    m.Screenshot,
    m.Attachment,
    m.RetestCampaign,
    m.RetestHit,
    m.RetestScreenshot,
]
EXPORT_THROUGH = [
    m.Project.pentesters.through,
    m.Project.reviewers.through,
    m.Project.viewers.through,
    m.Project.tools.through,
    m.Project.methodologies.through,
    m.Hit.labels.through,
    m.Hit.cwes.through,
]
MEDIA_FIELDS = [
    (m.Screenshot, "screenshot"),
    (m.Attachment, "attachment"),
    (m.RetestScreenshot, "screenshot"),
]


class ExportError(Exception):
    """The instance cannot be exported completely."""


def _serialize(value):
    if isinstance(value, datetime.datetime):
        return value.isoformat(sep=" ")
    if isinstance(value, datetime.date):
        return value.isoformat()
    if isinstance(value, decimal.Decimal):
        return str(value)
    return value


def _copy_table(database, model):
    fields = model._meta.concrete_fields
    columns = [field.column for field in fields]
    definitions = []
    for field in fields:
        if (
            isinstance(field, (models.IntegerField, models.BooleanField))
            or field.is_relation
        ):
            kind = "INTEGER"
        elif isinstance(field, models.DecimalField):
            kind = "NUMERIC"
        elif isinstance(field, models.FloatField):
            kind = "REAL"
        else:
            kind = "TEXT"
        primary = " PRIMARY KEY" if field.primary_key else ""
        definitions.append(f'"{field.column}" {kind}{primary}')
    table = model._meta.db_table
    database.execute(f'CREATE TABLE "{table}" ({", ".join(definitions)})')
    quoted = ", ".join(f'"{column}"' for column in columns)
    placeholders = ", ".join("?" for _ in columns)
    rows = model._base_manager.order_by("pk").values_list(
        *(field.attname for field in fields)
    )
    database.executemany(
        f'INSERT INTO "{table}" ({quoted}) VALUES ({placeholders})',
        (
            tuple(_serialize(value) for value in row)
            for row in rows.iterator(chunk_size=1000)
        ),
    )
    count = database.execute(f'SELECT COUNT(*) FROM "{table}"').fetchone()[0]
    return {"rows": count, "columns": columns}


def _safe_media_source(media_root, name):
    # Reject non-portable paths as well as traversal, including external symlinks.
    if (
        not name
        or "\\" in name
        or "\x00" in name
        or ":" in name
        or any(part in ("", ".", "..") for part in name.split("/"))
    ):
        raise ExportError(f"Invalid media path stored in database: {name!r}")
    source = (media_root / name).resolve()
    if not source.is_relative_to(media_root):
        raise ExportError(f"Media path escapes MEDIA_ROOT: {name!r}")
    return source


def _collect_media(media_root):
    names = set()
    for model, field in MEDIA_FIELDS:
        for name in model._base_manager.values_list(field, flat=True).iterator():
            _safe_media_source(media_root, name)
            names.add(name)
    missing = [
        name
        for name in sorted(names)
        if not _safe_media_source(media_root, name).is_file()
    ]
    if missing:
        raise ExportError(
            f"{len(missing)} referenced media file(s) are missing from MEDIA_ROOT: "
            + ", ".join(missing[:20])
        )
    return sorted(names)


def _pending_ptart_migrations():
    executor = MigrationExecutor(connection)
    return [
        f"{migration.app_label}.{migration.name}"
        for migration, _ in executor.migration_plan(executor.loader.graph.leaf_nodes())
    ]


def _archive_file(archive, path, name):
    digest = hashlib.sha256()
    size = 0
    with path.open("rb") as src, archive.open(name, "w", force_zip64=True) as dst:
        for chunk in iter(lambda: src.read(1024 * 1024), b""):
            digest.update(chunk)
            size += len(chunk)
            dst.write(chunk)
    return {"sha256": digest.hexdigest(), "bytes": size}


@transaction.atomic
def build_export(output, user):
    """Write a ZIP with a consistent database snapshot; return its manifest."""
    if connection.vendor == "postgresql":
        # Must precede any SELECT so related tables come from the same snapshot.
        with connection.cursor() as cursor:
            cursor.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ, READ ONLY")
    pending = _pending_ptart_migrations()
    if pending:
        raise ExportError(
            "Database schema is behind the code; run 'manage.py migrate' first. "
            f"Pending: {', '.join(pending)}"
        )
    media_root = Path(settings.MEDIA_ROOT).resolve()
    names = _collect_media(media_root)
    applied = MigrationRecorder(connection).applied_migrations()
    migrations = sorted(name for app, name in applied if app == "ptart")
    manifest = {
        "format": FORMAT,
        "format_version": FORMAT_VERSION,
        "exported_at": timezone.now().isoformat(),
        "exported_by": user.get_username(),
        "source": {
            "application": "PTART",
            "app_version": getattr(settings, "VERSION", None),
            "database_vendor": connection.vendor,
            "latest_migration": migrations[-1] if migrations else None,
        },
        "contains_secrets": True,
        "secret_tables": list(SECRET_TABLES),
        "tables": {},
        "media": {"files": [], "count": len(names)},
    }
    with tempfile.TemporaryDirectory(prefix="ptart-export-") as directory:
        path = Path(directory) / "legacy.sqlite3"
        database = sqlite3.connect(path)
        try:
            with database:
                for model in EXPORT_MODELS + EXPORT_THROUGH:
                    manifest["tables"][model._meta.db_table] = _copy_table(
                        database, model
                    )
        finally:
            database.close()
        with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            manifest["database"] = {
                "path": "legacy.sqlite3",
                **_archive_file(archive, path, "legacy.sqlite3"),
            }
            for name in names:
                metadata = _archive_file(
                    archive, _safe_media_source(media_root, name), f"media/{name}"
                )
                manifest["media"]["files"].append({"path": name, **metadata})
            archive.writestr(
                "manifest.json", json.dumps(manifest, ensure_ascii=False, indent=2)
            )
    return manifest


def export_to_tempfile(user):
    """Keep credentials off the public filesystem; close/delete on any failure."""
    temp = tempfile.TemporaryFile()
    try:
        manifest = build_export(temp, user)
        temp.seek(0)
        return temp, manifest
    except BaseException:
        temp.close()
        raise
