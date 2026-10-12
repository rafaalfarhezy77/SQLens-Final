from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.security import TrustedUser, require_trusted_user
from app.db.session import get_db
from app.schemas.iot import (
    IoTReadingCreateRequest,
    IoTReadingListResponse,
    IoTReadingResponse,
)
from app.services.iot import IoTService

router = APIRouter(prefix="/iot", tags=["iot"])
DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[TrustedUser, Depends(require_trusted_user)]


@router.post("/telemetry", response_model=IoTReadingResponse, status_code=status.HTTP_201_CREATED)
def record_telemetry(payload: IoTReadingCreateRequest, session: DatabaseSession) -> IoTReadingResponse:
    service = IoTService(session)
    reading = service.record_reading(payload)
    return IoTReadingResponse.model_validate(reading)


@router.get("/readings", response_model=IoTReadingListResponse)
def list_readings(_: CurrentUser, session: DatabaseSession) -> IoTReadingListResponse:
    service = IoTService(session)
    readings = service.get_latest_readings()
    return IoTReadingListResponse(items=[IoTReadingResponse.model_validate(r) for r in readings])
