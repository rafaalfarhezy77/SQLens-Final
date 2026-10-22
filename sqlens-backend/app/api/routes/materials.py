from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.security import TrustedUser, require_role, require_trusted_user
from app.db.session import get_db
from app.schemas.materials import (
    MaterialCreateRequest,
    MaterialListResponse,
    MaterialResponse,
    MaterialUpdateRequest,
)
from app.services.materials import MaterialService

router = APIRouter(prefix="/materials", tags=["materials"])
service = MaterialService()
DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[TrustedUser, Depends(require_trusted_user)]
CurrentLecturer = Annotated[TrustedUser, Depends(require_role(["dosen"]))]


@router.get("", response_model=MaterialListResponse)
def list_materials(_: CurrentUser, session: DatabaseSession) -> MaterialListResponse:
    items = service.list_materials(session)
    return MaterialListResponse(items=[MaterialResponse.model_validate(item) for item in items])


@router.get("/{material_id}", response_model=MaterialResponse)
def get_material(material_id: str, _: CurrentUser, session: DatabaseSession) -> MaterialResponse:
    item = service.get_material(session, material_id=material_id)
    return MaterialResponse.model_validate(item)


@router.post("", response_model=MaterialResponse, status_code=status.HTTP_201_CREATED)
def create_material(
    payload: MaterialCreateRequest,
    current_user: CurrentLecturer,
    session: DatabaseSession,
) -> MaterialResponse:
    item = service.create_material(session, payload=payload, created_by=current_user.user_id)
    return MaterialResponse.model_validate(item)


@router.put("/{material_id}", response_model=MaterialResponse)
def update_material(
    material_id: str,
    payload: MaterialUpdateRequest,
    _: CurrentLecturer,
    session: DatabaseSession,
) -> MaterialResponse:
    item = service.update_material(session, material_id=material_id, payload=payload)
    return MaterialResponse.model_validate(item)


@router.delete("/{material_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_material(
    material_id: str,
    _: CurrentLecturer,
    session: DatabaseSession,
) -> Response:
    service.delete_material(session, material_id=material_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
