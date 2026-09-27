"""Core orchestration: CV file bytes -> validated structured profile dict."""

import logging
import re
from typing import Any

from app.ai.client import AIParsingError, CVParser, OutputValidationError
from app.config import settings
from app.schemas.cv import CVProfile
from app.schemas.education import GPAValue
from app.services import document_extractor, text_cleaner
from app.services.document_extractor import ExtractionError
from app.services.validation import FileValidationError, validate_file

logger = logging.getLogger("cv_parser.service")

_COLLECTION_SECTIONS = {
    "education": "edu",
    "work_experience": "work",
    "internships": "internship",
    "research_experience": "research",
    "projects": "project",
    "publications": "publication",
    "patents": "patent",
}

_SKILL_CANONICAL = [
    ("python3", "Python"),
    ("python 3", "Python"),
    ("pytorch", "PyTorch"),
    ("tensorflow", "TensorFlow"),
    ("c++", "C++"),
    ("c#", "C#"),
    ("node.js", "Node.js"),
    ("react.js", "React"),
]

# Display order for skills: grouped by category, uncategorized last.
_SKILL_CATEGORY_ORDER = {
    "programming_language": 0,
    "hdl": 1,
    "verification": 2,
    "eda_tool": 3,
    "machine_learning": 4,
    "machine_learning_framework": 5,
    "hardware": 6,
    "embedded_systems": 7,
    "database": 8,
    "cloud": 9,
    "operating_system": 10,
    "web": 11,
    "data": 12,
    "research": 13,
    "other": 14,
}

_RANK_RE = re.compile(r"\branked\s+([0-9]+(?:st|nd|rd|th))\b", re.IGNORECASE)
_YEAR_RE = re.compile(r"^(\d{4})")


class CVServiceError(Exception):
    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message
        super().__init__(message)


def _normalize_education(edu) -> None:
    """Flatten GPA objects, derive graduation_year and class_rank."""
    if isinstance(edu.gpa, GPAValue):
        gpa = edu.gpa
        if gpa.numeric is not None:
            object.__setattr__(edu, "gpa", gpa.numeric)
            if edu.gpa_scale is None and gpa.scale is not None:
                object.__setattr__(edu, "gpa_scale", gpa.scale)
        elif gpa.raw is not None:
            # Qualitative GPA stays as raw text; never invented as a number.
            object.__setattr__(edu, "gpa", gpa.raw)

    if edu.graduation_year is None and edu.end_date:
        m = _YEAR_RE.match(edu.end_date.strip())
        if m:
            object.__setattr__(edu, "graduation_year", int(m.group(1)))

    if edu.class_rank is None:
        for honor in edu.honors:
            m = _RANK_RE.search(honor)
            if m:
                object.__setattr__(edu, "class_rank", m.group(1).lower())
                break


def _normalize_profile(profile: CVProfile) -> CVProfile:
    """Deterministic post-parse normalization: ids, education cleanup,
    skill dedup and category grouping."""
    for section, prefix in _COLLECTION_SECTIONS.items():
        items = getattr(profile, section)
        for i, item in enumerate(items, start=1):
            if not getattr(item, "id", None):
                object.__setattr__(item, "id", f"{prefix}_{i:03d}")

    for edu in profile.education:
        _normalize_education(edu)

    seen: set[str] = set()
    deduped = []
    for skill in profile.skills:
        key = skill.name.strip().lower()
        for pattern, canonical in _SKILL_CANONICAL:
            if key == pattern.lower():
                key = canonical.lower()
                if skill.name != canonical:
                    object.__setattr__(skill, "name", canonical)
                break
        if key not in seen:
            seen.add(key)
            deduped.append(skill)
    deduped.sort(
        key=lambda s: _SKILL_CATEGORY_ORDER.get(s.category or "other", 99)
    )
    object.__setattr__(profile, "skills", deduped)
    return profile


class CVService:
    def __init__(self, parser: CVParser):
        self.parser = parser

    def parse_cv(self, filename: str, content: bytes) -> dict[str, Any]:
        file_type = validate_file(filename, content)  # raises FileValidationError

        try:
            document = document_extractor.extract_document(
                content, file_type, filename
            )
        except ExtractionError as exc:
            raise CVServiceError(
                "DOCUMENT_EXTRACTION_FAILED", "The CV could not be read."
            ) from exc

        document = text_cleaner.clean_document(document)
        full_text = document.full_text
        if len(full_text) > settings.max_cv_text_chars:
            raise CVServiceError(
                "CV_TEXT_TOO_LONG",
                "The CV text exceeds the maximum supported length.",
            )
        if not full_text.strip():
            raise CVServiceError(
                "DOCUMENT_EXTRACTION_FAILED", "The CV could not be read."
            )

        page_marked = "\n".join(
            f"--- Page {p.page} ---\n{p.text}" for p in document.pages
        )

        try:
            profile = asyncio_run(self.parser.parse_and_validate(page_marked))
            # print("LOG: Starting CV parsing...",, flush=True)
        except AIParsingError:
            raise CVServiceError(
                "CV_PARSING_FAILED",
                "The CV could not be converted into structured data.",
            )
        except OutputValidationError:
            raise CVServiceError(
                "OUTPUT_VALIDATION_FAILED",
                "The extracted profile did not pass schema validation.",
            )

        return _normalize_profile(profile).model_dump(exclude_none=False)

    def extract_text(self, filename: str, content: bytes) -> dict[str, Any]:
        """Debug helper: extraction only, no AI."""
        file_type = validate_file(filename, content)
        try:
            document = document_extractor.extract_document(
                content, file_type, filename
            )
        except ExtractionError as exc:
            raise CVServiceError(
                "DOCUMENT_EXTRACTION_FAILED", "The CV could not be read."
            ) from exc
        document = text_cleaner.clean_document(document)
        return {
            "filename": document.filename,
            "file_type": document.file_type,
            "pages": [{"page": p.page, "text": p.text} for p in document.pages],
            "full_text": document.full_text,
        }


def asyncio_run(coro):
    import asyncio

    return asyncio.run(coro)
