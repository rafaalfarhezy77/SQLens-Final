from pydantic import BaseModel, ConfigDict, Field


class AiTutorRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    prompt: str = Field(min_length=3, max_length=2000)
    query: str | None = Field(default=None, max_length=1000)
    context: str | None = Field(default=None, max_length=100)


class AiTutorResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    explanation: str
    hint: str
    sql_concept: str = Field(alias="sqlConcept")
    reasoning: list[str]
