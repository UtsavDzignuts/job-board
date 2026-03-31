from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db.session import get_session
from app.models.models import Tag
from app.schemas.schemas import TagRead, TagBase

router = APIRouter()

@router.get("/", response_model=List[TagRead])
def list_tags(
    db: Session = Depends(get_session),
) -> Any:
    tags = db.exec(select(Tag)).all()
    return tags

@router.post("/", response_model=TagRead)
def create_tag(
    *,
    db: Session = Depends(get_session),
    tag_in: TagBase
) -> Any:
    tag = Tag(name=tag_in.name)
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag
