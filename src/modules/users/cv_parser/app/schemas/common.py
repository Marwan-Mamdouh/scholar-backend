from typing import Literal, Optional

from pydantic import BaseModel, Field

SkillCategory = Literal[
    "programming_language",
    "machine_learning",
    "machine_learning_framework",
    "hdl",
    "eda_tool",
    "hardware",
    "database",
    "cloud",
    "operating_system",
    "verification",
    "embedded_systems",
    "web",
    "data",
    "research",
    "other",
]


class Location(BaseModel):
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None


class Skill(BaseModel):
    name: str
    category: Optional[SkillCategory] = None


class Language(BaseModel):
    language: str
    proficiency: Optional[str] = None
