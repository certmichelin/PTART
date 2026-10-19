import sqlite3
import zipfile

from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError
from django.db import DatabaseError

from ptart.tools.admin_export import ExportError
from ptart.tools.admin_import import ArchiveImportError, import_archive


class Command(BaseCommand):
    help = "Import an admin export ZIP into a fresh PTART database and media directory."

    def add_arguments(self, parser):
        parser.add_argument("archive", help="Path to a trusted PTART admin export ZIP")

    def handle(self, *args, **options):
        try:
            manifest = import_archive(options["archive"])
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
