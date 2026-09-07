from typing import List, Literal, Optional

from pydantic import BaseModel

ProjectType = Literal[
    "graduation_project",
    "academic_project",
    "research_project",
    "professional_project",
    "personal_project",
    "open_source_project",
    "competition_project",
    "other",
]


class Project(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = None
    project_type: Optional[ProjectType] = None
    organization: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    achievements: List[str] = []
    technologies: List[str] = []
    domains: List[str] = []
    github_url: Optional[str] = None
    project_url: Optional[str] = None
    supervisors: List[str] = []
    sponsors: List[str] = []
    team_size: Optional[int] = None
