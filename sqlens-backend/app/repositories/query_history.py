from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.query_history import QueryHistory


class QueryHistoryRepository:
    def list_for_user(self, session: Session, *, user_id: str) -> list[QueryHistory]:
        statement = (
            select(QueryHistory)
            .where(QueryHistory.user_id == user_id)
            .order_by(QueryHistory.executed_at.desc())
        )
        return list(session.scalars(statement))

    def create(
        self,
        session: Session,
        *,
        user_id: str,
        query: str,
        status: str,
        execution_time_ms: float | None,
        row_count: int | None,
    ) -> QueryHistory:
        history = QueryHistory(
            user_id=user_id,
            query=query,
            status=status,
            execution_time_ms=execution_time_ms,
            row_count=row_count,
        )
        session.add(history)
        session.commit()
        session.refresh(history)
        return history

    def delete_for_user(self, session: Session, *, user_id: str, history_id: str) -> bool:
        statement = delete(QueryHistory).where(
            QueryHistory.id == history_id,
            QueryHistory.user_id == user_id,
        )
        result = session.execute(statement)
        session.commit()
        return bool(result.rowcount)

    def clear_for_user(self, session: Session, *, user_id: str) -> None:
        session.execute(delete(QueryHistory).where(QueryHistory.user_id == user_id))
        session.commit()
