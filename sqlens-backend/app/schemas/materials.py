from typing import Literal
from pydantic import BaseModel, ConfigDict, Field

Difficulty = Literal["Dasar", "Menengah", "Lanjut"]
Status = Literal["draft", "published"]


class MaterialBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True, str_strip_whitespace=True)

    title: str = Field(min_length=3, max_length=255)
    topic: str = Field(default="SQL", min_length=2, max_length=100)
    difficulty: Difficulty = "Dasar"
    content: str = Field(default="Materi pembelajaran SQL.", min_length=5)
    sample_sql: str = Field(default="SELECT * FROM students;", min_length=6, alias="sampleSql")
    status: Status = "draft"


class MaterialCreateRequest(MaterialBase):
    pass


class MaterialUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, str_strip_whitespace=True)

    title: str | None = Field(default=None, min_length=3, max_length=255)
    topic: str | None = Field(default=None, min_length=2, max_length=100)
    difficulty: Difficulty | None = None
    content: str | None = Field(default=None, min_length=5)
    sample_sql: str | None = Field(default=None, min_length=6, alias="sampleSql")
    status: Status | None = None


class MaterialResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    id: str
    title: str
    topic: str
    difficulty: Difficulty
    content: str
    sample_sql: str = Field(alias="sampleSql")
    status: Status


class MaterialListResponse(BaseModel):
    items: list[MaterialResponse]
