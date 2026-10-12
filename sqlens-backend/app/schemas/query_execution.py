from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import ApiErrorResponse


class QueryExecutionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    query: str = Field(min_length=5, max_length=500)


class JoinVisualizationDetails(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    left_table: str = Field(min_length=1, alias="leftTable")
    right_table: str = Field(min_length=1, alias="rightTable")
    left_key: str = Field(min_length=1, alias="leftKey")
    right_key: str = Field(min_length=1, alias="rightKey")
    join_type: str = Field(min_length=1, alias="joinType")


class QueryStepRow(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    id: str = Field(min_length=1)
    data: dict[str, str | int | float | bool | None]
    status: Literal["keep", "filtered", "source", "joined"]
    status_text: str = Field(min_length=1, alias="statusText")
    reason: str = Field(min_length=1)


class QueryProcessingStep(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    step_number: int = Field(gt=0, alias="stepNumber")
    clause: str = Field(min_length=1)
    title: str = Field(min_length=1)
    badge: str = Field(min_length=1)
    description: str = Field(min_length=1)
    explanation: str = Field(min_length=1)
    rows_before_count: int = Field(ge=0, alias="rowsBeforeCount")
    rows_after_count: int = Field(ge=0, alias="rowsAfterCount")
    row_evaluations: list[QueryStepRow] = Field(alias="rowEvaluations")
    join_details: JoinVisualizationDetails | None = Field(default=None, alias="joinDetails")
    node_id: str | None = Field(default=None, alias="nodeId")
    node_type: str | None = Field(default=None, alias="nodeType")
    parent_ids: list[str] | None = Field(default=None, alias="parentIds")
    operation_expression: str | None = Field(default=None, alias="operationExpression")


class QueryExecutionSuccessResponse(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    status: Literal["success"]
    query: str = Field(min_length=1)
    execution_time_ms: float = Field(ge=0, alias="executionTimeMs")
    columns: list[str]
    rows: list[dict[str, str | int | float | bool | None]]
    total_rows: int = Field(ge=0, alias="totalRows")
    steps: list[QueryProcessingStep]


class QueryExecutionErrorResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: Literal["error"]
    error: ApiErrorResponse
