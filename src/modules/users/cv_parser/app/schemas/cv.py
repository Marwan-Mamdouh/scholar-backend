from typing import List, Optional

from pydantic import BaseModel, Field

from app.schemas.common import Language, Location, Skill
from app.schemas.education import Education
from app.schemas.experience import Internship, ResearchExperience, WorkExperience
from app.schemas.misc import (
    Award,
    Certification,
    Course,
    ProfessionalMembership,
    Reference,
    Scholarship,
    TeachingExperience,
    Volunteering,
)
from app.schemas.project import Project
from app.schemas.publication import Patent, Publication


class PersonalInformation(BaseModel):
    full_name: Optional[str] = None
    emails: List[str] = []
    phone_numbers: List[str] = []
    location: Location = Field(default_factory=Location)


class OnlineProfiles(BaseModel):
    linkedin: Optional[str] = None
    github: Optional[str] = None
    google_scholar: Optional[str] = None
    orcid: Optional[str] = None
    personal_website: Optional[str] = None
    portfolio: Optional[str] = None
    other: List[str] = []


class OtherSectionItem(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class OtherSection(BaseModel):
    section_name: str
    items: List[OtherSectionItem] = []


class EvidenceSource(BaseModel):
    page: Optional[int] = None
    section: Optional[str] = None
    text: Optional[str] = None


class EvidenceFact(BaseModel):
    path: str
    confidence: Optional[float] = None
    source: Optional[EvidenceSource] = None


class ExtractionMetadata(BaseModel):
    facts: List[EvidenceFact] = []


class CVProfile(BaseModel):
    personal_information: PersonalInformation = Field(default_factory=PersonalInformation)
    summary: Optional[str] = None
    education: List[Education] = []
    work_experience: List[WorkExperience] = []
    internships: List[Internship] = []
    research_experience: List[ResearchExperience] = []
    projects: List[Project] = []
    publications: List[Publication] = []
    patents: List[Patent] = []
    awards: List[Award] = []
    scholarships: List[Scholarship] = []
    certifications: List[Certification] = []
    courses: List[Course] = []
    skills: List[Skill] = []
    research_interests: List[str] = []
    languages: List[Language] = []
    volunteering: List[Volunteering] = []
    teaching_experience: List[TeachingExperience] = []
    professional_memberships: List[ProfessionalMembership] = []
    online_profiles: OnlineProfiles = Field(default_factory=OnlineProfiles)
    references: List[Reference] = []
    other_sections: List[OtherSection] = []
    extraction_metadata: Optional[ExtractionMetadata] = None
