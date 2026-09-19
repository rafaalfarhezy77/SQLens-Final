from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import ApiErrorResponse


class QueryExecutionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    query: str = Field(min_length=5, max_length=500)


class JoinVisualizationDetails(BaseModel):
    model_config = ConfigDict(extra="forbid")

    left_table: str = Field(min_length=1, serialization_alias="leftTable")
    right_table: str = Field(min_length=1, serialization_alias="rightTable")
    left_key: str = Field(min_length=1, serialization_alias="leftKey")
    right_key: str = Field(min_length=1, serialization_alias="rightKey")
    join_type: str = Field(min_length=1, serialization_alias="joinType")


class QueryStepRow(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(min_length=1)
    data: dict[str, str | int | float | bool | None]
    status: Literal["keep", "filtered", "source", "joined"]
    status_text: str = Field(min_length=1, serialization_alias="statusText")
    reason: str = Field(min_length=1)


class QueryProcessingStep(BaseModel):
    model_config = ConfigDict(extra="forbid")

    step_number: int = Field(gt=0, serialization_alias="stepNumber")
    clause: str = Field(min_length=1)
    title: str = Field(min_length=1)
    badge: str = Field(min_length=1)
    description: str = Field(min_length=1)
    explanation: str = Field(min_length=1)
    rows_before_count: int = Field(ge=0, serialization_alias="rowsBeforeCount")
    rows_after_count: int = Field(ge=0, serialization_alias="rowsAfterCount")
    row_evaluations: list[QueryStepRow] = Field(serialization_alias="rowEvaluations")
    join_details: JoinVisualizationDetails | None = Field(default=None, serialization_alias="joinDetails")


class QueryExecutionSuccessResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: Literal["success"]
    query: str = Field(min_length=1)
    execution_time_ms: float = Field(ge=0, serialization_alias="executionTimeMs")
    columns: list[str]
    rows: list[dict[str, str | int | float | bool | None]]
    total_rows: int = Field(ge=0, serialization_alias="totalRows")
    steps: list[QueryProcessingStep]


class QueryExecutionErrorResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: Literal["error"]
    error: ApiErrorResponse
