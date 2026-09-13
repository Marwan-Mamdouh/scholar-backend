from typing import List, Literal, Optional

from pydantic import BaseModel

PublicationType = Literal[
    "journal",
    "conference",
    "workshop",
    "preprint",
    "book",
    "book_chapter",
    "thesis",
    "other",
]

PublicationStatus = Literal[
    "published",
    "accepted",
    "in_press",
    "submitted",
    "preprint",
    "unknown",
]


class Publication(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = None
    authors: List[str] = []
    venue: Optional[str] = None
    publisher: Optional[str] = None
    publication_type: Optional[PublicationType] = None
    year: Optional[int] = None
    status: Optional[PublicationStatus] = None
    doi: Optional[str] = None
    url: Optional[str] = None


class Patent(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = None
    inventors: List[str] = []
    patent_number: Optional[str] = None
    date: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None
