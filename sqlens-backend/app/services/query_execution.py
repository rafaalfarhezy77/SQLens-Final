import re
import time
from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from sqlalchemy import text
from sqlalchemy.exc import DBAPIError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.errors import PublicApiError
from app.services.educational_stages import build_educational_stages

FORBIDDEN_KEYWORDS = {
    "ALTER",
    "CALL",
    "COPY",
    "CREATE",
    "DELETE",
    "DO",
    "DROP",
    "GRANT",
    "INSERT",
    "MERGE",
    "REVOKE",
    "TRUNCATE",
    "UPDATE",
    "VACUUM",
}
SQL_TOKEN_PATTERN = re.compile(r"[A-Z_]+")


def validate_read_only_query(query: str) -> str:
    normalized = query.strip()
    without_trailing_semicolon = normalized[:-1].rstrip() if normalized.endswith(";") else normalized

    if not without_trailing_semicolon:
        raise PublicApiError(
            status_code=400,
            code="INVALID_QUERY",
            message="Query SQL tidak boleh kosong.",
        )
    if ";" in without_trailing_semicolon:
        raise PublicApiError(
            status_code=400,
            code="MULTIPLE_STATEMENTS_FORBIDDEN",
            message="Hanya satu statement SELECT yang diizinkan.",
        )
    if "--" in without_trailing_semicolon or "/*" in without_trailing_semicolon:
        raise PublicApiError(
            status_code=400,
            code="SQL_COMMENTS_FORBIDDEN",
            message="Komentar SQL tidak diizinkan dalam sandbox edukasi.",
        )

    tokens = set(SQL_TOKEN_PATTERN.findall(without_trailing_semicolon.upper()))
    forbidden = sorted(tokens & FORBIDDEN_KEYWORDS)
    if forbidden:
        raise PublicApiError(
            status_code=400,
            code="READ_ONLY_POLICY_VIOLATION",
            message="Operasi perubahan database tidak diizinkan dalam sandbox edukasi.",
        )
    if not without_trailing_semicolon.upper().startswith("SELECT"):
        raise PublicApiError(
            status_code=400,
            code="SELECT_ONLY_POLICY",
            message="Sandbox saat ini hanya menerima satu statement SELECT.",
        )

    return without_trailing_semicolon


def _json_value(value: object) -> str | int | float | bool | None:
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, UUID):
        return str(value)
    return str(value)


class QueryExecutionService:
    def execute(self, session: Session, *, query: str) -> tuple[list[str], list[dict[str, str | int | float | bool | None]], float, list[dict[str, object]]]:
        safe_query = validate_read_only_query(query)
        started_at = time.perf_counter()

        try:
            # PostgreSQL enforces read-only execution independently of the lexical
            # policy above. Committing this transaction cannot persist SELECT data.
            with session.begin():
                session.execute(text("SET TRANSACTION READ ONLY"))
                timeout_ms = get_settings().sql_statement_timeout_ms
                session.execute(text(f"SET LOCAL statement_timeout = '{timeout_ms}ms'"))
                result = session.execute(text(safe_query))
                columns = list(result.keys())
                rows = [
                    {column: _json_value(value) for column, value in row.items()}
                    for row in result.mappings()
                ]
                stages = build_educational_stages(session, query=safe_query, final_rows=rows)
        except PublicApiError:
            raise
        except DBAPIError as error:
            raise PublicApiError(
                status_code=400,
                code="QUERY_EXECUTION_FAILED",
                message="Query tidak dapat dieksekusi pada sandbox edukasi.",
            ) from error
        except SQLAlchemyError as error:
            raise PublicApiError(
                status_code=503,
                code="DATABASE_UNAVAILABLE",
                message="Layanan database saat ini tidak tersedia.",
            ) from error

        execution_time_ms = round((time.perf_counter() - started_at) * 1000, 2)
        return columns, rows, execution_time_ms, stages
