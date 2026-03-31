from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from uuid import UUID
from sqlmodel import Session, select, func, or_
from app.api import deps
from app.db.session import get_session
from app.models.models import Job, User, Tag, JobTagLink, Company, JobApplication
from app.schemas.schemas import JobRead, JobCreate, PaginatedResponse, JobApplicationRead, JobApplicationUpdate

router = APIRouter()

@router.get("/", response_model=PaginatedResponse[JobRead])
def list_jobs(
    db: Session = Depends(get_session),
    search: Optional[str] = None,
    location: Optional[str] = None,
    remote: Optional[bool] = None,
    job_type: Optional[str] = None,
    experience_level: Optional[str] = None,
    company_id: Optional[UUID] = None,
    tag: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
) -> Any:
    statement = select(Job)
    
    if search:
        statement = statement.where(
            or_(
                Job.title.ilike(f"%{search}%"),
                Job.description.ilike(f"%{search}%")
            )
        )
    if location:
        statement = statement.where(Job.location.ilike(f"%{location}%"))
    if remote is not None:
        statement = statement.where(Job.remote == remote)
    if job_type:
        statement = statement.where(Job.job_type == job_type)
    if experience_level:
        statement = statement.where(Job.experience_level == experience_level)
    if company_id:
        statement = statement.where(Job.company_id == company_id)
    if tag:
        statement = statement.join(Job.tags).where(Tag.name.ilike(f"%{tag}%"))
    
    # Total count
    total_statement = select(func.count()).select_from(statement.subquery())
    total = db.exec(total_statement).one()
    
    # Pagination
    statement = statement.offset((page - 1) * limit).limit(limit)
    jobs = db.exec(statement).all()
    
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "data": jobs
    }

@router.post("/", response_model=JobRead)
def create_job(
    *,
    db: Session = Depends(get_session),
    job_in: JobCreate,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    if current_user.role != "recruiter" and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Verify company exists
    company = db.get(Company, job_in.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Recruiters can only post for their own company
    if current_user.role == "recruiter" and company.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only post jobs for your own company")

    job = Job(
        title=job_in.title,
        description=job_in.description,
        company_id=job_in.company_id,
        location=job_in.location,
        salary_range=job_in.salary_range,
        job_type=job_in.job_type,
        experience_level=job_in.experience_level,
        remote=job_in.remote,
        posted_by=current_user.id,
    )
    
    if job_in.tag_ids:
        tags = db.exec(select(Tag).where(Tag.id.in_(job_in.tag_ids))).all()
        job.tags = tags

    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@router.get("/{id}", response_model=JobRead)
def read_job(
    *,
    db: Session = Depends(get_session),
    id: UUID
) -> Any:
    job = db.get(Job, id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("/applications/me", response_model=List[JobApplicationRead])
def list_my_applications(
    *,
    db: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    applications = db.exec(
        select(JobApplication).where(JobApplication.user_id == current_user.id)
    ).all()
    return applications

@router.get("/applications/recruiter", response_model=List[JobApplicationRead])
def list_recruiter_applications(
    *,
    db: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    if current_user.role != "recruiter" and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Get all jobs posted by this recruiter
    applications = db.exec(
        select(JobApplication)
        .join(Job)
        .where(Job.posted_by == current_user.id)
    ).all()
    return applications

@router.patch("/applications/{application_id}/status", response_model=JobApplicationRead)
def update_application_status(
    *,
    db: Session = Depends(get_session),
    application_id: UUID,
    status_update: JobApplicationUpdate,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    application = db.get(JobApplication, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Ensure this recruiter owns the job
    job = db.get(Job, application.job_id)
    if job.posted_by != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    application.status = status_update.status
    db.add(application)
    db.commit()
    db.refresh(application)
    return application

@router.get("/{id}/my-application", response_model=Optional[JobApplicationRead])
def get_my_application_for_job(
    *,
    db: Session = Depends(get_session),
    id: UUID,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    application = db.exec(
        select(JobApplication).where(
            JobApplication.job_id == id,
            JobApplication.user_id == current_user.id
        )
    ).first()
    return application

@router.post("/{id}/apply", response_model=JobApplicationRead)
def apply_to_job(
    *,
    db: Session = Depends(get_session),
    id: UUID,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    # Check if job exists
    job = db.get(Job, id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check if already applied
    existing_application = db.exec(
        select(JobApplication).where(
            JobApplication.job_id == id,
            JobApplication.user_id == current_user.id
        )
    ).first()
    if existing_application:
        raise HTTPException(status_code=400, detail="Already applied for this job")
    
    application = JobApplication(
        job_id=id,
        user_id=current_user.id
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application

@router.put("/{id}", response_model=JobRead)
def update_job(
    *,
    db: Session = Depends(get_session),
    id: UUID,
    job_in: JobCreate,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    job = db.get(Job, id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.posted_by != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    update_data = job_in.dict(exclude={"tag_ids"}, exclude_unset=True)
    for key, value in update_data.items():
        setattr(job, key, value)
    
    if job_in.tag_ids is not None:
        tags = db.exec(select(Tag).where(Tag.id.in_(job_in.tag_ids))).all()
        job.tags = tags

    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@router.delete("/{id}")
def delete_job(
    *,
    db: Session = Depends(get_session),
    id: UUID,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    job = db.get(Job, id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.posted_by != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(job)
    db.commit()
    return {"message": "Job deleted successfully"}
