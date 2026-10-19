import hashlib
import importlib
import io
import json
import sqlite3
import tempfile
import zipfile
from pathlib import Path
from unittest.mock import patch

from django.apps import apps
from django.contrib.auth.models import User
from django.core.management import call_command
from django.core.management.base import CommandError
from django.db import IntegrityError
from django.test import TransactionTestCase
from django_otp.plugins.otp_totp.models import TOTPDevice
from rest_framework.authtoken.models import Token

from ptart import models as m
from ptart.tests import ExportFixtureMixin
from ptart.tools import admin_export as export
from ptart.tools import admin_import as restore


class AdminImportTests(ExportFixtureMixin, TransactionTestCase):
    def setUp(self):
        super().setUp()
        stream, self.manifest = export.export_to_tempfile(self.admin)
        with stream:
            self.original_zip = stream.read()
        self.archive_path = self.root / "archive.zip"
        self.archive_path.write_bytes(self.original_zip)
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.destination = Path(directory.name)

    def fresh_database(self):
        call_command("flush", interactive=False, verbosity=0)

    def run_import(self):
        with self.settings(MEDIA_ROOT=str(self.destination)):
            call_command("import_archive", str(self.archive_path), stdout=io.StringIO())

    def rewrite_archive(self, change):
        with zipfile.ZipFile(io.BytesIO(self.original_zip)) as archive:
            files = {name: archive.read(name) for name in archive.namelist()}
        manifest = json.loads(files["manifest.json"])
        change(files, manifest)
        files["manifest.json"] = json.dumps(manifest).encode()
        with zipfile.ZipFile(self.archive_path, "w") as archive:
            for name, data in files.items():
                archive.writestr(name, data)

    def edit_database(self, sql):
        def change(files, manifest):
            database = self.root / "edited.sqlite3"
            database.write_bytes(files["legacy.sqlite3"])
            conn = sqlite3.connect(database)
            with conn:
                conn.execute(sql)
            conn.close()
            data = database.read_bytes()
            files["legacy.sqlite3"] = data
            manifest["database"]["sha256"] = hashlib.sha256(data).hexdigest()
            manifest["database"]["bytes"] = len(data)

        self.rewrite_archive(change)

    def assert_empty_destination(self):
        self.assertFalse(User.objects.exists())
        self.assertFalse(m.Project.objects.exists())
        self.assertEqual([p for p in self.destination.rglob("*") if p.is_file()], [])

    def test_round_trip_preserves_every_column_credentials_media_and_new_ids(self):
        expected = {}
        for model in export.EXPORT_MODELS + export.EXPORT_THROUGH:
            fields = [field.attname for field in model._meta.concrete_fields]
            expected[model] = list(
                model._base_manager.order_by("pk").values_list(*fields)
            )
        self.fresh_database()
        self.run_import()
        for model, rows in expected.items():
            fields = [field.attname for field in model._meta.concrete_fields]
            self.assertEqual(
                list(model._base_manager.order_by("pk").values_list(*fields)),
                rows,
                model._meta.label,
            )
        restored = User.objects.get(pk=self.admin.pk)
        self.assertTrue(restored.check_password("export-test"))
        self.assertEqual(Token.objects.get(user=restored).key, self.token.key)
        self.assertEqual(TOTPDevice.objects.get(user=restored).key, self.device.key)
        self.assertEqual(
            (self.destination / "screenshots/evidence.png").read_bytes(),
            b"test evidence",
        )
        self.assertGreater(User.objects.create_user("after-import").pk, restored.pk)
        from django.utils import timezone

        self.assertGreater(
            m.Hit.objects.create(
                title="New", assessment_id=self.assessment.pk, added=timezone.now()
            ).pk,
            self.other_hit.pk,
        )

    def test_existing_instance_and_second_import_are_refused_without_overwriting(self):
        with self.assertRaisesMessage(CommandError, "not empty"):
            self.run_import()
        self.assertEqual(
            m.Project.objects.get(pk=self.project.pk).name, "Archived project"
        )
        self.fresh_database()
        self.run_import()
        with self.assertRaisesMessage(CommandError, "not empty"):
            self.run_import()
        self.assertEqual(m.Hit.objects.count(), 2)
        self.assertEqual(
            (self.destination / "screenshots/evidence.png").read_bytes(),
            b"test evidence",
        )

    def test_untouched_migration_catalog_is_supported_but_edited_catalog_is_not(self):
        self.fresh_database()
        seed = importlib.import_module("ptart.migrations.0039_cwes_cwe")
        seed.create_cwe_from_xml(apps, None)
        m.CWE.objects.filter(pk=m.CWE.objects.first().pk).update(name="Custom work")
        with self.assertRaisesMessage(CommandError, "not empty"):
            self.run_import()
        self.assertTrue(m.CWE.objects.filter(name="Custom work").exists())
        self.fresh_database()
        seed.create_cwe_from_xml(apps, None)
        self.run_import()
        self.assertTrue(User.objects.filter(pk=self.admin.pk).exists())
        self.assertEqual(
            m.CWE.objects.count(), self.manifest["tables"]["ptart_cwe"]["rows"]
        )

    def test_bad_checksums_unsupported_format_missing_files_and_extra_entries_refuse(
        self,
    ):
        self.fresh_database()
        mutations = [
            lambda files, manifest: manifest.update(format_version=999),
            lambda files, manifest: manifest["database"].update(sha256="0" * 64),
            lambda files, manifest: files.update(
                {"media/screenshots/evidence.png": b"changed"}
            ),
            lambda files, manifest: files.pop("media/screenshots/evidence.png"),
            lambda files, manifest: files.update({"../escape": b"bad"}),
            lambda files, manifest: manifest["tables"]["ptart_hit"].update(rows=999),
            lambda files, manifest: manifest["source"].update(
                latest_migration="unsupported"
            ),
        ]
        for mutate in mutations:
            with self.subTest(mutation=mutate):
                self.rewrite_archive(mutate)
                with self.assertRaises(CommandError):
                    self.run_import()
                self.assert_empty_destination()

    def test_media_paths_in_database_must_match_manifest(self):
        self.fresh_database()
        self.edit_database("UPDATE ptart_screenshot SET screenshot='../outside'")
        with self.assertRaises(CommandError):
            self.run_import()
        self.assert_empty_destination()

    def test_missing_columns_and_sqlite_views_are_refused(self):
        self.fresh_database()
        for sql in (
            "ALTER TABLE ptart_hit DROP COLUMN title",
            "CREATE VIEW injected AS SELECT * FROM auth_user",
        ):
            with self.subTest(sql=sql):
                self.edit_database(sql)
                with self.assertRaises(CommandError):
                    self.run_import()
                self.assert_empty_destination()

    def test_existing_media_or_symlink_is_never_overwritten(self):
        self.fresh_database()
        existing = self.destination / "screenshots"
        existing.mkdir()
        evidence = existing / "evidence.png"
        evidence.write_bytes(b"existing")
        with self.assertRaises(CommandError):
            self.run_import()
        self.assertEqual(evidence.read_bytes(), b"existing")
        evidence.unlink()
        evidence.symlink_to(self.file)
        with self.assertRaises(CommandError):
            self.run_import()
        self.assertEqual(self.file.read_bytes(), b"test evidence")
        self.assertFalse(User.objects.exists())

    def test_constraint_failure_rolls_back_database_and_copies_no_media(self):
        self.fresh_database()
        self.edit_database("UPDATE ptart_hit SET assessment_id=999999")
        with self.assertRaises(CommandError):
            self.run_import()
        self.assert_empty_destination()

    def test_media_failure_and_commit_failure_remove_only_new_files_and_roll_back_rows(
        self,
    ):
        self.fresh_database()
        real_copy = restore.shutil.copyfileobj

        def broken_copy(src, dst, *args):
            real_copy(src, dst, *args)
            raise OSError("disk full")

        with patch.object(restore.shutil, "copyfileobj", side_effect=broken_copy):
            with self.assertRaises(CommandError):
                self.run_import()
        self.assert_empty_destination()
        from django.db import connection

        with patch.object(
            connection, "commit", side_effect=IntegrityError("commit refused")
        ):
            with self.assertRaises(CommandError):
                self.run_import()
        self.assert_empty_destination()

    def test_seed_catalog_survives_a_failed_import(self):
        self.fresh_database()
        seed = importlib.import_module("ptart.migrations.0039_cwes_cwe")
        seed.create_cwe_from_xml(apps, None)
        original = list(m.CWE.objects.order_by("pk").values_list())

        def smaller_catalog(files, manifest):
            database = self.root / "small-catalog.sqlite3"
            database.write_bytes(files["legacy.sqlite3"])
            conn = sqlite3.connect(database)
            with conn:
                conn.execute(
                    "DELETE FROM ptart_cwe WHERE id NOT IN (SELECT cwe_id FROM ptart_hit_cwes)"
                )
                conn.execute("UPDATE ptart_cwe SET id=100")
                conn.execute("UPDATE ptart_hit_cwes SET cwe_id=100")
            conn.close()
            data = database.read_bytes()
            files["legacy.sqlite3"] = data
            manifest["database"]["sha256"] = hashlib.sha256(data).hexdigest()
            manifest["database"]["bytes"] = len(data)
            manifest["tables"]["ptart_cwe"]["rows"] = 1

        self.rewrite_archive(smaller_catalog)
        with patch.object(restore, "_install_media", side_effect=OSError("disk full")):
            with self.assertRaises(CommandError):
                self.run_import()
        self.assertEqual(list(m.CWE.objects.order_by("pk").values_list()), original)
        self.assert_empty_destination()
        # Failed imports must not rewind a PostgreSQL sequence below restored seed IDs.
        added = m.CWE.objects.create(
            cwes=m.CWEs.objects.get(), cwe_id=999999, name="After failure"
        )
        self.assertGreater(added.pk, max(row[0] for row in original))

    def test_duplicate_or_symlink_zip_entries_are_refused(self):
        self.fresh_database()
        with zipfile.ZipFile(self.archive_path, "a") as archive:
            with self.assertWarns(UserWarning):
                archive.writestr("legacy.sqlite3", b"injected")
        with self.assertRaises(CommandError):
            self.run_import()
        self.assert_empty_destination()
        with zipfile.ZipFile(io.BytesIO(self.original_zip)) as source:
            with zipfile.ZipFile(self.archive_path, "w") as archive:
                for entry in source.infolist():
                    if entry.filename.startswith("media/"):
                        entry.external_attr = 0o120777 << 16
                    archive.writestr(entry, source.read(entry.filename))
        with self.assertRaises(CommandError):
            self.run_import()
        self.assert_empty_destination()

    def test_post_commit_cleanup_error_does_not_delete_imported_evidence(self):
        self.fresh_database()
        directory = tempfile.TemporaryDirectory()

        class CleanupFailure:
            def __enter__(self):
                return directory.__enter__()

            def __exit__(self, *args):
                directory.__exit__(*args)
                raise OSError("cleanup failed")

        with patch.object(
            restore.tempfile, "TemporaryDirectory", return_value=CleanupFailure()
        ):
            with self.assertRaisesMessage(CommandError, "Data was imported"):
                self.run_import()
        self.assertTrue(User.objects.filter(pk=self.admin.pk).exists())
        self.assertEqual(
            (self.destination / "screenshots/evidence.png").read_bytes(),
            b"test evidence",
        )

    def test_pending_migrations_are_refused(self):
        self.fresh_database()
        with patch.object(
            restore, "_pending_ptart_migrations", return_value=["ptart.pending"]
        ):
            with self.assertRaisesMessage(CommandError, "migrate"):
                self.run_import()
        self.assert_empty_destination()
