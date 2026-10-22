from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SQLens API"
    api_v1_prefix: str = "/v1"
    database_url: str = Field(validation_alias="DATABASE_URL")
    bff_shared_secret: str = Field(min_length=32, validation_alias="BFF_SHARED_SECRET")
    jwt_secret_key: str = Field(default="sqlens-default-jwt-secret-key-change-in-prod-min32", min_length=32, validation_alias="JWT_SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", validation_alias="JWT_ALGORITHM")
    jwt_expire_minutes: int = Field(default=60 * 24 * 7, ge=1, validation_alias="JWT_EXPIRE_MINUTES")
    sql_statement_timeout_ms: int = Field(default=3000, ge=100, le=10_000, validation_alias="SQL_STATEMENT_TIMEOUT_MS")
    openrouter_api_key: str | None = Field(default=None, validation_alias="OPENROUTER_API_KEY")
    sqlens_ai_model: str = Field(default="deepseek/deepseek-chat", validation_alias="SQLENS_AI_MODEL")
    sqlens_ai_base_url: str = Field(default="https://openrouter.ai/api/v1/chat/completions", validation_alias="SQLENS_AI_BASE_URL")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


def get_settings() -> Settings:
    return Settings()


