from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


Role = Literal["mahasiswa", "dosen"]


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    email: str = Field(min_length=3, max_length=320)
    password: str = Field(min_length=6, max_length=128)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if "@" not in normalized or normalized.startswith("@") or normalized.endswith("@"):
            raise ValueError("Alamat email tidak valid.")
        return normalized


class RegisterRequest(LoginRequest):
    name: str = Field(min_length=2, max_length=120)
    role: Role = "mahasiswa"


class AuthenticatedUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    role: Role
