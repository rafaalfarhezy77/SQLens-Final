from sqlalchemy.orm import Session

from app.models.query_history import QueryHistory
from app.repositories.query_history import QueryHistoryRepository


class QueryHistoryService:
    def __init__(self, repository: QueryHistoryRepository | None = None) -> None:
        self.repository = repository or QueryHistoryRepository()

    def list_for_user(self, session: Session, *, user_id: str) -> list[QueryHistory]:
        return self.repository.list_for_user(session, user_id=user_id)

    def record_attempt(
        self,
        session: Session,
        *,
        user_id: str,
        query: str,
        status: str,
        execution_time_ms: float | None,
        row_count: int | None,
    ) -> QueryHistory:
        return self.repository.create(
            session,
            user_id=user_id,
            query=query,
            status=status,
            execution_time_ms=execution_time_ms,
            row_count=row_count,
        )

    def delete_for_user(self, session: Session, *, user_id: str, history_id: str) -> bool:
        return self.repository.delete_for_user(session, user_id=user_id, history_id=history_id)

    def clear_for_user(self, session: Session, *, user_id: str) -> None:
        self.repository.clear_for_user(session, user_id=user_id)
