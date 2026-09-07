from typing import List, Optional, Union

from pydantic import BaseModel, Field

from app.schemas.common import Location


class GPAValue(BaseModel):
    """Allows either a numeric GPA or a qualitative raw value; never converts one to the other."""

    raw: Optional[str] = None
    numeric: Optional[float] = None
    scale: Optional[float] = None


class Education(BaseModel):
    id: Optional[str] = None
    institution: Optional[str] = None
    faculty: Optional[str] = None
    department: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    graduation_year: Optional[int] = None
    gpa: Optional[Union[float, str, GPAValue]] = None
    gpa_scale: Optional[float] = None
    class_rank: Optional[str] = None
    honors: List[str] = Field(default_factory=list)
    description: Optional[str] = None
    location: Optional[Location] = None
