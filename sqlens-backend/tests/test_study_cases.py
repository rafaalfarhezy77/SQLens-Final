import asyncio
import hashlib
import hmac
import json
import time
from typing import Any

import pytest
from app.core.config import get_settings
from app.main import app
from app.services.study_cases import StudyCaseService


def make_bff_headers(user_id: str) -> dict[str, str]:
    settings = get_settings()
    timestamp = str(int(time.time()))
    secret = settings.bff_shared_secret.encode("utf-8")
    signed_value = f"{timestamp}.{user_id}".encode("utf-8")
    signature = hmac.new(secret, signed_value, hashlib.sha256).hexdigest()
    return {
        "x-sqlens-user-id": user_id,
        "x-sqlens-bff-timestamp": timestamp,
        "x-sqlens-bff-signature": signature,
    }


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


def sync_request(
    method: str,
    path: str,
    *,
    json_data: Any = None,
    headers: dict[str, str] | None = None,
) -> dict[str, Any]:
    return asyncio.run(asgi_request(method, path, json_data=json_data, headers=headers))


class TestStudyCasesServiceAndEndpoints:
    def test_list_study_cases_service(self):
        svc = StudyCaseService()
        cases = svc.list_study_cases()
        assert len(cases) >= 3
        ids = [c.id for c in cases]
        assert "academic" in ids
        assert "ecommerce" in ids
        assert "library" in ids

    def test_list_study_cases_endpoint(self):
        headers = make_bff_headers("usr_student_test_01")
        res = sync_request("GET", "/v1/study-cases", headers=headers)
        assert res["status_code"] == 200
        items = res["json"]["items"]
        assert len(items) >= 3
        academic = next((item for item in items if item["id"] == "academic"), None)
        assert academic is not None
        assert "students" in academic["tableNames"]
        assert len(academic["sampleQueries"]) > 0

    def test_get_study_case_academic(self):
        headers = make_bff_headers("usr_student_test_01")
        res = sync_request("GET", "/v1/study-cases/academic", headers=headers)
        assert res["status_code"] == 200
        data = res["json"]
        assert data["id"] == "academic"
        table_names = [t["name"] for t in data["tables"]]
        assert "students" in table_names
        assert "scores" in table_names
        assert len(data["challenges"]) > 0

    def test_get_study_case_ecommerce(self):
        headers = make_bff_headers("usr_student_test_01")
        res = sync_request("GET", "/v1/study-cases/ecommerce", headers=headers)
        assert res["status_code"] == 200
        data = res["json"]
        assert data["id"] == "ecommerce"
        table_names = [t["name"] for t in data["tables"]]
        assert "customers" in table_names
        assert "products" in table_names
        assert "orders" in table_names
        assert len(data["challenges"]) > 0

    def test_get_study_case_library(self):
        headers = make_bff_headers("usr_student_test_01")
        res = sync_request("GET", "/v1/study-cases/library", headers=headers)
        assert res["status_code"] == 200
        data = res["json"]
        assert data["id"] == "library"
        table_names = [t["name"] for t in data["tables"]]
        assert "members" in table_names
        assert "books" in table_names
        assert "borrowings" in table_names
        assert len(data["challenges"]) > 0

    def test_get_study_case_not_found(self):
        headers = make_bff_headers("usr_student_test_01")
        res = sync_request("GET", "/v1/study-cases/unknown_case_id", headers=headers)
        assert res["status_code"] == 404
        assert res["json"]["code"] == "STUDY_CASE_NOT_FOUND"

    def test_query_execution_on_ecommerce_tables(self):
        headers = make_bff_headers("usr_student_test_01")
        query_payload = {
            "query": "SELECT c.name, p.name AS product_name, oi.quantity FROM customers c JOIN orders o ON c.id = o.customer_id JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id WHERE o.status = 'PAID';"
        }
        res = sync_request("POST", "/v1/query-executions", json_data=query_payload, headers=headers)
        # Verify execution succeeds and generates visualization stages
        assert res["status_code"] == 200
        body = res["json"]
        assert body["status"] == "success"
        assert len(body["columns"]) > 0
        assert len(body["steps"]) > 0
        assert any(step["clause"] in ["FROM", "JOIN", "WHERE", "SELECT"] for step in body["steps"])

    def test_query_execution_on_library_tables(self):
        headers = make_bff_headers("usr_student_test_01")
        query_payload = {
            "query": "SELECT m.name AS peminjam, b.title AS judul_buku, bw.status FROM members m JOIN borrowings bw ON m.id = bw.member_id JOIN books b ON bw.book_id = b.id;"
        }
        res = sync_request("POST", "/v1/query-executions", json_data=query_payload, headers=headers)
        assert res["status_code"] == 200
        body = res["json"]
        assert body["status"] == "success"
        assert len(body["columns"]) > 0
        assert len(body["steps"]) > 0
