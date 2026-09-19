from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SQLens API"
    api_v1_prefix: str = "/v1"
    database_url: str = Field(validation_alias="DATABASE_URL")
    bff_shared_secret: str = Field(min_length=32, validation_alias="BFF_SHARED_SECRET")
    sql_statement_timeout_ms: int = Field(default=3000, ge=100, le=10_000, validation_alias="SQL_STATEMENT_TIMEOUT_MS")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
