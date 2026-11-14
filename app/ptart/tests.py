import hashlib
import io
import json
import sqlite3
import tempfile
import zipfile
from pathlib import Path
from unittest.mock import patch
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt


from django.contrib.auth.models import AnonymousUser, User
from django.test import Client, RequestFactory, TransactionTestCase
from django.urls import reverse
from django.utils import timezone
from django_otp import DEVICE_ID_SESSION_KEY
from django_otp.plugins.otp_totp.models import TOTPDevice
from rest_framework.authtoken.models import Token

from ptart import models as m, views
from ptart.tools import admin_export as export


class ExportFixtureMixin:
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.settings_override = self.settings(MEDIA_ROOT=str(self.root))
        self.settings_override.enable()
        self.addCleanup(self.settings_override.disable)
        self.admin = User.objects.create_user(
            "admin", password="export-test", is_staff=True
        )
        self.token = Token.objects.create(user=self.admin)
        self.device = TOTPDevice.objects.create(user=self.admin, confirmed=True)
        now = timezone.now()
        self.tool = m.Tool.objects.create(
            name="Scanner", url="https://example.invalid", deprecated=True
        )
        methodology = m.Methodology.objects.create(name="Methodology")
        module = m.Module.objects.create(name="Module", methodology=methodology)
        m.Case.objects.create(name="Case", module=module)
        cwes = m.CWEs.objects.create(version="4.20")
        cwe = m.CWE.objects.create(cwes=cwes, cwe_id=79, name="XSS")
        m.Template.objects.create(
            name="Private template", owner=self.admin, body="L'été 漏洞"
        )
        self.project = m.Project.objects.create(
            name="Archived project", archived=True, cwes=cwes, added=now
        )
        self.project.tools.add(self.tool)
        self.project.methodologies.add(methodology)
        self.project.pentesters.add(self.admin)
        self.project.reviewers.add(self.admin)
        self.project.viewers.add(self.admin)
        self.assessment = m.Assessment.objects.create(
            name="Assessment", project=self.project, added=now
        )
        cvss3 = m.Cvss3.objects.create(attack_vector="N", decimal_value="9.8")
        cvss4 = m.Cvss4.objects.create(attack_vector="N", decimal_value="9.3")
        self.hit = m.Hit.objects.create(
            title="Hidden finding",
            assessment=self.assessment,
            status="H",
            added=now,
            cvss3=cvss3,
            cvss4=cvss4,
        )
        self.hit.cwes.add(cwe)
        self.other_hit = m.Hit.objects.create(
            title="Draft finding", assessment=self.assessment, status="D", added=now
        )
        m.Comment.objects.create(
            hit=self.hit, author=self.admin, text="Review", added=now
        )
        m.HitReference.objects.create(
            hit=self.hit, name="Reference", url="https://example.invalid"
        )
        m.Flag.objects.create(
            assessment=self.assessment, title="Flag", assignee=self.admin, added=now
        )
        m.AttackScenario.objects.create(
            project=self.project, name="Scenario", svg="<svg/>"
        )
        m.Recommendation.objects.create(project=self.project, name="Recommendation")
        host = m.Host.objects.create(project=self.project, hostname="example.invalid")
        m.Service.objects.create(host=host, port=443)
        self.label = m.Label.objects.create(title="Label", color="#123456")
        self.hit.labels.add(self.label)
        self.file = self.root / "screenshots" / "evidence.png"
        self.file.parent.mkdir()
        self.file.write_bytes(b"test evidence")
        self.screenshot = m.Screenshot.objects.create(
            hit=self.hit, screenshot="screenshots/evidence.png", order=3
        )
        self.attachment = m.Attachment.objects.create(
            hit=self.hit,
            attachment_name="evidence",
            attachment="screenshots/evidence.png",
        )
        self.campaign = m.RetestCampaign.objects.create(
            project=self.project, name="Retest"
        )
        self.retest = m.RetestHit.objects.create(
            retest_campaign=self.campaign, hit=self.hit, status="NT"
        )
        m.RetestScreenshot.objects.create(
            retest_hit=self.retest, screenshot="screenshots/evidence.png"
        )

    def archive(self):
        stream, manifest = export.export_to_tempfile(self.admin)
        self.addCleanup(stream.close)
        archive = zipfile.ZipFile(stream)
        self.addCleanup(archive.close)
        return archive, manifest


class AdminExportTests(ExportFixtureMixin, TransactionTestCase):
    def test_portable_database_preserves_ids_relations_credentials_and_all_statuses(
        self,
    ):
        archive, manifest = self.archive()
        database = self.root / "export.sqlite3"
        database.write_bytes(archive.read("legacy.sqlite3"))
        conn = sqlite3.connect(database)
        self.addCleanup(conn.close)
        self.assertEqual(conn.execute("PRAGMA integrity_check").fetchone()[0], "ok")
        for model in export.EXPORT_MODELS + export.EXPORT_THROUGH:
            table = model._meta.db_table
            count = conn.execute(f'SELECT COUNT(*) FROM "{table}"').fetchone()[0]
            self.assertEqual(count, model._base_manager.count(), table)
            self.assertEqual(count, manifest["tables"][table]["rows"], table)
        self.assertEqual(
            conn.execute("SELECT id, archived FROM ptart_project").fetchone(),
            (self.project.pk, 1),
        )
        self.assertEqual(
            conn.execute("SELECT id, status FROM ptart_hit ORDER BY id").fetchall(),
            [(self.hit.pk, "H"), (self.other_hit.pk, "D")],
        )
        for role in ("pentesters", "reviewers", "viewers"):
            self.assertEqual(
                conn.execute(
                    f"SELECT project_id, user_id FROM ptart_project_{role}"
                ).fetchone(),
                (self.project.pk, self.admin.pk),
            )
        self.assertEqual(
            conn.execute("SELECT hit_id, label_id FROM ptart_hit_labels").fetchone(),
            (self.hit.pk, self.label.pk),
        )
        self.assertEqual(
            conn.execute("SELECT password FROM auth_user").fetchone()[0],
            self.admin.password,
        )
        self.assertEqual(
            conn.execute("SELECT key FROM authtoken_token").fetchone()[0],
            self.token.key,
        )
        self.assertEqual(
            conn.execute("SELECT key FROM otp_totp_totpdevice").fetchone()[0],
            self.device.key,
        )
        self.assertEqual(
            conn.execute("SELECT body FROM ptart_template").fetchone()[0], "L'été 漏洞"
        )
        self.assertEqual(
            conn.execute("SELECT decimal_value FROM ptart_cvss3").fetchone()[0], 9.8
        )
        self.assertEqual(
            conn.execute("SELECT decimal_value FROM ptart_cvss4").fetchone()[0], 9.3
        )
        self.assertEqual(
            conn.execute('SELECT "order", screenshot FROM ptart_screenshot').fetchone(),
            (3, "screenshots/evidence.png"),
        )
        self.assertTrue(manifest["contains_secrets"])
        self.assertEqual(json.loads(archive.read("manifest.json")), manifest)
        self.assertEqual(
            hashlib.sha256(database.read_bytes()).hexdigest(),
            manifest["database"]["sha256"],
        )
        # Shared paths appear only once in the ZIP.
        self.assertEqual(manifest["media"]["count"], 1)
        media = manifest["media"]["files"][0]
        self.assertEqual(archive.read("media/" + media["path"]), b"test evidence")
        self.assertEqual(media["sha256"], hashlib.sha256(b"test evidence").hexdigest())

    def test_missing_media_refuses_instead_of_silently_losing_evidence(self):
        self.file.unlink()
        with self.assertRaisesMessage(export.ExportError, "missing"):
            self.archive()

    def test_empty_media_name_refuses_export(self):
        m.Attachment.objects.filter(pk=self.attachment.pk).update(attachment="")
        with self.assertRaises(export.ExportError):
            self.archive()

    def test_unsafe_paths_and_external_symlinks_refuse_export(self):
        for name in (
            "../escape.png",
            "/absolute.png",
            "screenshots/../escape.png",
            "screenshots\\escape.png",
        ):
            with self.subTest(name=name):
                m.Screenshot.objects.filter(pk=self.screenshot.pk).update(
                    screenshot=name
                )
                with self.assertRaises(export.ExportError):
                    self.archive()
        with tempfile.TemporaryDirectory() as outside:
            target = Path(outside) / "secret"
            target.write_bytes(b"must not export")
            link = self.root / "screenshots" / "link.png"
            link.symlink_to(target)
            m.Screenshot.objects.filter(pk=self.screenshot.pk).update(
                screenshot="screenshots/link.png"
            )
            with self.assertRaises(export.ExportError):
                self.archive()

    def test_pending_migrations_refuse_export(self):
        with patch.object(
            export, "_pending_ptart_migrations", return_value=["ptart.pending"]
        ):
            with self.assertRaisesMessage(export.ExportError, "migrate"):
                self.archive()

    def request(self, user, verified=True, method="post", data=None):
        user.is_verified = lambda: verified
        if data is None and method == "post":
            data = {"passphrase": "example passphrase 123", "passphrase_confirm": "example passphrase 123"}
        request = getattr(RequestFactory(), method)("/export/download/", data=data)
        request.user = user
        return request

    def test_only_active_verified_staff_can_download_and_get_is_rejected(self):
        user = User.objects.create_user("member")
        for denied, verified in (
            (AnonymousUser(), False),
            (user, True),
            (self.admin, False),
        ):
            with self.subTest(user=denied, verified=verified):
                response = views.admin_export_download(self.request(denied, verified))
                self.assertEqual(response.status_code, 302)
        self.admin.is_active = False
        self.assertEqual(
            views.admin_export_download(self.request(self.admin)).status_code, 302
        )
        self.admin.is_active = True
        self.assertEqual(
            views.admin_export_download(
                self.request(self.admin, method="get")
            ).status_code,
            405,
        )
        response = views.admin_export_download(self.request(self.admin))
        self.addCleanup(response.close)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/octet-stream")
        self.assertIn(".ptartenc", response["Content-Disposition"])
        self.assertIn("attachment;", response["Content-Disposition"])
        self.assertIn("no-store", response["Cache-Control"])
        self.assert_encrypted_zip(b"".join(response.streaming_content))

    def assert_encrypted_zip(self, data, passphrase="example passphrase 123"):
        self.assertEqual(data[:9], b"PTARTENC\x01")
        key = Scrypt(salt=data[9:25], length=32, n=32768, r=8, p=1).derive(
            passphrase.encode("utf-8")
        )
        plaintext = AESGCM(key).decrypt(data[25:37], data[37:], data[:37])
        with zipfile.ZipFile(io.BytesIO(plaintext)) as archive:
            self.assertIn("legacy.sqlite3", archive.namelist())

    def test_post_requires_csrf_and_uses_registered_routes(self):
        self.assertEqual(reverse("admin-export-download"), "/export/download/")
        client = Client(enforce_csrf_checks=True)
        client.force_login(self.admin)
        self.assertEqual(client.get(reverse("admin-export")).status_code, 302)
        session = client.session
        session[DEVICE_ID_SESSION_KEY] = self.device.persistent_id
        session.save()
        self.assertEqual(client.get(reverse("admin-export")).status_code, 200)
        response = client.post(reverse("admin-export-download"))
        self.assertEqual(response.status_code, 403)
        response = client.post(
            reverse("admin-export-download"),
            {"passphrase": "example passphrase 123", "passphrase_confirm": "example passphrase 123"},
            HTTP_X_CSRFTOKEN=client.cookies["csrftoken"].value,
        )
        self.addCleanup(response.close)
        self.assertEqual(response.status_code, 200)
        self.assert_encrypted_zip(b"".join(response.streaming_content))

    def test_invalid_passphrases_refuse_before_build_without_echoing_secrets(self):
        for password, confirm in (
            ("", ""),
            ("too short", "too short"),
            ("example passphrase 123", "different passphrase 123"),
            ("é" * 513, "é" * 513),
        ):
            with self.subTest(length=len(password)):
                with patch.object(export, "build_export") as build:
                    response = views.admin_export_download(self.request(self.admin, data={
                        "passphrase": password, "passphrase_confirm": confirm,
                    }))
                self.assertEqual(response.status_code, 400)
                self.assertIn("no-store", response["Cache-Control"])
                if password:
                    self.assertNotContains(response, password, status_code=400)
                build.assert_not_called()

    def test_export_accepts_exact_utf8_byte_limit_without_normalization(self):
        passphrase = "é" * 512
        response = views.admin_export_download(self.request(self.admin, data={
            "passphrase": passphrase, "passphrase_confirm": passphrase,
        }))
        self.addCleanup(response.close)
        self.assertEqual(response.status_code, 200)
        self.assert_encrypted_zip(b"".join(response.streaming_content), passphrase)

    def test_each_export_uses_fresh_salt_and_nonce(self):
        first = views.admin_export_download(self.request(self.admin))
        second = views.admin_export_download(self.request(self.admin))
        self.addCleanup(first.close)
        self.addCleanup(second.close)
        one = b"".join(first.streaming_content)
        two = b"".join(second.streaming_content)
        self.assertNotEqual(one[9:25], two[9:25])
        self.assertNotEqual(one[25:37], two[25:37])
        self.assert_encrypted_zip(one)
        self.assert_encrypted_zip(two)

    def test_failed_build_closes_temporary_file(self):
        stream = io.BytesIO()
        with patch.object(export.tempfile, "TemporaryFile", return_value=stream):
            with patch.object(export, "build_export", side_effect=OSError("disk full")):
                with self.assertRaises(OSError):
                    export.export_to_tempfile(self.admin)
        self.assertTrue(stream.closed)

    def test_failed_encryption_closes_both_temporary_files(self):
        plaintext, encrypted = io.BytesIO(b"zip"), io.BytesIO()
        with patch.object(export, "export_to_tempfile", return_value=(plaintext, {})):
            with patch.object(export.tempfile, "TemporaryFile", return_value=encrypted):
                with patch.object(export, "encrypt_archive", side_effect=OSError("disk full")):
                    with self.assertRaises(OSError):
                        export.encrypted_export_to_tempfile(self.admin, "example passphrase 123")
        self.assertTrue(plaintext.closed)
        self.assertTrue(encrypted.closed)

    def test_page_has_csrf_download_form_and_secret_warning(self):
        response = views.admin_export(self.request(self.admin, method="get"))
        self.assertContains(response, 'name="csrfmiddlewaretoken"')
        self.assertContains(response, "This archive contains credentials")
        self.assertContains(response, reverse("admin-export-download"))
        self.assertContains(response, "Pause all other writers")
        self.assertContains(response, 'name="passphrase"')
        self.assertContains(response, 'name="passphrase_confirm"')
        self.assertContains(response, 'type="password"', count=2)
        self.assertContains(response, "passphrase is sent to the server")
        self.assertContains(response, "use HTTPS")
        self.assertContains(response, "encrypted temporary storage")

    def test_missing_media_returns_error_page_not_partial_download(self):
        self.file.unlink()
        with self.assertLogs("ptart.views", level="WARNING"):
            response = views.admin_export_download(self.request(self.admin))
        self.assertEqual(response.status_code, 409)
        self.assertContains(response, "Export refused", status_code=409)
        self.assertNotIn("Content-Disposition", response)
