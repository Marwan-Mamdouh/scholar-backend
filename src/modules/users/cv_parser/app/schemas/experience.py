from typing import List, Optional

from pydantic import BaseModel

from app.schemas.common import Location


class WorkExperience(BaseModel):
    id: Optional[str] = None
    company: Optional[str] = None
    position: Optional[str] = None
    location: Optional[Location] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    currently_working: bool = False
    description: Optional[str] = None
    responsibilities: List[str] = []
    achievements: List[str] = []
    technologies: List[str] = []
    domains: List[str] = []


class Internship(BaseModel):
    id: Optional[str] = None
    company: Optional[str] = None
    position: Optional[str] = None
    location: Optional[Location] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    technologies: List[str] = []
    domains: List[str] = []
    supervisor: Optional[str] = None


class ResearchExperience(BaseModel):
    id: Optional[str] = None
    institution: Optional[str] = None
    position: Optional[str] = None
    research_group: Optional[str] = None
    supervisor: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    currently_active: bool = False
    research_topics: List[str] = []
    description: Optional[str] = None
    technologies: List[str] = []
