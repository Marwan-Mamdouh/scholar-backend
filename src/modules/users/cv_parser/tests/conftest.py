import io
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.schemas.cv import CVProfile  # noqa: E402

SAMPLE_PROFILE = {
    "personal_information": {
        "full_name": "Example Candidate",
        "emails": ["candidate@example.com"],
        "phone_numbers": [],
        "location": {"city": None, "state": None, "country": "Egypt"},
    },
    "summary": "ML engineer with FPGA experience.",
    "education": [
        {
            "id": "edu_001",
            "institution": "Zagazig University",
            "faculty": "Faculty of Engineering",
            "department": "Electronics and Communications Engineering",
            "degree": "Bachelor of Science",
            "field_of_study": "Electronics and Communications Engineering",
            "start_date": None,
            "end_date": "2025-07",
            "graduation_year": 2025,
            "gpa": 3.81,
            "gpa_scale": 4.0,
            "class_rank": "2nd",
            "honors": [],
            "description": None,
        }
    ],
    "work_experience": [
        {
            "id": "work_001",
            "company": "Example Company",
            "position": "Machine Learning Engineer",
            "start_date": "2026-01",
            "end_date": None,
            "currently_working": True,
        }
    ],
    "projects": [
        {
            "id": "project_001",
            "title": "FPGA-Based Hardware Accelerator for Deep Learning",
            "project_type": "graduation_project",
            "technologies": ["FPGA", "Verilog"],
        }
    ],
    "skills": [
        {"name": "Python", "category": "programming_language"},
        {"name": "python3", "category": "programming_language"},
        {"name": "Verilog", "category": "hdl"},
    ],
}


class MockCVParser:
    def __init__(self, profile=None, fail_with=None):
        self.profile = profile if profile is not None else SAMPLE_PROFILE
        self.fail_with = fail_with
        self.calls = 0

    async def parse(self, document_text: str):
        self.calls += 1
        return dict(self.profile)

    async def parse_and_validate(self, document_text: str):
        self.calls += 1
        if self.fail_with:
            raise self.fail_with
        return CVProfile.model_validate(self.profile)


def make_pdf_bytes(text: str = "Example Candidate\nEducation\nZagazig University\nGPA: 3.81/4.00") -> bytes:
    from reportlab.pdfgen import canvas

    buf = io.BytesIO()
    c = canvas.Canvas(buf)
    c.drawString(72, 720, text)
    c.showPage()
    c.save()
    return buf.getvalue()


def make_docx_bytes(text: str = "Example Candidate\nSkills: Python, Verilog") -> bytes:
    import docx as docx_lib

    buf = io.BytesIO()
    d = docx_lib.Document()
    for line in text.splitlines():
        d.add_paragraph(line)
    d.save(buf)
    return buf.getvalue()


@pytest.fixture
def pdf_bytes():
    return make_pdf_bytes()


@pytest.fixture
def docx_bytes():
    return make_docx_bytes()
