import hashlib
import hmac
import time
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, Request

from app.core.config import get_settings
from app.core.errors import PublicApiError

IDENTITY_MAX_AGE_SECONDS = 300


@dataclass(frozen=True)
class TrustedUser:
    user_id: str
    role: str = "mahasiswa"
    auth_method: str = "bff"


def create_access_token(user_id: str, role: str = "mahasiswa") -> str:
    settings = get_settings()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {
        "sub": user_id,
        "role": role,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def _expected_signature(*, timestamp: str, user_id: str) -> str:
    secret = get_settings().bff_shared_secret.encode("utf-8")
    signed_value = f"{timestamp}.{user_id}".encode("utf-8")
    return hmac.new(secret, signed_value, hashlib.sha256).hexdigest()


def require_trusted_user(request: Request) -> TrustedUser:
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1].strip()
        try:
            settings = get_settings()
            payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
            user_id = payload.get("sub")
            role = payload.get("role", "mahasiswa")
            if not user_id:
                raise PublicApiError(
                    status_code=401,
                    code="UNAUTHORIZED",
                    message="Token tidak memiliki identitas pengguna.",
                )
            return TrustedUser(user_id=str(user_id), role=str(role), auth_method="bearer")
        except jwt.PyJWTError as error:
            raise PublicApiError(
                status_code=401,
                code="UNAUTHORIZED",
                message="Token autentikasi tidak valid atau telah kedaluwarsa.",
            ) from error

    user_id = request.headers.get("x-sqlens-user-id")
    timestamp = request.headers.get("x-sqlens-bff-timestamp")
    signature = request.headers.get("x-sqlens-bff-signature")

    if not user_id or not timestamp or not signature:
        raise PublicApiError(
            status_code=401,
            code="UNAUTHORIZED",
            message="Identitas pengguna tidak tersedia.",
        )

    try:
        request_time = int(timestamp)
    except ValueError as error:
        raise PublicApiError(
            status_code=401,
            code="UNAUTHORIZED",
            message="Identitas pengguna tidak valid.",
        ) from error

    if abs(int(time.time()) - request_time) > IDENTITY_MAX_AGE_SECONDS:
        raise PublicApiError(
            status_code=401,
            code="UNAUTHORIZED",
            message="Identitas pengguna telah kedaluwarsa.",
        )

    expected = _expected_signature(timestamp=timestamp, user_id=user_id)
    if not hmac.compare_digest(signature, expected):
        raise PublicApiError(
            status_code=401,
            code="UNAUTHORIZED",
            message="Identitas pengguna tidak valid.",
        )

    return TrustedUser(user_id=user_id, role="dosen" if "lecturer" in user_id or "dosen" in user_id else "mahasiswa", auth_method="bff")


def require_role(allowed_roles: list[str]):
    def role_checker(current_user: TrustedUser = Depends(require_trusted_user)) -> TrustedUser:
        if current_user.auth_method == "bearer" and current_user.role not in allowed_roles:
            raise PublicApiError(
                status_code=403,
                code="FORBIDDEN",
                message="Akses ditolak untuk peran Anda.",
            )
        return current_user

    return role_checker

