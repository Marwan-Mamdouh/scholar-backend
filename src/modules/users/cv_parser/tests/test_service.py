import json
import subprocess
import sys
from pathlib import Path

from app.ai.client import AIParsingError, OutputValidationError
from app.services.cv_service import CVService, CVServiceError
from app.services.validation import FileValidationError
from tests.conftest import MockCVParser, make_docx_bytes, make_pdf_bytes

ROOT = Path(__file__).resolve().parent.parent


def test_parse_pdf_happy_path():
    service = CVService(parser=MockCVParser())
    result = service.parse_cv("cv.pdf", make_pdf_bytes())
    assert result["personal_information"]["full_name"] == "Example Candidate"
    assert result["education"][0]["institution"] == "Zagazig University"
    assert [s["name"] for s in result["skills"]].count("Python") == 1


def test_parse_docx_happy_path():
    service = CVService(parser=MockCVParser())
    result = service.parse_cv("cv.docx", make_docx_bytes())
    assert result["work_experience"][0]["currently_working"] is True


def test_ai_failure_raises_controlled_error():
    service = CVService(parser=MockCVParser(fail_with=AIParsingError("boom")))
    try:
        service.parse_cv("cv.pdf", make_pdf_bytes())
        assert False, "expected CVServiceError"
    except CVServiceError as exc:
        assert exc.code == "CV_PARSING_FAILED"
        assert "boom" not in exc.message  # internals not leaked


def test_validation_failure_raises_controlled_error():
    service = CVService(
        parser=MockCVParser(fail_with=OutputValidationError("bad", "[]"))
    )
    try:
        service.parse_cv("cv.pdf", make_pdf_bytes())
        assert False, "expected CVServiceError"
    except CVServiceError as exc:
        assert exc.code == "OUTPUT_VALIDATION_FAILED"


def test_extract_text_debug_helper():
    service = CVService(parser=MockCVParser())
    result = service.extract_text("cv.pdf", make_pdf_bytes())
    assert result["file_type"] == "pdf"
    assert "Zagazig University" in result["full_text"]
    assert result["pages"][0]["page"] == 1


def test_missing_file_returns_cli_error(tmp_path):
    r = subprocess.run(
        [sys.executable, str(ROOT / "parse_cv.py"), str(tmp_path / "nope.pdf")],
        capture_output=True, text=True,
    )
    assert r.returncode == 1
    body = json.loads(r.stdout)
    assert body["success"] is False
    assert body["error"]["code"] == "FILE_NOT_FOUND"


def test_cli_missing_argument_returns_json_error():
    r = subprocess.run(
        [sys.executable, str(ROOT / "parse_cv.py")],
        capture_output=True, text=True,
    )
    assert r.returncode == 1
    body = json.loads(r.stdout)
    assert body["success"] is False
    assert body["error"]["code"] == "INVALID_ARGUMENTS"


def test_cli_extract_text(tmp_path):
    cv = tmp_path / "cv.pdf"
    cv.write_bytes(make_pdf_bytes())
    r = subprocess.run(
        [sys.executable, str(ROOT / "parse_cv.py"), str(cv), "--extract-text"],
        capture_output=True, text=True,
    )
    assert r.returncode == 0
    body = json.loads(r.stdout)
    assert body["success"] is True
    assert "Zagazig University" in body["data"]["full_text"]


def test_cli_writes_output_file(tmp_path, monkeypatch):
    cv = tmp_path / "cv.pdf"
    cv.write_bytes(make_pdf_bytes())
    out = tmp_path / "out.json"
    r = subprocess.run(
        [sys.executable, str(ROOT / "parse_cv.py"), str(cv),
         "--extract-text", "-o", str(out)],
        capture_output=True, text=True,
    )
    assert r.returncode == 0
    assert json.loads(r.stdout)["success"] is True
    assert json.loads(out.read_text(encoding="utf-8"))["success"] is True
