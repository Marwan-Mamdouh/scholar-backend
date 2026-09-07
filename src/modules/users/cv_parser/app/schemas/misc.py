from typing import Optional

from pydantic import BaseModel


class Certification(BaseModel):
    name: Optional[str] = None
    issuer: Optional[str] = None
    issue_date: Optional[str] = None
    expiration_date: Optional[str] = None
    credential_id: Optional[str] = None
    url: Optional[str] = None


class Award(BaseModel):
    title: Optional[str] = None
    issuer: Optional[str] = None
    date: Optional[str] = None
    description: Optional[str] = None


class Scholarship(BaseModel):
    name: Optional[str] = None
    organization: Optional[str] = None
    date: Optional[str] = None
    description: Optional[str] = None


class Course(BaseModel):
    name: Optional[str] = None
    provider: Optional[str] = None
    date: Optional[str] = None
    description: Optional[str] = None


class Reference(BaseModel):
    name: Optional[str] = None
    position: Optional[str] = None
    organization: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None


class Volunteering(BaseModel):
    role: Optional[str] = None
    organization: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None


class TeachingExperience(BaseModel):
    position: Optional[str] = None
    institution: Optional[str] = None
    course: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None


class ProfessionalMembership(BaseModel):
    organization: Optional[str] = None
    membership_type: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
