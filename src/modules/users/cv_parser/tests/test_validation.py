from app.services.validation import FileValidationError, validate_file
from tests.conftest import make_pdf_bytes


def test_rejects_unsupported_extension():
    try:
        validate_file("cv.txt", b"hello")
        assert False
    except FileValidationError as exc:
        assert exc.code == "UNSUPPORTED_FILE_TYPE"


def test_rejects_empty_file():
    try:
        validate_file("cv.pdf", b"")
        assert False
    except FileValidationError as exc:
        assert exc.code == "EMPTY_FILE"


def test_rejects_mismatched_content():
    # .pdf extension but plain-text content
    try:
        validate_file("cv.pdf", b"not a pdf")
        assert False
    except FileValidationError as exc:
        assert exc.code == "CORRUPTED_FILE"


def test_rejects_oversized():
    big = b"%PDF" + b"\x00" * (11 * 1024 * 1024)
    try:
        validate_file("cv.pdf", big)
        assert False
    except FileValidationError as exc:
        assert exc.code == "FILE_TOO_LARGE"


def test_rejects_corrupted_pdf():
    from app.services.cv_service import CVService, CVServiceError
    from tests.conftest import MockCVParser

    service = CVService(parser=MockCVParser())
    try:
        service.extract_text("cv.pdf", b"%PDF broken content")
        assert False, "expected extraction failure"
    except CVServiceError as exc:
        assert exc.code == "DOCUMENT_EXTRACTION_FAILED"


def test_validate_file_returns_type():
    assert validate_file("ok.pdf", make_pdf_bytes()) == "pdf"
