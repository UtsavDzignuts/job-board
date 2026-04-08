from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from app.api import deps
from app.core import security
from app.core.config import settings
from app.db.session import get_session
from app.models.models import User, Company, UserRole, JobApplication
from app.schemas.schemas import Token, UserCreate, UserRead, UserUpdate, GoogleToken
from google.oauth2 import id_token
from google.auth.transport import requests

router = APIRouter()

@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(get_session), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    user = db.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.email, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/google", response_model=Token)
def login_google(
    *,
    db: Session = Depends(get_session),
    token_in: GoogleToken
) -> Any:
    try:
        # Verify the Google token
        # If GOOGLE_CLIENT_ID is not set, this will fail or skip verification depending on implementation
        # For development, we might want to be careful.
        idinfo = id_token.verify_oauth2_token(token_in.token, requests.Request(), settings.GOOGLE_CLIENT_ID)
        
        email = idinfo['email']
        google_id = idinfo['sub']
        full_name = idinfo.get('name', '')
        
        # 1. Try to find user by google_id
        user = db.exec(select(User).where(User.google_id == google_id)).first()
        
        if not user:
            # 2. Try to find user by email (link account)
            user = db.exec(select(User).where(User.email == email)).first()
            if user:
                # Link account
                user.google_id = google_id
                # If they didn't have a name, update it
                if not user.full_name:
                    user.full_name = full_name
                db.add(user)
                db.commit()
                db.refresh(user)
            else:
                # 3. Create new user
                user = User(
                    email=email,
                    full_name=full_name,
                    google_id=google_id,
                    role=UserRole.CANDIDATE
                )
                db.add(user)
                db.commit()
                db.refresh(user)
        
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        return {
            "access_token": security.create_access_token(
                user.email, expires_delta=access_token_expires
            ),
            "token_type": "bearer",
        }
    except Exception as e:
        print(f"Google login error: {e}")
        raise HTTPException(status_code=400, detail="Invalid Google token or verification failed")

@router.post("/register", response_model=UserRead)
def register(
    *,
    db: Session = Depends(get_session),
    user_in: UserCreate
) -> Any:
    user = db.exec(select(User).where(User.email == user_in.email)).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    user_data = UserRead.model_validate(user)
    if user.role == UserRole.RECRUITER and user_in.company_name:
        company = Company(
            name=user_in.company_name,
            industry=user_in.company_industry,
            location=user_in.company_location,
            description=user_in.company_description,
            website=user_in.company_website,
            creator_id=user.id
        )
        db.add(company)
        db.commit()
        db.refresh(company)
        
        # Populate for response
        user_data.company_id = company.id
        user_data.company_name = company.name
        user_data.company_industry = company.industry
        user_data.company_location = company.location
        user_data.company_description = company.description
        user_data.company_website = company.website

    # No job applications for a new user
    user_data.applied_job_ids = []

    return user_data

@router.get("/me", response_model=UserRead)
def read_user_me(
    db: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    user_data = UserRead.model_validate(current_user)
    if current_user.role == UserRole.RECRUITER:
        company = db.exec(select(Company).where(Company.creator_id == current_user.id)).first()
        if company:
            user_data.company_id = company.id
            user_data.company_name = company.name
            user_data.company_industry = company.industry
            user_data.company_location = company.location
            user_data.company_description = company.description
            user_data.company_website = company.website
    
    # Populate applied job IDs for candidates
    if current_user.role == UserRole.CANDIDATE:
        applications = db.exec(select(JobApplication).where(JobApplication.user_id == current_user.id)).all()
        user_data.applied_job_ids = [app.job_id for app in applications]
        
    return user_data

@router.put("/me", response_model=UserRead)
def update_user_me(
    *,
    db: Session = Depends(get_session),
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    if user_in.email:
        user = db.exec(select(User).where(User.email == user_in.email)).first()
        if user and user.id != current_user.id:
            raise HTTPException(
                status_code=400,
                detail="The user with this email already exists in the system.",
            )
    
    update_data = user_in.model_dump(exclude_unset=True)
    if "password" in update_data and update_data["password"]:
        hashed_password = security.get_password_hash(user_in.password)
        current_user.hashed_password = hashed_password
    
    # User fields
    if user_in.full_name:
        current_user.full_name = user_in.full_name
    if user_in.email:
        current_user.email = user_in.email
    
    db.add(current_user)
    
    if current_user.role == UserRole.RECRUITER:
        company = db.exec(select(Company).where(Company.creator_id == current_user.id)).first()
        if company:
            if user_in.company_name:
                company.name = user_in.company_name
            if user_in.company_industry:
                company.industry = user_in.company_industry
            if user_in.company_location:
                company.location = user_in.company_location
            if "company_description" in update_data:
                company.description = user_in.company_description
            if "company_website" in update_data:
                company.website = user_in.company_website
            db.add(company)

    db.commit()
    db.refresh(current_user)
    
    # Return UserRead with populated company details
    user_data = UserRead.model_validate(current_user)
    if current_user.role == UserRole.RECRUITER:
        company = db.exec(select(Company).where(Company.creator_id == current_user.id)).first()
        if company:
            user_data.company_id = company.id
            user_data.company_name = company.name
            user_data.company_industry = company.industry
            user_data.company_location = company.location
            user_data.company_description = company.description
            user_data.company_website = company.website
            
    # Populate applied job IDs for candidates
    if current_user.role == UserRole.CANDIDATE:
        applications = db.exec(select(JobApplication).where(JobApplication.user_id == current_user.id)).all()
        user_data.applied_job_ids = [app.job_id for app in applications]

    return user_data
