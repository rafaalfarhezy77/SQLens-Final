# SQLens FastAPI Backend

This service provides SQLens' read-only PostgreSQL execution, persisted users,
user-scoped query history, educational dataset previews, and deterministic
processing stages for the supported teaching subset: `SELECT`, `WHERE`, and
basic `INNER JOIN` over `students` and `scores`. Browser clients do not call it
directly; Next.js server code owns the browser-safe session boundary.

## Local setup

1. Create a PostgreSQL database and an application role with access to the
   `students`, `scores`, and `query_history` tables. The runtime role needs
   history write/delete permission. SQL execution is constrained by an
   independent SELECT-only policy and a read-only transaction.
2. Copy `.env.example` to `.env` and replace each placeholder.
3. Create a virtual environment, install `requirements.txt`, then run:

   ```bash
   python -m app.db.bootstrap
   uvicorn app.main:app --reload --port 8000
   ```

The bootstrap command reproducibly creates the users/query-history tables and seeds
the deterministic `students` and `scores` educational dataset. It is for local
development; production schema changes need a reviewed migration process.

## Routes

- `POST /v1/query-executions`
- `POST /v1/auth/register` (Mahasiswa and Dosen registration)
- `POST /v1/auth/login` (Mahasiswa or persisted Dosen account)
- `GET /v1/datasets/educational`
- `GET /v1/query-history`
- `DELETE /v1/query-history/{history_id}`
- `DELETE /v1/query-history`

Every protected route requires BFF HMAC headers. Direct browser calls are
rejected. This is a development bridge, not production authentication.

Passwords are PBKDF2-HMAC-SHA256 hashes, never plaintext. Both Mahasiswa and
Dosen roles are supported at registration. Production needs a reviewed
account-provisioning and authentication design.
