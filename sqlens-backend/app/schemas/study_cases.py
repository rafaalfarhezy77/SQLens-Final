from typing import Any
from pydantic import BaseModel, ConfigDict, Field


class StudyCaseChallenge(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    id: str
    title: str
    description: str
    difficulty: str
    hint: str
    starter_query: str = Field(alias="starterQuery")


class StudyCaseTable(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    name: str
    description: str
    columns: list[str]
    sample_rows: list[dict[str, Any]] = Field(alias="sampleRows")


class SampleQuery(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str
    query: str
    explanation: str


class StudyCaseSummary(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    id: str
    title: str
    category: str
    difficulty: str
    description: str
    table_names: list[str] = Field(alias="tableNames")
    sample_queries: list[SampleQuery] = Field(alias="sampleQueries")
    challenges_count: int = Field(alias="challengesCount")


class StudyCaseDetail(StudyCaseSummary):
    tables: list[StudyCaseTable]
    challenges: list[StudyCaseChallenge]


class StudyCaseListResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    items: list[StudyCaseSummary]
