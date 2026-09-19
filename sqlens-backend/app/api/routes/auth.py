from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.auth import AuthenticatedUserResponse, LoginRequest, RegisterRequest
from app.services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])
service = AuthService()
DatabaseSession = Annotated[Session, Depends(get_db)]


@router.post("/register", response_model=AuthenticatedUserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, session: DatabaseSession) -> AuthenticatedUserResponse:
    user = service.register_student(
        session,
        name=payload.name,
        email=str(payload.email),
        password=payload.password,
        role=payload.role,
    )
    return AuthenticatedUserResponse.model_validate(user)


@router.post("/login", response_model=AuthenticatedUserResponse)
def login(payload: LoginRequest, session: DatabaseSession) -> AuthenticatedUserResponse:
    user = service.authenticate(session, email=str(payload.email), password=payload.password)
    return AuthenticatedUserResponse.model_validate(user)
