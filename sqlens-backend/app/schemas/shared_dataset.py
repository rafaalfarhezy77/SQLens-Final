from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.schemas.custom_dataset import CsvFileItem
from app.schemas.datasets import DatasetTableResponse


class UploadSharedCsvRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str = Field(min_length=3, max_length=150)
    description: str = Field(default="", max_length=500)
    files: list[CsvFileItem] = Field(min_length=1, max_length=5)


class UploadSharedSqlRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    title: str = Field(min_length=3, max_length=150)
    description: str = Field(default="", max_length=500)
    sql: str = Field(min_length=1)


class SharedDatasetResponse(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True, from_attributes=True)

    id: str
    title: str
    description: str
    schema_name: str = Field(alias="schemaName")
    table_names: list[str] = Field(alias="tableNames")
    created_by: str = Field(alias="createdBy")
    created_by_name: str = Field(alias="createdByName")
    is_active: bool = Field(alias="isActive")
    created_at: datetime = Field(alias="createdAt")


class SharedDatasetDetailResponse(SharedDatasetResponse):
    tables: list[DatasetTableResponse]


class SharedDatasetListResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    items: list[SharedDatasetResponse]
