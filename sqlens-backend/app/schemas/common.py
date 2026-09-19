from pydantic import AliasChoices, BaseModel, ConfigDict, Field


class ApiErrorResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    code: str = Field(min_length=1)
    message: str = Field(min_length=1)
    field_errors: dict[str, list[str]] | None = Field(
        default=None,
        validation_alias=AliasChoices("field_errors", "fieldErrors"),
        serialization_alias="fieldErrors",
    )
