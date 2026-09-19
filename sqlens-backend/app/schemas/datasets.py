from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class DatasetTableResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    columns: list[str]
    rows: list[dict[str, Any]]
    relationship: str | None = None


class DatasetResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    tables: list[DatasetTableResponse] = Field(min_length=1)
