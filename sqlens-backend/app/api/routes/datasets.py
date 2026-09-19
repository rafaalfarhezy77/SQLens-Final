from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.security import TrustedUser, require_trusted_user
from app.db.session import get_db
from app.schemas.datasets import DatasetResponse, DatasetTableResponse

router = APIRouter(prefix="/datasets", tags=["datasets"])
DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[TrustedUser, Depends(require_trusted_user)]


@router.get("/educational", response_model=DatasetResponse)
def educational_dataset(_: CurrentUser, session: DatabaseSession) -> DatasetResponse:
    students = [dict(row) for row in session.execute(text("SELECT id, name, major FROM students ORDER BY id LIMIT 10")).mappings()]
    scores = [dict(row) for row in session.execute(text("SELECT id, student_id, course, score, grade FROM scores ORDER BY id LIMIT 10")).mappings()]
    return DatasetResponse(tables=[
        DatasetTableResponse(name="students", columns=["id", "name", "major"], rows=students, relationship="students.id adalah primary key."),
        DatasetTableResponse(name="scores", columns=["id", "student_id", "course", "score", "grade"], rows=scores, relationship="scores.student_id merujuk ke students.id."),
    ])
