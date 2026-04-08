import uuid
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum

class UserRole(str, Enum):
    CANDIDATE = "candidate"
    RECRUITER = "recruiter"
    ADMIN = "admin"

class JobTagLink(SQLModel, table=True):
    job_id: Optional[UUID] = Field(default=None, foreign_key="job.id", primary_key=True)
    tag_id: Optional[UUID] = Field(default=None, foreign_key="tag.id", primary_key=True)

class User(SQLModel, table=True):
    id: Optional[UUID] = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )
    email: str = Field(unique=True, index=True)
    hashed_password: Optional[str] = None
    full_name: str
    google_id: Optional[str] = Field(default=None, unique=True, index=True)
    role: str = Field(default=UserRole.CANDIDATE)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    jobs_posted: List["Job"] = Relationship(back_populates="posted_by_user")
    companies_created: List["Company"] = Relationship(back_populates="creator")

class Company(SQLModel, table=True):
    id: Optional[UUID] = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )
    name: str = Field(index=True)
    description: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    creator_id: UUID = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    creator: User = Relationship(back_populates="companies_created")
    jobs: List["Job"] = Relationship(back_populates="company")

class Job(SQLModel, table=True):
    id: Optional[UUID] = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )
    title: str = Field(index=True)
    description: str
    company_id: UUID = Field(foreign_key="company.id")
    location: str
    salary_range: Optional[str] = None
    job_type: str 
    experience_level: str
    remote: bool = False
    posted_by: UUID = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    company: Company = Relationship(back_populates="jobs")
    posted_by_user: "User" = Relationship(back_populates="jobs_posted")
    tags: List["Tag"] = Relationship(back_populates="jobs", link_model=JobTagLink)

class Tag(SQLModel, table=True):
    id: Optional[UUID] = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )
    name: str = Field(unique=True, index=True)

    jobs: List[Job] = Relationship(back_populates="tags", link_model=JobTagLink)

class JobApplication(SQLModel, table=True):
    id: Optional[UUID] = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )
    job_id: UUID = Field(foreign_key="job.id")
    user_id: UUID = Field(foreign_key="user.id")
    status: str = Field(default="applied") # applied, reviewing, accepted, rejected
    created_at: datetime = Field(default_factory=datetime.utcnow)

    job: Job = Relationship()
    user: User = Relationship()
