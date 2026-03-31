from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from sqlmodel import Session, select
from app.api import deps
from app.db.session import get_session
from app.models.models import Company, User
from app.schemas.schemas import CompanyRead, CompanyCreate

router = APIRouter()

@router.get("/", response_model=List[CompanyRead])
def list_companies(
    db: Session = Depends(get_session),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    companies = db.exec(select(Company).offset(skip).limit(limit)).all()
    return companies

@router.post("/", response_model=CompanyRead)
def create_company(
    *,
    db: Session = Depends(get_session),
    company_in: CompanyCreate,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    company = Company(
        **company_in.dict(),
        creator_id=current_user.id
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return company

@router.get("/{id}", response_model=CompanyRead)
def read_company(
    *,
    db: Session = Depends(get_session),
    id: UUID
) -> Any:
    company = db.get(Company, id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@router.put("/{id}", response_model=CompanyRead)
def update_company(
    *,
    db: Session = Depends(get_session),
    id: UUID,
    company_in: CompanyCreate,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    company = db.get(Company, id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    if company.creator_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    update_data = company_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(company, key, value)
    
    db.add(company)
    db.commit()
    db.refresh(company)
    return company
