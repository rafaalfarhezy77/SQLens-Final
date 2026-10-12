from typing import Literal
from pydantic import BaseModel, ConfigDict, Field


class StudentActivityResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    id: str
    student_name: str = Field(alias="studentName")
    email: str
    query: str
    status: Literal["success", "error"]
    occurred_at: str = Field(alias="occurredAt")
    count: int


class StudentActivityListResponse(BaseModel):
    items: list[StudentActivityResponse]


class StudentProgressResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    id: str
    student_name: str = Field(alias="studentName")
    successful_queries: int = Field(alias="successfulQueries")
    progress_percent: int = Field(alias="progressPercent")
    latest_activity: str | None = Field(default=None, alias="latestActivity")


class StudentProgressListResponse(BaseModel):
    items: list[StudentProgressResponse]
