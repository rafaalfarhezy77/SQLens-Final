from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.errors import PublicApiError
from app.core.security import TrustedUser, require_trusted_user
from app.db.session import get_db
from app.schemas.common import ApiErrorResponse
from app.schemas.query_execution import (
    QueryExecutionErrorResponse,
    QueryExecutionRequest,
    QueryExecutionSuccessResponse,
)
from app.services.query_execution import QueryExecutionService
from app.services.query_history import QueryHistoryService

router = APIRouter(prefix="/query-executions", tags=["query-executions"])
execution_service = QueryExecutionService()
history_service = QueryHistoryService()

DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[TrustedUser, Depends(require_trusted_user)]


@router.post("", response_model=QueryExecutionSuccessResponse | QueryExecutionErrorResponse)
def execute_query(
    payload: QueryExecutionRequest,
    current_user: CurrentUser,
    session: DatabaseSession,
) -> QueryExecutionSuccessResponse | JSONResponse:
    try:
        columns, rows, execution_time_ms, stages = execution_service.execute(session, query=payload.query)
    except PublicApiError as error:
        history_service.record_attempt(
            session,
            user_id=current_user.user_id,
            query=payload.query,
            status="error",
            execution_time_ms=None,
            row_count=None,
        )
        response = QueryExecutionErrorResponse(
            status="error",
            error=ApiErrorResponse(**error.as_payload()),
        )
        return JSONResponse(status_code=error.status_code, content=response.model_dump(by_alias=True, exclude_none=True))

    history_service.record_attempt(
        session,
        user_id=current_user.user_id,
        query=payload.query,
        status="success",
        execution_time_ms=execution_time_ms,
        row_count=len(rows),
    )
    return QueryExecutionSuccessResponse(
        status="success",
        query=payload.query,
        execution_time_ms=execution_time_ms,
        columns=columns,
        rows=rows,
        total_rows=len(rows),
        steps=stages,
    )
