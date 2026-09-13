#!/usr/bin/env python
"""CV Parser CLI.

Usage:
    python parse_cv.py <cv.pdf | cv.docx> [-o output.json] [--extract-text]
    python parse_cv.py --make-sample sample.pdf|sample.docx

Reads a CV file, runs the extraction + AI parsing pipeline, and prints the
structured JSON (or writes it to a file with -o). Exit code is 0 on success,
1 on any controlled failure (error JSON is printed to stdout).
"""

import argparse
import json
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

# Windows consoles default to a legacy codepage; CV text is Unicode.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from app.ai.client import GeminiCVParser  # noqa: E402
from app.config import settings  # noqa: E402
from app.services.cv_service import CVService, CVServiceError  # noqa: E402
from app.services.validation import FileValidationError  # noqa: E402


class JsonArgumentParser(argparse.ArgumentParser):
    def error(self, message: str) -> None:
        _fail("INVALID_ARGUMENTS", message)
        raise SystemExit(1)


def _fail(code: str, message: str) -> int:
    print(json.dumps({
        "success": False,
        "error": {"code": code, "message": message},
    },
        indent=2, ensure_ascii=False,
    ))
    return 1


def _make_sample(path: str) -> int:
    """Generate a small sample CV for testing the pipeline."""
    from tests.conftest import make_docx_bytes, make_pdf_bytes

    content = make_pdf_bytes() if path.lower().endswith(".pdf") else make_docx_bytes()
    Path(path).write_bytes(content)
    print(json.dumps({
        "success": True,
        "data": {"message": "Sample CV written", "path": path},
    }, indent=2, ensure_ascii=False))
    return 0


def main(argv=None) -> int:
    parser = JsonArgumentParser(description="CV -> structured JSON (CLI)")
    parser.add_argument("file", nargs="?", help="Path to a PDF or DOCX CV")
    parser.add_argument("-o", "--output", help="Write JSON to this file instead of stdout")
    parser.add_argument("--extract-text", action="store_true",
                        help="Print extracted text only (no AI call)")
    parser.add_argument("--make-sample", metavar="PATH",
                        help="Create a sample PDF/DOCX CV at PATH and exit")
    parser.add_argument("-v", "--verbose", action="store_true",
                        help="Verbose logging")
    args = parser.parse_args(argv)

    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.WARNING)

    if args.make_sample:
        return _make_sample(args.make_sample)

    if not args.file:
        parser.error("a CV file is required (or use --make-sample)")

    path = Path(args.file)
    if not path.is_file():
        return _fail("FILE_NOT_FOUND", f"No such file: {args.file}")

    content = path.read_bytes()

    if args.extract_text:
        service = CVService(parser=None)
        try:
            result = service.extract_text(path.name, content)
        except (FileValidationError, CVServiceError) as exc:
            return _fail(exc.code, exc.message)
        payload = {"success": True, "data": result}
    else:
        if not settings.ai_api_key:
            return _fail(
                "AI_NOT_CONFIGURED",
                "No AI_API_KEY configured. Copy .env.example to .env and set it.",
            )
        service = CVService(parser=GeminiCVParser())
        try:
            data = service.parse_cv(path.name, content)
        except (FileValidationError, CVServiceError) as exc:
            return _fail(exc.code, exc.message)
        payload = {"success": True, "data": data}

    text = json.dumps(payload, indent=2, ensure_ascii=False)
    if args.output:
        Path(args.output).write_text(text, encoding="utf-8")
    print(text)
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception:
        logging.exception("Unhandled CLI error")
        sys.exit(_fail("INTERNAL_ERROR", "An unexpected error occurred."))
