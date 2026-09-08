"""Date normalization for CV-extracted date strings.

Never invents precision: a bare year stays "YYYY", a month-year becomes
"YYYY-MM", a full date becomes "YYYY-MM-DD". Values that cannot be safely
normalized are returned unchanged so the raw text survives.
"""

import re
from typing import Optional

MONTHS = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
    "jul": 7, "aug": 8, "sep": 9, "sept": 9, "oct": 10, "nov": 11, "dec": 12,
    "january": 1, "february": 2, "march": 3, "april": 4, "june": 6,
    "july": 7, "august": 8, "september": 9, "october": 10,
    "november": 11, "december": 12,
}

# July 2025 / Jul 2025
_MONTH_YEAR = re.compile(r"^\s*([A-Za-z]+)\.?\s+(\d{4})\s*$")
# 07/2025 or 07-2025
_MM_YYYY = re.compile(r"^\s*(\d{1,2})[/\-.](\d{4})\s*$")
# 2025-07 or 2025-07-14 (already ISO — validate shape only)
_ISO = re.compile(r"^\s*(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?\s*$")
# 14 July 2025 / 14 Jul 2025
_D_MONTH_YEAR = re.compile(r"^\s*(\d{1,2})\s+([A-Za-z]+)\.?\s+(\d{4})\s*$")


def normalize_date(raw: Optional[str]) -> Optional[str]:
    """Normalize a CV date string to YYYY, YYYY-MM, or YYYY-MM-DD.

    Returns the original string unchanged when normalization is uncertain
    (e.g. "Summer 2025", "Present"), never a fabricated precise date.
    """
    if not raw or not isinstance(raw, str):
        return raw

    s = raw.strip()

    m = _MONTH_YEAR.match(s)
    if m:
        month = MONTHS.get(m.group(1).lower())
        if month:
            return f"{m.group(2)}-{month:02d}"
        return s

    m = _D_MONTH_YEAR.match(s)
    if m:
        month = MONTHS.get(m.group(2).lower())
        if month:
            day = int(m.group(1))
            if 1 <= day <= 31:
                return f"{m.group(3)}-{month:02d}-{day:02d}"
        return s

    m = _MM_YYYY.match(s)
    if m:
        month = int(m.group(1))
        if 1 <= month <= 12:
            return f"{m.group(2)}-{month:02d}"
        return s

    m = _ISO.match(s)
    if m:
        year, month, day = m.group(1), m.group(2), m.group(3)
        if month and not (1 <= int(month) <= 12):
            return s
        if day and not (1 <= int(day) <= 31):
            return s
        return s  # already ISO-shaped at its natural precision

    # Bare year is already handled by _ISO; anything else ("Summer 2025",
    # "Present") stays as-is.
    return s
