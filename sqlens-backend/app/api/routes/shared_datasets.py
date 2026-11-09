from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.security import TrustedUser, require_role, require_trusted_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.shared_dataset import (
    SharedDatasetDetailResponse,
    SharedDatasetListResponse,
    UploadSharedCsvRequest,
    UploadSharedSqlRequest,
)
from app.services.shared_dataset import SharedDatasetService

router = APIRouter(prefix="/shared-datasets", tags=["shared-datasets"])
lecturer_router = APIRouter(prefix="/lecturer/shared-datasets", tags=["lecturer-shared-datasets"])
service = SharedDatasetService()

DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[TrustedUser, Depends(require_trusted_user)]
CurrentLecturer = Annotated[TrustedUser, Depends(require_role(["dosen"]))]


@router.get("", response_model=SharedDatasetListResponse)
def list_shared_datasets(
    _: CurrentUser, session: DatabaseSession
) -> SharedDatasetListResponse:
    items = service.list_shared_datasets(session)
    return SharedDatasetListResponse(items=items)


@router.get("/{dataset_id}", response_model=SharedDatasetDetailResponse)
def get_shared_dataset(
    dataset_id: str, _: CurrentUser, session: DatabaseSession
) -> SharedDatasetDetailResponse:
    return service.get_shared_dataset_detail(session, dataset_id)


@lecturer_router.post(
    "/upload-csv",
    response_model=SharedDatasetDetailResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_shared_csv(
    payload: UploadSharedCsvRequest,
    current_user: CurrentLecturer,
    session: DatabaseSession,
) -> SharedDatasetDetailResponse:
    user_record = session.query(User).filter(User.id == current_user.user_id).first()
    author_name = user_record.name if user_record else "Dosen Pengampu"

    files = [(item.filename, item.content) for item in payload.files]
    return service.create_shared_dataset_from_csv(
        session,
        user_id=current_user.user_id,
        user_name=author_name,
        title=payload.title,
        description=payload.description,
        files=files,
    )


@lecturer_router.post(
    "/upload-sql",
    response_model=SharedDatasetDetailResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_shared_sql(
    payload: UploadSharedSqlRequest,
    current_user: CurrentLecturer,
    session: DatabaseSession,
) -> SharedDatasetDetailResponse:
    user_record = session.query(User).filter(User.id == current_user.user_id).first()
    author_name = user_record.name if user_record else "Dosen Pengampu"

    return service.create_shared_dataset_from_sql(
        session,
        user_id=current_user.user_id,
        user_name=author_name,
        title=payload.title,
        description=payload.description,
        sql_content=payload.sql,
    )


@lecturer_router.delete("/{dataset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_shared_dataset(
    dataset_id: str,
    current_user: CurrentLecturer,
    session: DatabaseSession,
) -> None:
    service.delete_shared_dataset(
        session,
        dataset_id=dataset_id,
        user_id=current_user.user_id,
        user_role=current_user.role,
    )
