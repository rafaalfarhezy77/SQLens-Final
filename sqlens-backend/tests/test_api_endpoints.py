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


class TestHealthEndpoint:
    def test_get_healthcheck(self) -> None:
        res = sync_request("GET", "/health")
        assert res["status_code"] == 200
        assert res["json"] == {"status": "ok"}


class TestAuthEndpoints:
    def test_register_and_login_mahasiswa(self) -> None:
        unique_email = f"student_{uuid4().hex[:8]}@sqlens.edu"
        password = "SecretPassword123"

        # 1. Register Mahasiswa (FR-01)
        reg_payload = {
            "name": "Budi Mahasiswa",
            "email": unique_email,
            "password": password,
            "role": "mahasiswa",
        }
        reg_res = sync_request("POST", "/v1/auth/register", json_data=reg_payload)
        assert reg_res["status_code"] == 201
        data = reg_res["json"]
        assert data["email"] == unique_email
        assert data["role"] == "mahasiswa"
        assert "id" in data

        # 2. Duplicate Register Reject (FR-01 validation)
        dup_res = sync_request("POST", "/v1/auth/register", json_data=reg_payload)
        assert dup_res["status_code"] == 409
        assert dup_res["json"]["code"] == "EMAIL_ALREADY_REGISTERED"

        # 3. Login Valid (FR-02)
        login_payload = {"email": unique_email, "password": password}
        login_res = sync_request("POST", "/v1/auth/login", json_data=login_payload)
        assert login_res["status_code"] == 200
        login_data = login_res["json"]
        assert login_data["email"] == unique_email
        assert login_data["role"] == "mahasiswa"

        # 4. Login Invalid Password (FR-02)
        bad_pw_res = sync_request(
            "POST",
            "/v1/auth/login",
            json_data={"email": unique_email, "password": "WrongPassword123"},
        )
        assert bad_pw_res["status_code"] == 401
        assert bad_pw_res["json"]["code"] == "INVALID_CREDENTIALS"

    def test_register_dosen(self) -> None:
        # FR-01: Dosen role registration
        unique_email = f"dosen_{uuid4().hex[:8]}@sqlens.edu"
        reg_payload = {
            "name": "Dr. Dosen SQL",
            "email": unique_email,
            "password": "LecturerPassword123",
            "role": "dosen",
        }
        res = sync_request("POST", "/v1/auth/register", json_data=reg_payload)
        assert res["status_code"] == 201
        data = res["json"]
        assert data["role"] == "dosen"
        assert data["email"] == unique_email


class TestDatasetsEndpoint:
    def test_datasets_rejects_unauthorized(self) -> None:
        # Protection against unsigned requests
        res = sync_request("GET", "/v1/datasets/educational")
        assert res["status_code"] == 401
        assert res["json"]["code"] == "UNAUTHORIZED"

    def test_datasets_accepts_valid_signature(self) -> None:
        # FR-14: Educational dataset retrieval
        headers = make_bff_headers(f"user-{uuid4().hex[:6]}")
        res = sync_request("GET", "/v1/datasets/educational", headers=headers)
        assert res["status_code"] == 200
        data = res["json"]
        assert "tables" in data
        assert len(data["tables"]) >= 2
        table_names = [t["name"] for t in data["tables"]]
        assert "students" in table_names
        assert "scores" in table_names


class TestQueryExecutionEndpoint:
    def test_query_execution_rejects_unauthorized(self) -> None:
        # Protection against unsigned requests
        res = sync_request(
            "POST", "/v1/query-executions", json_data={"query": "SELECT * FROM students;"}
        )
        assert res["status_code"] == 401
        assert res["json"]["code"] == "UNAUTHORIZED"

    def test_query_execution_select_success(self) -> None:
        # FR-04, FR-05, FR-06: SELECT execution
        user_id = f"user-{uuid4().hex[:6]}"
        headers = make_bff_headers(user_id)
        payload = {"query": "SELECT id, name, major FROM students;"}

        res = sync_request("POST", "/v1/query-executions", json_data=payload, headers=headers)
        assert res["status_code"] == 200
        data = res["json"]
        assert data["status"] == "success"
        assert "columns" in data
        assert "id" in data["columns"]
        assert len(data["rows"]) > 0
        assert "steps" in data
        assert len(data["steps"]) >= 2

    def test_query_execution_join_visualization(self) -> None:
        # FR-07, FR-08: JOIN visual stages & metadata
        user_id = f"user-{uuid4().hex[:6]}"
        headers = make_bff_headers(user_id)
        query = "SELECT s.name, sc.score FROM students s JOIN scores sc ON s.id = sc.student_id;"

        res = sync_request(
            "POST", "/v1/query-executions", json_data={"query": query}, headers=headers
        )
        assert res["status_code"] == 200
        data = res["json"]
        assert data["status"] == "success"

        join_stages = [s for s in data["steps"] if s["clause"] == "JOIN"]
        assert len(join_stages) == 1
        join_details = join_stages[0]["joinDetails"]
        assert join_details is not None
        assert join_details["leftTable"] == "students"
        assert join_details["rightTable"] == "scores"

    def test_query_execution_where_filter(self) -> None:
        # FR-07, FR-09: Filter visual evaluation
        user_id = f"user-{uuid4().hex[:6]}"
        headers = make_bff_headers(user_id)
        query = "SELECT * FROM scores WHERE score >= 80;"

        res = sync_request(
            "POST", "/v1/query-executions", json_data={"query": query}, headers=headers
        )
        assert res["status_code"] == 200
        data = res["json"]
        where_stages = [s for s in data["steps"] if s["clause"] == "WHERE"]
        assert len(where_stages) == 1
        assert "rowEvaluations" in where_stages[0]

    def test_query_execution_blocks_destructive_operations(self) -> None:
        # FR-10: Policy linter blocking destructive statements
        user_id = f"user-{uuid4().hex[:6]}"
        headers = make_bff_headers(user_id)

        destructive_queries = [
            "DROP TABLE students;",
            "DELETE FROM students WHERE id = 1;",
            "TRUNCATE TABLE scores;",
            "UPDATE students SET name = 'Hacked';",
            "INSERT INTO students (id, name, major) VALUES (99, 'X', 'Y');",
        ]
        for query in destructive_queries:
            res = sync_request(
                "POST", "/v1/query-executions", json_data={"query": query}, headers=headers
            )
            assert res["status_code"] == 400
            assert res["json"]["status"] == "error"
            assert res["json"]["error"]["code"] in [
                "READ_ONLY_POLICY_VIOLATION",
                "SELECT_ONLY_POLICY",
            ]

    def test_query_execution_handles_syntax_error(self) -> None:
        # FR-10: Error handling for syntax error
        user_id = f"user-{uuid4().hex[:6]}"
        headers = make_bff_headers(user_id)
        res = sync_request(
            "POST",
            "/v1/query-executions",
            json_data={"query": "SELECT non_existent_col FROM students;"},
            headers=headers,
        )
        assert res["status_code"] == 400
        assert res["json"]["status"] == "error"
        assert res["json"]["error"]["code"] == "QUERY_EXECUTION_FAILED"


class TestQueryHistoryEndpoints:
    def test_history_lifecycle(self) -> None:
        # FR-13: Saving learning activities & retrieval/deletion
        user_id = f"user-hist-{uuid4().hex[:6]}"
        headers = make_bff_headers(user_id)

        # 1. Initial history is empty
        res1 = sync_request("GET", "/v1/query-history", headers=headers)
        assert res1["status_code"] == 200
        assert len(res1["json"]["items"]) == 0

        # 2. Execute a valid query -> automatically recorded
        sync_request(
            "POST",
            "/v1/query-executions",
            json_data={"query": "SELECT id, name FROM students;"},
            headers=headers,
        )

        # 3. Execute an invalid query -> recorded with status="error"
        sync_request(
            "POST",
            "/v1/query-executions",
            json_data={"query": "SELECT wrong_col FROM students;"},
            headers=headers,
        )

        # 4. Check history items
        res2 = sync_request("GET", "/v1/query-history", headers=headers)
        assert res2["status_code"] == 200
        items = res2["json"]["items"]
        assert len(items) == 2
        statuses = [item["status"] for item in items]
        assert "success" in statuses
        assert "error" in statuses

        # 5. Delete single history item (DELETE /v1/query-history/{id})
        target_id = items[0]["id"]
        del_single = sync_request("DELETE", f"/v1/query-history/{target_id}", headers=headers)
        assert del_single["status_code"] == 204

        res3 = sync_request("GET", "/v1/query-history", headers=headers)
        assert len(res3["json"]["items"]) == 1

        # 6. Clear all history (DELETE /v1/query-history)
        del_all = sync_request("DELETE", "/v1/query-history", headers=headers)
        assert del_all["status_code"] == 204

        res4 = sync_request("GET", "/v1/query-history", headers=headers)
        assert len(res4["json"]["items"]) == 0


class TestProfileEndpoint:
    def test_update_profile(self) -> None:
        # FR-03: Kelola Profil
        unique_email = f"user_prof_{uuid4().hex[:8]}@sqlens.edu"
        reg_res = sync_request(
            "POST",
            "/v1/auth/register",
            json_data={
                "name": "Original Name",
                "email": unique_email,
                "password": "Password123!",
                "role": "mahasiswa",
            },
        )
        assert reg_res["status_code"] == 201
        user_id = reg_res["json"]["id"]
        headers = make_bff_headers(user_id)

        # 1. Update unauthorized
        unauth = sync_request("PATCH", "/v1/auth/profile", json_data={"name": "New Name"})
        assert unauth["status_code"] == 401

        # 2. Update name
        update_res = sync_request(
            "PATCH",
            "/v1/auth/profile",
            json_data={"name": "Updated Name", "avatarUrl": "https://avatar.example.com/me.png"},
            headers=headers,
        )
        assert update_res["status_code"] == 200
        assert update_res["json"]["name"] == "Updated Name"
        assert update_res["json"]["email"] == unique_email


class TestMaterialsEndpoints:
    def test_materials_crud(self) -> None:
        # FR-16: Mengelola Materi SQL
        lecturer_id = f"lecturer-{uuid4().hex[:6]}"
        headers = make_bff_headers(lecturer_id)

        # 1. List materials without auth -> 401
        unauth = sync_request("GET", "/v1/materials")
        assert unauth["status_code"] == 401

        # 2. Create material
        create_payload = {
            "title": "Subqueries and CTEs",
            "topic": "Advanced SQL",
            "difficulty": "Lanjut",
            "content": "Pembahasan WITH clause dan nested query.",
            "sampleSql": "WITH cte AS (SELECT * FROM students) SELECT * FROM cte;",
            "status": "published",
        }
        create_res = sync_request(
            "POST", "/v1/materials", json_data=create_payload, headers=headers
        )
        assert create_res["status_code"] == 201
        mat = create_res["json"]
        assert mat["title"] == "Subqueries and CTEs"
        mat_id = mat["id"]

        # 3. Get single material
        get_res = sync_request("GET", f"/v1/materials/{mat_id}", headers=headers)
        assert get_res["status_code"] == 200
        assert get_res["json"]["id"] == mat_id

        # 4. List materials contains the new material
        list_res = sync_request("GET", "/v1/materials", headers=headers)
        assert list_res["status_code"] == 200
        ids = [m["id"] for m in list_res["json"]["items"]]
        assert mat_id in ids

        # 5. Update material
        update_res = sync_request(
            "PUT",
            f"/v1/materials/{mat_id}",
            json_data={"title": "Subqueries and Common Table Expressions", "difficulty": "Menengah"},
            headers=headers,
        )
        assert update_res["status_code"] == 200
        assert update_res["json"]["title"] == "Subqueries and Common Table Expressions"
        assert update_res["json"]["difficulty"] == "Menengah"

        # 6. Delete material
        del_res = sync_request("DELETE", f"/v1/materials/{mat_id}", headers=headers)
        assert del_res["status_code"] == 204

        # 7. Check 404 on deleted material
        not_found = sync_request("GET", f"/v1/materials/{mat_id}", headers=headers)
        assert not_found["status_code"] == 404


class TestLecturerEndpoints:
    def test_lecturer_monitoring(self) -> None:
        # FR-17 & FR-18: Melihat Aktivitas Mahasiswa & Hasil/Progres Pembelajaran
        lecturer_id = f"lecturer-{uuid4().hex[:6]}"
        headers = make_bff_headers(lecturer_id)

        # 1. Activities list
        act_res = sync_request("GET", "/v1/lecturer/activities", headers=headers)
        assert act_res["status_code"] == 200
        assert "items" in act_res["json"]
        assert isinstance(act_res["json"]["items"], list)

        # 2. Progress list
        prog_res = sync_request("GET", "/v1/lecturer/progress", headers=headers)
        assert prog_res["status_code"] == 200
        assert "items" in prog_res["json"]
        assert isinstance(prog_res["json"]["items"], list)


class TestIoTEndpoints:
    def test_iot_telemetry_and_monitoring(self) -> None:
        # FR-19: Monitoring Data IoT
        # 1. Record telemetry without needing user headers (sensor ingestion)
        sensor_payload = {
            "deviceId": "esp32-chem-lab-01",
            "sensorType": "Temperature",
            "value": 24.2,
            "unit": "°C",
            "status": "normal",
        }
        ingest_res = sync_request("POST", "/v1/iot/telemetry", json_data=sensor_payload)
        assert ingest_res["status_code"] == 201
        data = ingest_res["json"]
        assert data["deviceId"] == "esp32-chem-lab-01"
        assert data["value"] == 24.2
        assert "recordedAt" in data

        # 2. Query readings as authenticated dashboard user
        user_id = f"user-{uuid4().hex[:6]}"
        headers = make_bff_headers(user_id)
        get_res = sync_request("GET", "/v1/iot/readings", headers=headers)
        assert get_res["status_code"] == 200
        items = get_res["json"]["items"]
        assert len(items) > 0
        device_ids = [item["deviceId"] for item in items]
        assert "esp32-chem-lab-01" in device_ids
