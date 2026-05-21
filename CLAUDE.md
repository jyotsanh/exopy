# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Overview

Exopy is a SaaS platform with three apps under `apps/`:

| App | Tech | Purpose |
|---|---|---|
| `ai_backend` | FastAPI + Python 3.12 | RAG pipeline, file ingestion, vector search, chat |
| `dashboard_backend` | Express 5 + TypeScript | REST API, auth, org management |
| `dashboard_frontend` | React 19 + Vite + TypeScript | Admin dashboard SPA |

Services run on: AI backend `:8015`, Dashboard API `:3000`, Frontend `:9023`, MongoDB `:27017`, Redis `:6399→6379`.

---

## Commands

### AI Backend (`apps/ai_backend`)
```bash
uv sync                    # install dependencies
uv run dev                 # dev server on localhost:8000
uv run server              # prod server on 0.0.0.0:8000
uv run ruff check .        # lint
uv run ruff format .       # format
uv run ty check            # type check
uv run pytest              # run all tests
uv run pytest tests/path/test_file.py::test_name  # single test
```

### Dashboard Backend (`apps/dashboard_backend`)
```bash
npm install
npm run dev                # start with tsx hot reload
npm run build              # compile TypeScript → build/
npm start                  # run compiled build
```
No test runner is configured yet (script exits 1).

### Dashboard Frontend (`apps/dashboard_frontend`)
```bash
npm install
npm run dev                # Vite dev server
npm run build              # tsc + vite build
npm run lint               # eslint
npm run preview            # preview production build
```

### Full Stack (Docker)
```bash
docker compose up -d --build   # start all services
docker compose logs -f agent_ai_service
docker compose logs -f api
docker compose logs -f frontend
```

### Environment Setup
```bash
cp apps/ai_backend/.env.example apps/ai_backend/.env
cp apps/dashboard_backend/.env.example apps/dashboard_backend/.env
cp apps/dashboard_frontend/.env.example apps/dashboard_frontend/.env
```

---

## Architecture

### AI Backend (`apps/ai_backend/src/`)

**Entry point**: `server.py` — creates the FastAPI app, registers middleware layers (CORS → rate limiter → security headers → process time), wires exception handlers, and manages lifespan (MongoDB, vector store, Redis initialized on startup).

**Router tree**: `routers/api.py` mounts `/chat` and `/file` under `API_V1_STR` (`/api/v1`).

**Ingestion pipeline** (`services/ingestion/file_service.py`): each uploaded file goes through Clean → Chunk → Embed+Upsert → Cloud Upload. Each step is dispatched by file category (text/PDF/CSV) through dispatcher classes in `core/preprocessing/`. PDF and CSV handlers are stubbed — only text is fully implemented.

**Dispatcher pattern**: `core/vector_store/dispatcher.py`, `core/cloud/dispatcher.py`, and `core/preprocessing/dispatchers.py` all follow the same pattern — a `dispatch(type)` factory method returns a concrete implementation of an abstract base class. This is the extension point for adding new vector stores, cloud providers, or file type handlers.

**Active backends**: Pinecone (primary vector store) + AWS S3 (cloud storage). Qdrant/Milvus/Chroma and GCP are implemented but excluded from the current roadmap.

**Config**: `config/config.py` uses `pydantic-settings`. `OPENAI_API_KEY`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `EXOPY_DASHBOARD_URL` are required. `ACTIVE_VECTOR_STORE` defaults to Pinecone.

**Known TODOs in code**:
- `routers/api.py`: API key guard not implemented — file routes are unauthenticated
- `config/config.py:64`: `EXOPY_DASHBOARD_KEY` is hardcoded `"1234"`
- `services/ingestion/file_service.py`: S3 upload is mocked
- `routers/chat_routes.py`: chat endpoint returns 501

### Dashboard Backend (`apps/dashboard_backend/src/`)

**App class** (`app.ts`): Express app wired with cors, cookie-parser, passport, morgan, Prometheus metrics, routes, and global error handler.

**Route structure**: all routes mount under `/api` → `routes/index.route.ts`. Currently only `/auth` and `/organizations` are mounted. New resources (region, branch, user, files) need to be added to this index.

**Auth module** (`modules/auth/`): Full module with its own routes/controllers/services/repository/interfaces — use this as the template for new feature modules. Auth uses JWT (access token in `Authorization: Bearer`, refresh token in HTTP-only cookie). Google OAuth via Passport but new-user creation path is not implemented.

**Standard feature pattern** (use `organization` as template):
- `models/` — Mongoose schema
- `services/` — static class with create/getAll/getById/update/delete; all queries filter `is_deleted: false`
- `controllers/` — thin wrappers calling service, wrapped with `catchAsync`
- `validators/` — Zod schemas
- `routes/` — apply `authMiddleware()` then `authorization([Role.X])` then `validateRequest(schema)` before controller

**Soft-delete pattern**: all models use `is_deleted: boolean` field. Uniqueness is enforced by checking `is_deleted: false` in service layer, not by DB-level unique indexes on fields like email.

**Roles** (`constants/enum.ts`): `SUPERADMIN`, `ADMIN`, `USER`.

### Dashboard Frontend (`apps/dashboard_frontend/src/`)

**Routing** (`router/index.tsx`): React Router v7 with `useRoutes`. Protected routes wrap with `<PrivateRoute>` (checks Redux auth state). `<AlreadyAuthenticateRoute>` redirects logged-in users away from `/login`. `<RoleRoute>` exists but is not yet wired.

**Redux store** (`store/store.ts`): `auth` slice is persisted to localStorage (whitelist: `accessToken`, `user`, `isAuthenticated`). `organization` slice is not persisted. New slices are added to `combineReducers` here.

**Feature module pattern** (use `features/organization/` as template):
- `components/` — table, toolbar, sheet (create/edit form), pagination, row
- `hooks/` — data fetching and mutation logic
- `schemas/` — Zod validation for forms
- `types/` — TypeScript interfaces
- `constants/` — column definitions, etc.

**Path constants**: all route strings are defined in `utils/path.ts` — always add new routes there and reference `paths.*` instead of string literals.

**Axios**: configured in `api/axiosInstance.ts` — use this instance for all API calls; it handles base URL and auth headers.

**UI components**: Shadcn/UI components live in `components/ui/`. Add new ones with the Shadcn CLI rather than hand-writing them.

**Known issues**:
- `utils/path.ts` defines `/auth/login` but router mounts at `/login` — inconsistency
- Dashboard data (`data/dashboard.data.ts`) is static fixture data, not API-driven
- Several sidebar nav links lead to 404 (routes not implemented yet)
