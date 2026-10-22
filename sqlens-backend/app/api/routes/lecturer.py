from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import TrustedUser, require_role
from app.db.session import get_db
from app.schemas.lecturer import (
    StudentActivityListResponse,
    StudentActivityResponse,
    StudentProgressListResponse,
    StudentProgressResponse,
)
from app.services.lecturer import LecturerService

router = APIRouter(prefix="/lecturer", tags=["lecturer"])
service = LecturerService()
DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentLecturer = Annotated[TrustedUser, Depends(require_role(["dosen"]))]


@router.get("/activities", response_model=StudentActivityListResponse)
def get_student_activities(_: CurrentLecturer, session: DatabaseSession) -> StudentActivityListResponse:
    items = service.get_student_activities(session)
    return StudentActivityListResponse(
        items=[StudentActivityResponse.model_validate(item) for item in items]
    )


@router.get("/progress", response_model=StudentProgressListResponse)
def get_student_progress(_: CurrentLecturer, session: DatabaseSession) -> StudentProgressListResponse:
    items = service.get_student_progress(session)
    return StudentProgressListResponse(
        items=[StudentProgressResponse.model_validate(item) for item in items]
    )
