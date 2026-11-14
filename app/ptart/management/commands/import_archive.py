import getpass
import os
import warnings
import sqlite3
import zipfile

from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError
from django.db import DatabaseError
from django.views.decorators.debug import sensitive_variables

from ptart.tools.admin_export import ExportError
from ptart.tools.admin_import import ArchiveImportError, import_archive
from ptart.tools.archive_crypto import is_encrypted


def prompt_passphrase():
    try:
        fd = os.open("/dev/tty", os.O_RDWR | os.O_NOCTTY)
        try:
            terminal = os.fdopen(fd, "w", encoding="utf-8")
        except BaseException:
            os.close(fd)
            raise
        with terminal:
            if not terminal.isatty():
                raise OSError("Not a terminal")
            with warnings.catch_warnings():
                warnings.simplefilter("error", getpass.GetPassWarning)
                return getpass.getpass("Archive passphrase: ", stream=terminal)
    except (OSError, EOFError, getpass.GetPassWarning):
        raise CommandError("Encrypted archive requires a controlling terminal with echo disabled.") from None


class Command(BaseCommand):
    help = "Import an admin export into a fresh PTART database and media directory."

    def add_arguments(self, parser):
        parser.add_argument("archive", help="Path to a trusted PTART admin export")

    @sensitive_variables("passphrase")
    def handle(self, *args, **options):
        try:
            self.stderr.write("Import stages plaintext; temporary storage must be encrypted.")
            with open(options["archive"], "rb") as source:
                encrypted = is_encrypted(source)
            passphrase = prompt_passphrase() if encrypted else None
            manifest = import_archive(options["archive"], passphrase=passphrase)
        except (ArchiveImportError, ExportError) as error:
            raise CommandError(str(error)) from error
        except (
            OSError,
            DatabaseError,
            sqlite3.Error,
            zipfile.BadZipFile,
            ValidationError,
            KeyError,
            TypeError,
            ValueError,
            AttributeError,
            RuntimeError,
        ) as error:
            # Database/validation errors can contain credential values; do not print them.
            raise CommandError(
                "Import failed. Check archive integrity, schema, constraints, permissions and free disk space. "
                "Database changes were rolled back; inspect the media directory before retrying."
            ) from error
        self.stdout.write(
            self.style.SUCCESS(
                f"Imported {len(manifest['tables'])} tables and {manifest['media']['count']} media files. "
                "Sign in with an imported account."
            )
        )
