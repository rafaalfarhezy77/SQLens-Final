import asyncio
import hashlib
import hmac
import json
import time
from typing import Any
from uuid import uuid4

import pytest
from app.core.config import get_settings
from app.core.security import create_access_token
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


class TestSharedDatasets:
    def test_lecturer_upload_csv_and_student_query(self):
        dosen_id = f"dos_{uuid4().hex[:8]}"
        dosen_token = create_access_token(user_id=dosen_id, role="dosen")
        dosen_headers = {"Authorization": f"Bearer {dosen_token}"}

        # 1. Lecturer uploads shared CSV dataset
        csv_content = "id,nama_kota,populasi\n1,Jakarta,10560000\n2,Surabaya,2870000\n3,Bandung,2440000\n"
        upload_payload = {
            "title": "Dataset Demografi Kota Indonesia",
            "description": "Dataset latihan SQL agregasi dan filter kota besar.",
            "files": [
                {
                    "filename": "kota_besar.csv",
                    "content": csv_content,
                }
            ],
        }
        res_upload = sync_request(
            "POST",
            "/v1/lecturer/shared-datasets/upload-csv",
            json_data=upload_payload,
            headers=dosen_headers,
        )
        assert res_upload["status_code"] == 201
        dataset_data = res_upload["json"]
        dataset_id = dataset_data["id"]
        assert dataset_data["title"] == "Dataset Demografi Kota Indonesia"
        assert len(dataset_data["tables"]) > 0
        tbl_name = dataset_data["tables"][0]["name"]

        # 2. Student lists shared datasets
        student_id = f"mhs_{uuid4().hex[:8]}"
        student_token = create_access_token(user_id=student_id, role="mahasiswa")
        student_headers = {"Authorization": f"Bearer {student_token}"}

        res_list = sync_request("GET", "/v1/shared-datasets", headers=student_headers)
        assert res_list["status_code"] == 200
        items = res_list["json"]["items"]
        assert any(item["id"] == dataset_id for item in items)

        # 3. Student views detail
        res_detail = sync_request(
            "GET", f"/v1/shared-datasets/{dataset_id}", headers=student_headers
        )
        assert res_detail["status_code"] == 200
        assert res_detail["json"]["id"] == dataset_id
        assert len(res_detail["json"]["tables"]) > 0

        # 4. Student executes query targeting the shared dataset
        query_payload = {
            "query": f"SELECT nama_kota, populasi FROM {tbl_name} WHERE populasi > 2500000 ORDER BY populasi DESC;",
            "sharedDatasetId": dataset_id,
        }
        res_exec = sync_request(
            "POST",
            "/v1/query-executions",
            json_data=query_payload,
            headers=student_headers,
        )
        assert res_exec["status_code"] == 200
        assert res_exec["json"]["status"] == "success"
        rows = res_exec["json"]["rows"]
        assert len(rows) == 2  # Jakarta and Surabaya
        assert rows[0]["nama_kota"] == "Jakarta"

        # 5. Clean up: Lecturer deletes the shared dataset
        res_del = sync_request(
            "DELETE",
            f"/v1/lecturer/shared-datasets/{dataset_id}",
            headers=dosen_headers,
        )
        assert res_del["status_code"] == 204

    def test_student_cannot_upload_to_lecturer_shared_dataset(self):
        student_id = f"mhs_{uuid4().hex[:8]}"
        student_token = create_access_token(user_id=student_id, role="mahasiswa")
        student_headers = {"Authorization": f"Bearer {student_token}"}

        upload_payload = {
            "title": "Dataset Coba-coba Mahasiswa",
            "description": "Harus ditolak karena bukan dosen.",
            "files": [
                {
                    "filename": "test.csv",
                    "content": "a,b\n1,2\n",
                }
            ],
        }
        res = sync_request(
            "POST",
            "/v1/lecturer/shared-datasets/upload-csv",
            json_data=upload_payload,
            headers=student_headers,
        )
        assert res["status_code"] == 403
        assert res["json"]["code"] == "FORBIDDEN"
