# SQLens — Database Query Tutor

SQLens is a Next.js App Router frontend that helps students connect a SQL query with its result and the processing stages that produced it. When configured, the playground uses the real Next BFF → FastAPI → PostgreSQL path; it does not silently fall back to frontend simulation.

## Architecture

```text
Browser
  -> Next.js App Router
  -> /api/query-history and /api/query-executions BFF routes
  -> FastAPI (SQLens-backend)
  -> PostgreSQL / restricted SQL engine
```

- Server Components render routes and real query result/visualization data by default.
- Client components are limited to interactive leaves such as the SQL editor, selected visualization step, and query-history area.
- Zustand holds only `activeVisualizationStepId`.
- TanStack Query owns remote Query History state and talks only to Next BFF routes.
- Zod validates frontend input and external transport data. FastAPI responses are also parsed at the BFF boundary.

## Feature surface

- Mahasiswa: dashboard, SQL Playground, learning modules, AI Tutor, IoT monitoring, and Profile.
- Dosen/Asisten: role-aware dashboard, material/exercise draft management, student activity, student progress, IoT monitoring, and Profile.
- Lecturer and IoT pages use clearly labelled frontend demo fixtures until their BFF endpoints and live data sources are available; they do not claim live production data.

## Major routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/login`, `/register` | Public | Authentication entry points |
| `/dashboard` | Mahasiswa | Learning activity/progress dashboard |
| `/dashboard/playground` | Mahasiswa | BFF-backed SQL Playground |
| `/dashboard/learning` | Mahasiswa | Learning modules |
| `/dashboard/ai-tutor` | Mahasiswa | Server-side AI Tutor boundary |
| `/dashboard/profile` | Both | Session-backed profile display |
| `/dashboard/lecturer` | Dosen/Asisten | Lecturer dashboard |
| `/dashboard/lecturer/materials` | Dosen/Asisten | Material/exercise management UI |
| `/dashboard/lecturer/students` | Dosen/Asisten | Student activity monitoring UI |
| `/dashboard/lecturer/progress` | Dosen/Asisten | Student progress UI |
| `/dashboard/iot` | Both | IoT monitoring frontend boundary |

## Requirements

- Node.js 22 or later
- npm
- Optional for real integration: Python/FastAPI service in `../sqlens-backend` and PostgreSQL

## Local setup

```bash
cd SQLens-Final/sqlens-frontend
npm ci
copy .env.example .env.local
npm run dev
```

Set `SQLENS_FASTAPI_BASE_URL`, `SQLENS_BFF_SHARED_SECRET`, and `SQLENS_SESSION_SECRET` in `.env.local`, with matching backend values, to enable login, real playground execution, educational datasets, query history, and dashboard activity. `OPENROUTER_API_KEY` and `SQLENS_AI_MODEL` are server-only variables for the AI Tutor. Never use a `NEXT_PUBLIC_` prefix for backend URLs or secrets.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js development server. |
| `npm run typecheck` | Run strict TypeScript validation. |
| `npm run check` | Run Biome linting on application source. |
| `npm run format:check` | Check source formatting with Biome. |
| `npm run format` | Format source files with Biome. |
| `npm run test` | Run Vitest unit and component tests. |
| `npm run test:coverage` | Run tests and write coverage to `coverage/`. |
| `npm run build` | Create a production Next.js build. |

## Quality and deployment

- `biome.json` contains the current source lint configuration.
- `sonar-project.properties` points SonarQube at `app`, `components`, `lib`, `tests`, and `coverage/lcov.info`.
- `.github/workflows/ci.yml` runs type checking, Biome, coverage, production build, and an optional Sonar scan when repository secrets are configured.
- The app uses system font stacks, so build does not fetch Google Fonts at build time.
- The current configured Vitest coverage scope measured 95.50% statements, 83.16% branches, 98.21% functions, and 96.53% lines after Phase 10B. This is not a SonarQube project coverage result. Server-only BFF modules require separate Node/FastAPI integration coverage because Vitest's V8 remapper cannot parse them in this workspace.
- `npm run build` completed successfully on 18 September 2026. Windows may still log a non-fatal EPERM warning while updating the local `.next` prerender cache.

Before deployment (for example to Vercel), provide server-only values for the FastAPI BFF connection. A deployment URL, Core Web Vitals measurement, SonarQube Quality Gate result, and production backend availability are not included in this repository and must be verified in the target environment.

## Known limitations

- Backend educational stages are deterministic and limited to `SELECT`, `WHERE`, and basic `INNER JOIN` over the seeded `students`/`scores` dataset. Other valid SELECT statements receive a reduced truthful final-result stage.
- Public registration creates Mahasiswa accounts. Persisted Dosen accounts can authenticate but must be provisioned by a trusted backend operator until Phase 10B access workflows are designed.
- Runtime backend/PostgreSQL and OpenRouter verification depends on local environment configuration.
- SonarQube Quality Gate, Lighthouse/Core Web Vitals, GitHub Actions execution, and deployment URL require external evidence and are not claimed by this repository.
