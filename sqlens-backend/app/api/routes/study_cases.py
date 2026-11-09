from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import TrustedUser, require_trusted_user
from app.db.session import get_db
from app.schemas.study_cases import StudyCaseDetail, StudyCaseListResponse
from app.services.study_cases import StudyCaseService

router = APIRouter(prefix="/study-cases", tags=["study-cases"])
service = StudyCaseService()
DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[TrustedUser, Depends(require_trusted_user)]


@router.get("", response_model=StudyCaseListResponse)
def list_study_cases(_: CurrentUser) -> StudyCaseListResponse:
    items = service.list_study_cases()
    return StudyCaseListResponse(items=items)


@router.get("/{case_id}", response_model=StudyCaseDetail)
def get_study_case(
    case_id: str, _: CurrentUser, session: DatabaseSession
) -> StudyCaseDetail:
    return service.get_study_case(session, case_id)
