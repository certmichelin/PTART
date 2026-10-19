"""Isolated test database; run from app/ so catalog data migrations find data/."""

from .settings import *  # noqa: F403

SECRET_KEY = "tests-only-not-for-deployment"
DEBUG = False
DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}}
CSRF_TRUSTED_ORIGINS = ["http://testserver"]
MEDIA_ROOT = "/tmp/ptart-test-media-unused"
