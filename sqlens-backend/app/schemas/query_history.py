from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class QueryHistoryItemResponse(BaseModel):
    model_config = ConfigDict(extra="forbid", from_attributes=True)

    id: str = Field(min_length=1)
    query: str = Field(min_length=1)
    status: Literal["success", "error"]
    executed_at: datetime = Field(serialization_alias="executedAt")
    execution_time_ms: float | None = Field(default=None, ge=0, serialization_alias="executionTimeMs")
    row_count: int | None = Field(default=None, ge=0, serialization_alias="rowCount")


class QueryHistoryListResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    items: list[QueryHistoryItemResponse]
