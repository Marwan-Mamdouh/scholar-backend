"""Upload/CV file validation (framework-independent, works on bytes)."""

import io
import zipfile
from typing import Optional

from app.config import settings

ALLOWED_EXTENSIONS = {".pdf", ".docx"}


class FileValidationError(Exception):
    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message
        super().__init__(message)


def _extension(filename: Optional[str]) -> str:
    if not filename or "." not in filename:
        return ""
    return "." + filename.rsplit(".", 1)[-1].lower()


def _sniff_file_type(content: bytes) -> Optional[str]:
    """Best-effort content-based type detection."""
    if content.startswith(b"%PDF"):
        return "pdf"
    if content[:2] == b"PK":
        try:
            with zipfile.ZipFile(io.BytesIO(content)) as zf:
                if any(n.startswith("word/") for n in zf.namelist()):
                    return "docx"
                return "zip"
        except zipfile.BadZipFile:
            return "corrupted_zip"
    return None


def validate_file(filename: str, content: bytes) -> str:
    """Validate a CV file. Returns the canonical file type ('pdf'|'docx').

    Raises FileValidationError with a machine-readable code on any failure.
    """
    ext = _extension(filename)
    if ext not in ALLOWED_EXTENSIONS:
        raise FileValidationError(
            "UNSUPPORTED_FILE_TYPE",
            "Only PDF and DOCX CVs are supported.",
        )

    if not content:
        raise FileValidationError("EMPTY_FILE", "The file is empty.")

    max_bytes = settings.max_cv_size_mb * 1024 * 1024
    if len(content) > max_bytes:
        raise FileValidationError(
            "FILE_TOO_LARGE",
            f"The file exceeds the maximum size of {settings.max_cv_size_mb} MB.",
        )

    sniffed = _sniff_file_type(content)
    expected = ext.lstrip(".")
    # Both supported formats have reliable magic bytes; an unrecognized
    # payload means the file is corrupted or mislabeled.
    if sniffed is None or sniffed not in (expected, "corrupted_zip"):
        raise FileValidationError(
            "CORRUPTED_FILE",
            "The file content does not match its extension and appears corrupted.",
        )
    if sniffed == "corrupted_zip":
        raise FileValidationError(
            "CORRUPTED_FILE", "The file appears to be corrupted."
        )

    return expected
