from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.security import TrustedUser, require_trusted_user
from app.db.session import get_db
from app.schemas.query_history import QueryHistoryItemResponse, QueryHistoryListResponse
from app.services.query_history import QueryHistoryService

router = APIRouter(prefix="/query-history", tags=["query-history"])
history_service = QueryHistoryService()

DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[TrustedUser, Depends(require_trusted_user)]


@router.get("", response_model=QueryHistoryListResponse)
def list_query_history(current_user: CurrentUser, session: DatabaseSession) -> QueryHistoryListResponse:
    items = history_service.list_for_user(session, user_id=current_user.user_id)
    return QueryHistoryListResponse(items=[QueryHistoryItemResponse.model_validate(item) for item in items])


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def clear_query_history(current_user: CurrentUser, session: DatabaseSession) -> Response:
    history_service.clear_for_user(session, user_id=current_user.user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/{history_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_query_history(history_id: str, current_user: CurrentUser, session: DatabaseSession) -> Response:
    history_service.delete_for_user(session, user_id=current_user.user_id, history_id=history_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
