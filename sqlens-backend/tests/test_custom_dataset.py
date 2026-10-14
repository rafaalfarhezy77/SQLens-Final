import asyncio
import hashlib
import hmac
import json
import time
from typing import Any
from uuid import uuid4

import pytest

from app.core.config import get_settings
from app.main import app


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


class TestCustomDatasetEndpoints:
    def test_custom_dataset_lifecycle_and_query_execution(self) -> None:
        user_id = str(uuid4())
        headers = make_bff_headers(user_id)

        # 1. Initial status: user does not have custom dataset
        res = sync_request("GET", "/v1/datasets/custom", headers=headers)
        assert res["status_code"] == 200
        assert res["json"]["has_custom_dataset"] is False
        assert len(res["json"]["tables"]) == 0

        # 2. Upload CSV dataset (products and categories)
        categories_csv = "id,nama_kategori\n1,Elektronik\n2,Pakaian\n3,Buku"
        products_csv = (
            "id,nama_produk,kategori_id,harga\n"
            "10,Laptop,1,12000000\n"
            "11,Mouse,1,150000\n"
            "12,Kemeja,2,250000\n"
            "13,Novel,3,95000"
        )
        upload_payload = {
            "files": [
                {"filename": "kategori.csv", "content": categories_csv},
                {"filename": "produk.csv", "content": products_csv},
            ]
        }
        res_upload = sync_request(
            "POST", "/v1/datasets/custom/upload-csv", json_data=upload_payload, headers=headers
        )
        assert res_upload["status_code"] == 200
        assert res_upload["json"]["status"] == "success"
        tables = res_upload["json"]["tables"]
        table_names = {t["name"] for t in tables}
        assert "kategori" in table_names
        assert "produk" in table_names

        # 3. Fetch custom dataset status
        res_status = sync_request("GET", "/v1/datasets/custom", headers=headers)
        assert res_status["status_code"] == 200
        assert res_status["json"]["has_custom_dataset"] is True
        assert len(res_status["json"]["tables"]) == 2

        # 4. Execute query on custom tables
        query_payload = {
            "query": "SELECT produk.nama_produk, kategori.nama_kategori, produk.harga FROM produk JOIN kategori ON produk.kategori_id = kategori.id WHERE produk.harga > 200000"
        }
        res_exec = sync_request("POST", "/v1/query-executions", json_data=query_payload, headers=headers)
        assert res_exec["status_code"] == 200
        assert res_exec["json"]["status"] == "success"
        rows = res_exec["json"]["rows"]
        assert len(rows) == 2
        # Laptop and Kemeja have harga > 200000
        assert any(r["nama_produk"] == "Laptop" for r in rows)
        assert any(r["nama_produk"] == "Kemeja" for r in rows)

        # 5. Check visual stages were generated
        steps = res_exec["json"]["steps"]
        assert len(steps) >= 3  # FROM, JOIN, WHERE, SELECT
        assert any(s["clause"] == "FROM" for s in steps)
        assert any(s["clause"] == "JOIN" for s in steps)
        assert any(s["clause"] == "WHERE" for s in steps)

        # 6. Reset custom dataset
        res_reset = sync_request("DELETE", "/v1/datasets/custom", headers=headers)
        assert res_reset["status_code"] == 200
        assert res_reset["json"]["status"] == "success"

        # 7. Check custom dataset is now gone
        res_after = sync_request("GET", "/v1/datasets/custom", headers=headers)
        assert res_after["status_code"] == 200
        assert res_after["json"]["has_custom_dataset"] is False

    def test_upload_sql_script(self) -> None:
        user_id = str(uuid4())
        headers = make_bff_headers(user_id)

        sql_content = """
        CREATE TABLE gudang (id INT PRIMARY KEY, lokasi VARCHAR(100), kapasitas INT);
        INSERT INTO gudang VALUES (1, 'Jakarta', 5000), (2, 'Surabaya', 3000);
        """
        res = sync_request(
            "POST",
            "/v1/datasets/custom/upload-sql",
            json_data={"sql": sql_content},
            headers=headers,
        )
        assert res["status_code"] == 200
        assert res["json"]["status"] == "success"
        assert len(res["json"]["tables"]) == 1
        assert res["json"]["tables"][0]["name"] == "gudang"

        # Query custom sql table
        res_exec = sync_request(
            "POST",
            "/v1/query-executions",
            json_data={"query": "SELECT lokasi, kapasitas FROM gudang WHERE kapasitas > 4000"},
            headers=headers,
        )
        assert res_exec["status_code"] == 200
        assert len(res_exec["json"]["rows"]) == 1
        assert res_exec["json"]["rows"][0]["lokasi"] == "Jakarta"

        # Cleanup
        sync_request("DELETE", "/v1/datasets/custom", headers=headers)

    def test_upload_validation_errors(self) -> None:
        user_id = str(uuid4())
        headers = make_bff_headers(user_id)

        # 1. Empty CSV
        res = sync_request(
            "POST",
            "/v1/datasets/custom/upload-csv",
            json_data={"files": [{"filename": "empty.csv", "content": ""}]},
            headers=headers,
        )
        assert res["status_code"] == 400
        assert res["json"]["code"] == "EMPTY_CSV"

        # 2. Forbidden SQL keyword
        res_sql = sync_request(
            "POST",
            "/v1/datasets/custom/upload-sql",
            json_data={"sql": "DROP TABLE students;"},
            headers=headers,
        )
        assert res_sql["status_code"] == 400
        assert res_sql["json"]["code"] == "FORBIDDEN_SQL_IN_CUSTOM_DATASET"
