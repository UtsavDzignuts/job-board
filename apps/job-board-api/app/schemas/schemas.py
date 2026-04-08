from typing import List, Optional, Generic, TypeVar
from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID

T = TypeVar("T")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class GoogleToken(BaseModel):
    token: str

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str

class UserCreate(UserBase):
    password: str
    company_name: Optional[str] = None
    company_industry: Optional[str] = None
    company_location: Optional[str] = None
    company_description: Optional[str] = None
    company_website: Optional[str] = None

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    company_name: Optional[str] = None
    company_industry: Optional[str] = None
    company_location: Optional[str] = None
    company_description: Optional[str] = None
    company_website: Optional[str] = None

class UserRead(UserBase):
    id: UUID
    created_at: datetime
    company_id: Optional[UUID] = None
    company_name: Optional[str] = None
    company_industry: Optional[str] = None
    company_location: Optional[str] = None
    company_description: Optional[str] = None
    company_website: Optional[str] = None
    applied_job_ids: List[UUID] = []

    class Config:
        from_attributes = True

class CompanyBase(BaseModel):
    name: str
    description: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyRead(CompanyBase):
    id: UUID
    creator_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class TagBase(BaseModel):
    name: str

class TagRead(TagBase):
    id: UUID

    class Config:
        from_attributes = True

class JobBase(BaseModel):
    title: str
    description: str
    location: str
    salary_range: Optional[str] = None
    job_type: str
    experience_level: str
    remote: bool = False

class JobCreate(JobBase):
    company_id: UUID
    tag_ids: List[UUID] = []

class JobRead(JobBase):
    id: UUID
    company_id: UUID
    posted_by: UUID
    created_at: datetime
    updated_at: datetime
    company: CompanyRead
    tags: List[TagRead] = []

    class Config:
        from_attributes = True

class PaginatedResponse(BaseModel, Generic[T]):
    total: int
    page: int
    limit: int
    data: List[T]

class JobApplicationRead(BaseModel):
    id: UUID
    job_id: UUID
    user_id: UUID
    status: str
    created_at: datetime
    job: JobRead
    user: UserRead

    class Config:
        from_attributes = True

class JobApplicationCreate(BaseModel):
    job_id: UUID

class JobApplicationUpdate(BaseModel):
    status: str # applied, reviewing, accepted, rejected
