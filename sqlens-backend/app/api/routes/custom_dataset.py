from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import TrustedUser, require_trusted_user
from app.db.session import get_db
from app.schemas.custom_dataset import (
    CustomDatasetInfoResponse,
    CustomDatasetResetResponse,
    CustomDatasetUploadResponse,
    UploadCsvRequest,
    UploadSqlRequest,
)
from app.services.custom_dataset import CustomDatasetService

router = APIRouter(prefix="/datasets/custom", tags=["custom-datasets"])
service = CustomDatasetService()

DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[TrustedUser, Depends(require_trusted_user)]


@router.get("", response_model=CustomDatasetInfoResponse)
def get_custom_dataset(
    current_user: CurrentUser, session: DatabaseSession
) -> CustomDatasetInfoResponse:
    has_dataset, tables = service.get_custom_dataset(session, current_user.user_id)
    return CustomDatasetInfoResponse(
        has_custom_dataset=has_dataset,
        tables=tables,
    )


@router.post("/upload-csv", response_model=CustomDatasetUploadResponse)
def upload_csv_dataset(
    payload: UploadCsvRequest,
    current_user: CurrentUser,
    session: DatabaseSession,
) -> CustomDatasetUploadResponse:
    files = [(item.filename, item.content) for item in payload.files]
    tables = service.import_csv_files(session, current_user.user_id, files)
    return CustomDatasetUploadResponse(
        status="success",
        message=f"Berhasil mengimpor {len(tables)} tabel dari file CSV.",
        tables=tables,
    )


@router.post("/upload-sql", response_model=CustomDatasetUploadResponse)
def upload_sql_dataset(
    payload: UploadSqlRequest,
    current_user: CurrentUser,
    session: DatabaseSession,
) -> CustomDatasetUploadResponse:
    tables = service.import_sql_script(session, current_user.user_id, payload.sql)
    return CustomDatasetUploadResponse(
        status="success",
        message=f"Berhasil mengimpor {len(tables)} tabel dari skrip SQL.",
        tables=tables,
    )


@router.delete("", response_model=CustomDatasetResetResponse)
def reset_custom_dataset(
    current_user: CurrentUser,
    session: DatabaseSession,
) -> CustomDatasetResetResponse:
    service.reset_user_dataset(session, current_user.user_id)
    return CustomDatasetResetResponse(
        status="success",
        message="Dataset kustom berhasil dihapus dan dikembalikan ke bawaan.",
    )
