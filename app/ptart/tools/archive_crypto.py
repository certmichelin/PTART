"""Authenticated streaming envelope for whole-instance migration archives."""

import os
import tempfile

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt
from django.views.decorators.debug import sensitive_variables


MAGIC = b"PTARTENC\x01"
HEADER_SIZE = len(MAGIC) + 16 + 12
TAG_SIZE = 16
CHUNK_SIZE = 1024 * 1024
AUTH_ERROR = "Unable to authenticate encrypted archive."


class ArchiveCryptoError(Exception):
    """The encrypted archive is truncated, corrupt, or has the wrong passphrase."""


@sensitive_variables("passphrase")
def valid_passphrase(passphrase, minimum=1):
    if not isinstance(passphrase, str) or not minimum <= len(passphrase) <= 1024:
        return False
    try:
        return len(passphrase.encode("utf-8")) <= 1024
    except UnicodeEncodeError:
        return False


@sensitive_variables("passphrase")
def _key(passphrase, salt):
    return Scrypt(salt=salt, length=32, n=32768, r=8, p=1).derive(
        passphrase.encode("utf-8")
    )


def is_encrypted(stream):
    position = stream.tell()
    try:
        return stream.read(len(MAGIC)) == MAGIC
    finally:
        stream.seek(position)


@sensitive_variables("passphrase", "chunk")
def encrypt_archive(source, destination, passphrase):
    """Encrypt a complete ZIP from source into destination in bounded chunks."""
    if not valid_passphrase(passphrase, minimum=16):
        raise ValueError("Invalid export passphrase.")
    salt, nonce = os.urandom(16), os.urandom(12)
    header = MAGIC + salt + nonce
    encryptor = Cipher(algorithms.AES(_key(passphrase, salt)), modes.GCM(nonce)).encryptor()
    encryptor.authenticate_additional_data(header)
    destination.write(header)
    for chunk in iter(lambda: source.read(CHUNK_SIZE), b""):
        destination.write(encryptor.update(chunk))
    destination.write(encryptor.finalize())
    destination.write(encryptor.tag)


@sensitive_variables("passphrase", "chunk")
def decrypt_to_tempfile(source, passphrase):
    """Return a private ZIP stream only after its complete tag is authenticated."""
    output = tempfile.TemporaryFile()
    try:
        if not valid_passphrase(passphrase):
            raise ArchiveCryptoError(AUTH_ERROR)
        source.seek(0, os.SEEK_END)
        size = source.tell()
        if size < HEADER_SIZE + TAG_SIZE:
            raise ArchiveCryptoError(AUTH_ERROR)
        source.seek(0)
        header = source.read(HEADER_SIZE)
        if len(header) != HEADER_SIZE or header[:len(MAGIC)] != MAGIC:
            raise ArchiveCryptoError(AUTH_ERROR)
        source.seek(size - TAG_SIZE)
        tag = source.read(TAG_SIZE)
        if len(tag) != TAG_SIZE:
            raise ArchiveCryptoError(AUTH_ERROR)
        decryptor = Cipher(
            algorithms.AES(_key(passphrase, header[9:25])),
            modes.GCM(header[25:37], tag),
        ).decryptor()
        decryptor.authenticate_additional_data(header)
        source.seek(HEADER_SIZE)
        remaining = size - HEADER_SIZE - TAG_SIZE
        while remaining:
            chunk = source.read(min(CHUNK_SIZE, remaining))
            if not chunk:
                raise ArchiveCryptoError(AUTH_ERROR)
            remaining -= len(chunk)
            output.write(decryptor.update(chunk))
        try:
            output.write(decryptor.finalize())
        except InvalidTag:
            raise ArchiveCryptoError(AUTH_ERROR) from None
        output.seek(0)
        return output
    except BaseException:
        output.close()
        raise
