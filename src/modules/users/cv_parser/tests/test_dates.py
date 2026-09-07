from utils.dates import normalize_date


def test_month_name_year():
    assert normalize_date("July 2025") == "2025-07"
    assert normalize_date("Jul 2025") == "2025-07"
    assert normalize_date("Sept. 2024") == "2024-09"


def test_day_month_year():
    assert normalize_date("14 July 2025") == "2025-07-14"


def test_numeric_month_year():
    assert normalize_date("07/2025") == "2025-07"
    assert normalize_date("12-2023") == "2023-12"


def test_bare_year_stays_year():
    assert normalize_date("2025") == "2025"
    assert normalize_date("2025-01-01") == "2025-01-01"


def test_uncertain_dates_preserved():
    assert normalize_date("Summer 2025") == "Summer 2025"
    assert normalize_date("Present") == "Present"


def test_none_passthrough():
    assert normalize_date(None) is None
    assert normalize_date("") == ""
