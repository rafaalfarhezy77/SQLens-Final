import hashlib
import hmac
import time
from dataclasses import dataclass

from fastapi import Request

from app.core.config import get_settings
from app.core.errors import PublicApiError

IDENTITY_MAX_AGE_SECONDS = 300


@dataclass(frozen=True)
class TrustedUser:
    user_id: str


def _expected_signature(*, timestamp: str, user_id: str) -> str:
    secret = get_settings().bff_shared_secret.encode("utf-8")
    signed_value = f"{timestamp}.{user_id}".encode("utf-8")
    return hmac.new(secret, signed_value, hashlib.sha256).hexdigest()


def require_trusted_user(request: Request) -> TrustedUser:
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

    return TrustedUser(user_id=user_id)
