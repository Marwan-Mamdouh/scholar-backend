"""Conservative text cleaning: remove obvious extraction noise, keep meaning."""

import re
from typing import List

from app.services.document_extractor import ExtractedDocument, Page

_MULTI_SPACE = re.compile(r"[ \t]+")
_BLANK_LINES = re.compile(r"\n{3,}")


def _clean_page_text(text: str) -> str:
    text = _MULTI_SPACE.sub(" ", text)
    text = "\n".join(line.strip() for line in text.splitlines())
    text = _BLANK_LINES.sub("\n\n", text)
    return text.strip()


def _find_repeated_lines(pages: List[Page]) -> set:
    """Lines appearing (case-insensitively, normalized) on >= 60% of pages
    with 2+ pages are treated as running headers/footers."""
    if len(pages) < 2:
        return set()
    threshold = 0.6 * len(pages)
    counts: dict[str, int] = {}
    for page in pages:
        seen = set()
        for line in page.text.splitlines():
            key = re.sub(r"\s+", " ", line.strip().lower())
            if key and len(key) <= 100 and key not in seen:
                seen.add(key)
                counts[key] = counts.get(key, 0) + 1
    return {k for k, c in counts.items() if c >= threshold and len(k) > 3}


def clean_document(document: ExtractedDocument) -> ExtractedDocument:
    """Return a cleaned copy of the document. Never removes content lines
    that are not clearly repeated headers/footers."""
    repeated = _find_repeated_lines(document.pages)
    cleaned_pages = []
    for page in document.pages:
        text = _clean_page_text(page.text)
        if repeated:
            kept = [
                line
                for line in text.splitlines()
                if re.sub(r"\s+", " ", line.strip().lower()) not in repeated
            ]
            text = "\n".join(kept)
        cleaned_pages.append(Page(page=page.page, text=_clean_page_text(text)))
    return ExtractedDocument(
        filename=document.filename,
        file_type=document.file_type,
        pages=cleaned_pages,
    )
