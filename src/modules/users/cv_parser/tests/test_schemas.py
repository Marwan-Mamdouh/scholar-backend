import pytest
from pydantic import ValidationError

from app.schemas.cv import CVProfile
from app.services.cv_service import _normalize_profile


def test_empty_profile_valid():
    profile = CVProfile.model_validate({})
    assert profile.education == []
    assert profile.skills == []
    assert profile.personal_information.full_name is None
    assert profile.online_profiles.github is None


def test_full_sample_profile_valid():
    from tests.conftest import SAMPLE_PROFILE

    profile = CVProfile.model_validate(SAMPLE_PROFILE)
    assert profile.education[0].gpa == 3.81
    assert profile.work_experience[0].currently_working is True
    assert profile.projects[0].project_type == "graduation_project"


def test_malformed_output_rejected():
    with pytest.raises(ValidationError):
        CVProfile.model_validate({"education": "I studied at MIT"})
    with pytest.raises(ValidationError):
        CVProfile.model_validate({"skills": [{"name": "Python", "category": "not_a_category"}]})
    with pytest.raises(ValidationError):
        CVProfile.model_validate({"education": [{"graduation_year": "twenty twenty five"}]})


def test_multiple_records_preserved():
    profile = CVProfile.model_validate(
        {
            "education": [{"institution": "A"}, {"institution": "B"}, {"institution": "C"}],
            "work_experience": [{"company": "X"}, {"company": "Y"}],
        }
    )
    assert len(profile.education) == 3
    assert len(profile.work_experience) == 2


def test_skill_dedup_and_id_assignment():
    from tests.conftest import SAMPLE_PROFILE

    profile = _normalize_profile(CVProfile.model_validate(SAMPLE_PROFILE))
    names = [s.name for s in profile.skills]
    assert names.count("Python") == 1  # "python3" merged into "Python"
    assert profile.education[0].id == "edu_001"
    assert profile.work_experience[0].id == "work_001"


def test_gpa_object_flattened():
    profile = CVProfile.model_validate({
        "education": [{
            "institution": "MIT",
            "end_date": "2025-08",
            "gpa": {"raw": None, "numeric": 3.81, "scale": 4.0},
            "honors": ["ranked 2nd in class"],
        }]
    })
    _normalize_profile(profile)
    edu = profile.education[0]
    assert edu.gpa == 3.81
    assert edu.gpa_scale == 4.0
    assert edu.graduation_year == 2025
    assert edu.class_rank == "2nd"


def test_qualitative_gpa_preserved_as_text():
    profile = CVProfile.model_validate({
        "education": [{"gpa": {"raw": "Excellent with Honors", "numeric": None, "scale": None}}]
    })
    _normalize_profile(profile)
    assert profile.education[0].gpa == "Excellent with Honors"


def test_skills_grouped_by_category():
    profile = CVProfile.model_validate({
        "skills": [
            {"name": "Verilog", "category": "hdl"},
            {"name": "Python", "category": "programming_language"},
            {"name": "Vivado", "category": "eda_tool"},
        ]
    })
    _normalize_profile(profile)
    cats = [s.category for s in profile.skills]
    assert cats == ["programming_language", "hdl", "eda_tool"]
