from typing import Any
from pydantic import BaseModel, ConfigDict, Field

from app.schemas.datasets import DatasetTableResponse


class CustomDatasetInfoResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    has_custom_dataset: bool
    tables: list[DatasetTableResponse] = Field(default_factory=list)


class CsvFileItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    filename: str = Field(min_length=1)
    content: str = Field(default="")


class UploadCsvRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    files: list[CsvFileItem] = Field(min_length=1, max_length=5)


class UploadSqlRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sql: str = Field(min_length=1)


class CustomDatasetUploadResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: str
    message: str
    tables: list[DatasetTableResponse]


class CustomDatasetResetResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: str
    message: str
