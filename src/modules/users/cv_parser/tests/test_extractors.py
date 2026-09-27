from app.services import document_extractor
from app.services.text_cleaner import clean_document

from tests.conftest import make_docx_bytes, make_pdf_bytes


def test_pdf_extraction():
    doc = document_extractor.extract_pdf(make_pdf_bytes(), "cv.pdf")
    assert doc.file_type == "pdf"
    assert len(doc.pages) == 1
    assert doc.pages[0].page == 1
    assert "Zagazig University" in doc.full_text


def test_docx_extraction():
    doc = document_extractor.extract_docx(make_docx_bytes(), "cv.docx")
    assert doc.file_type == "docx"
    assert "Python" in doc.full_text


def test_pdf_corruption_raises():
    try:
        document_extractor.extract_pdf(b"%PDF garbage", "cv.pdf")
        assert False, "expected ExtractionError"
    except document_extractor.ExtractionError:
        pass


def test_cleaner_removes_repeated_headers():
    doc = document_extractor.ExtractedDocument(
        filename="cv.pdf",
        file_type="pdf",
        pages=[
            document_extractor.Page(1, "HEADER LINE John Doe\nEducation\nMIT"),
            document_extractor.Page(2, "HEADER LINE John Doe\nSkills\nPython"),
        ],
    )
    cleaned = clean_document(doc)
    assert "HEADER LINE" not in cleaned.full_text
    assert "MIT" in cleaned.full_text and "Python" in cleaned.full_text


def test_cleaner_collapses_whitespace():
    doc = document_extractor.ExtractedDocument(
        filename="cv.pdf",
        file_type="pdf",
        pages=[document_extractor.Page(1, "Hello    world\n\n\n\nNext")],
    )
    cleaned = clean_document(doc)
    assert "Hello world" in cleaned.full_text
    assert "\n\n\n" not in cleaned.full_text
