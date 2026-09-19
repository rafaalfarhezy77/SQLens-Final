# SQLens Final

SQLens Final contains two independently runnable services:

```text
SQLens-Final/
  sqlens-frontend/  Next.js frontend and BFF
  sqlens-backend/   FastAPI backend
```

PostgreSQL remains an external dependency. The frontend calls the backend through
its server-side BFF, so browsers never call FastAPI directly.

## Local setup

1. Configure and start PostgreSQL.
2. In `sqlens-backend`, copy `.env.example` to `.env`. Set `DATABASE_URL` and a
   long `BFF_SHARED_SECRET`, then bootstrap and run FastAPI:

   ```powershell
   python -m app.db.bootstrap
   uvicorn app.main:app --reload --port 8000
   ```

3. In `sqlens-frontend`, copy `.env.example` to `.env.local` when it does not
   already exist. Set `SQLENS_FASTAPI_BASE_URL=http://localhost:8000`, and set
   `SQLENS_BFF_SHARED_SECRET` to the exact same value as the backend's
   `BFF_SHARED_SECRET`. Set a separate `SQLENS_SESSION_SECRET`.
4. Start the frontend:

   ```powershell
   npm ci
   npm run dev
   ```

Login, registration, query history, real SQL execution, and backend-driven
dashboard activity need both FastAPI and PostgreSQL to be running.

## Checks

Run these in `sqlens-frontend`:

```powershell
npm run typecheck
npm run check
npm test
```

`sqlens-frontend/.env.local` and `sqlens-backend/.env` contain secrets and are
ignored by Git. Do not commit them.
