import asyncio
import json
from typing import Any
from unittest.mock import MagicMock, patch

import pytest
from fastapi import Request

from app.core.config import get_settings
from app.core.errors import PublicApiError
from app.core.security import (
    TrustedUser,
    create_access_token,
    require_role,
    require_trusted_user,
)
from app.main import app
from app.schemas.ai_tutor import AiTutorRequest, AiTutorResponse
from app.services.ai_tutor import AiTutorService


def test_jwt_token_creation_and_decoding():
    token = create_access_token(user_id="usr_student_01", role="mahasiswa")
    assert isinstance(token, str)
    assert len(token) > 20

    # Build mock request with Bearer token
    scope = {
        "type": "http",
        "headers": [(b"authorization", f"Bearer {token}".encode("latin1"))],
    }
    req = Request(scope)
    trusted = require_trusted_user(req)
    assert trusted.user_id == "usr_student_01"
    assert trusted.role == "mahasiswa"
    assert trusted.auth_method == "bearer"


def test_jwt_token_invalid_or_expired():
    scope = {
        "type": "http",
        "headers": [(b"authorization", b"Bearer invalid.token.value")],
    }
    req = Request(scope)
    with pytest.raises(PublicApiError) as exc_info:
        require_trusted_user(req)
    assert exc_info.value.status_code == 401
    assert exc_info.value.code == "UNAUTHORIZED"


def test_require_role_authorization_enforcement():
    role_guard = require_role(["dosen"])

    # Student with bearer token -> 403 Forbidden
    student_user = TrustedUser(user_id="s1", role="mahasiswa", auth_method="bearer")
    with pytest.raises(PublicApiError) as exc_info:
        role_guard(current_user=student_user)
    assert exc_info.value.status_code == 403
    assert exc_info.value.code == "FORBIDDEN"

    # Lecturer with bearer token -> OK
    lecturer_user = TrustedUser(user_id="l1", role="dosen", auth_method="bearer")
    allowed = role_guard(current_user=lecturer_user)
    assert allowed.user_id == "l1"
    assert allowed.role == "dosen"

    # BFF request with lecturer id -> OK
    bff_lecturer = TrustedUser(user_id="lecturer-123", role="dosen", auth_method="bff")
    allowed_bff = role_guard(current_user=bff_lecturer)
    assert allowed_bff.user_id == "lecturer-123"


def test_ai_tutor_fallback_scenarios():
    service = AiTutorService()

    # 1. Filter / WHERE scenario
    res_filter = service.ask(prompt="Mengapa Citra Dewi tidak muncul pada hasil?", query="SELECT * FROM scores WHERE score >= 80")
    assert isinstance(res_filter, AiTutorResponse)
    assert "WHERE" in res_filter.explanation or "predikat" in res_filter.explanation
    assert len(res_filter.reasoning) >= 2

    # 2. JOIN scenario
    res_join = service.ask(prompt="Bagaimana cara kerja INNER JOIN tabel students dan scores?")
    assert isinstance(res_join, AiTutorResponse)
    assert "JOIN" in res_join.sql_concept or "relasi" in res_join.sql_concept.lower()

    # 3. Generic fallback
    res_generic = service.ask(prompt="Apa itu database relasional?")
    assert isinstance(res_generic, AiTutorResponse)
    assert len(res_generic.explanation) > 10
    assert len(res_generic.reasoning) >= 1


async def asgi_request(
    method: str,
    path: str,
    *,
    json_data: Any = None,
    headers: dict[str, str] | None = None,
) -> dict[str, Any]:
    header_dict = dict(headers or {})
    body_bytes = b""
    if json_data is not None:
        body_bytes = json.dumps(json_data).encode("utf-8")
        header_dict["content-type"] = "application/json"
    header_dict["content-length"] = str(len(body_bytes))

    raw_headers = [
        (k.lower().encode("latin1"), v.encode("latin1"))
        for k, v in header_dict.items()
    ]

    scope = {
        "type": "http",
        "asgi": {"version": "3.0"},
        "http_version": "1.1",
        "method": method.upper(),
        "scheme": "http",
        "path": path,
        "raw_path": path.encode("latin1"),
        "query_string": b"",
        "headers": raw_headers,
        "client": ("127.0.0.1", 12345),
        "server": ("127.0.0.1", 80),
    }

    response_status = 500
    response_body = bytearray()

    async def receive() -> dict[str, Any]:
        return {"type": "http.request", "body": body_bytes, "more_body": False}

    async def send(message: dict[str, Any]) -> None:
        nonlocal response_status, response_body
        if message["type"] == "http.response.start":
            response_status = message["status"]
        elif message["type"] == "http.response.body":
            response_body.extend(message.get("body", b""))

    await app(scope, receive, send)

    parsed_json = None
    if response_body:
        try:
            parsed_json = json.loads(response_body.decode("utf-8"))
        except Exception:
            parsed_json = response_body.decode("utf-8", errors="replace")

    return {
        "status_code": response_status,
        "json": parsed_json,
    }


def test_ai_tutor_api_endpoint_with_bearer_token():
    token = create_access_token(user_id="test_user_mobile", role="mahasiswa")
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "prompt": "Mengapa Citra tidak muncul di hasil query?",
        "query": "SELECT * FROM students WHERE score >= 80;",
        "context": "where-filter",
    }

    res = asyncio.run(asgi_request("POST", "/v1/ai-tutor/ask", json_data=payload, headers=headers))
    assert res["status_code"] == 200
    data = res["json"]
    assert "explanation" in data
    assert "hint" in data
    assert "sqlConcept" in data
    assert "reasoning" in data
    assert isinstance(data["reasoning"], list)


def test_ai_tutor_rejects_unauthorized():
    payload = {"prompt": "Pertanyaan tanpa token"}
    res = asyncio.run(asgi_request("POST", "/v1/ai-tutor/ask", json_data=payload))
    assert res["status_code"] == 401
    assert res["json"]["code"] == "UNAUTHORIZED"
