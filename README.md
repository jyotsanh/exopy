# Exopy

Exopy is a SaaS monorepo platform an AI-agents Orchestrator, automation workflows, and CRM tools for users. It combines an AI agent Orchestrator, a dashboard API, and a React frontend into a single deployable system.

---

## Repository Structure

```
exopy/
├── apps/
│   ├── ai_backend/          # FastAPI AI agent service (Python)
│   ├── dashboard_backend/   # Express.js dashboard API (TypeScript)
│   └── dashboard_frontend/  # React + Vite frontend (TypeScript)
├── docker-compose.yml       # Production compose (compiled builds, nginx)
├── docker-compose.dev.yml   # Development compose (hot reload, Vite HMR)
└── README.md
```

---

## Technology Stack

### AI Backend (`apps/ai_backend`)
| Layer | Technology |
|---|---|
| Framework | FastAPI |
| AI / LLM | LangChain, LangChain-OpenAI |
| Vector Stores | Pinecone, Qdrant, Milvus, Chroma |
| Cloud Storage | AWS S3, Google Cloud Storage |
| Database | MongoDB (Motor async driver) |
| Cache / Queue | Redis |
| Runtime | Python 3.12+, uv, Uvicorn |
| Linting / Types | Ruff, Ty |

### Dashboard Backend (`apps/dashboard_backend`)
| Layer | Technology |
|---|---|
| Framework | Express 5 |
| Database | MongoDB (Mongoose) |
| Auth | Passport.js, JWT, Google OAuth 2.0 |
| Validation | Zod |
| Real-time | Socket.IO |
| Runtime | Node.js, TypeScript, tsx |

### Dashboard Frontend (`apps/dashboard_frontend`)
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4, Radix UI, Shadcn/UI |
| State | Redux Toolkit, Redux Persist |
| Routing | React Router v7 |
| Forms | React Hook Form + Zod |
| HTTP | Axios |

---

## Services & Ports

### Development (`docker-compose.dev.yml`)

| Service | Container Name | Host Port | Container Port |
|---|---|---|---|
| Redis | `exopy-redis-service` | `6399` | `6379` |
| MongoDB | `exopy-mongo-service` | `27017` | `27017` |
| AI Backend | `exopy-agent-dev` | `8015` | `8000` |
| Dashboard API | `exopy-dashboard-backend-dev` | `3000` | `3000` |
| Frontend (Vite) | `exopy-frontend-dev` | `5173` | `5173` |

### Production (`docker-compose.yml`)

| Service | Container Name | Host Port | Container Port |
|---|---|---|---|
| Redis | `exopy-redis-service` | `6399` | `6379` |
| MongoDB | `exopy-mongo-service` | `27017` | `27017` |
| AI Backend | `exopy-agent-service` | `8015` | `8000` |
| Dashboard API | `exopy-dashboard-backend` | `3000` | `3000` |
| Frontend (nginx) | `exopy-dashboard-frontend` | `9023` | `80` |

---

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) 20+ (for local frontend/backend development)
- [Python](https://www.python.org/) 3.12+ and [uv](https://github.com/astral-sh/uv) (for local AI backend development)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Team-Exopy/exopy.git
cd exopy
```

### 2. Set up environment variables

**For development** — copy each example to `.env`:

```bash
cp apps/ai_backend/.env.example       apps/ai_backend/.env
cp apps/dashboard_backend/.env.example apps/dashboard_backend/.env
cp apps/dashboard_frontend/.env.example apps/dashboard_frontend/.env
```

**For production** — copy each example to `.env.prod`:

```bash
cp apps/ai_backend/.env.example       apps/ai_backend/.env.prod
cp apps/dashboard_backend/.env.example apps/dashboard_backend/.env.prod
cp apps/dashboard_frontend/.env.example apps/dashboard_frontend/.env.prod
```

Fill in secrets (API keys, MongoDB URI, JWT secrets, etc.) in the copied files before starting.

---

## Running with Docker

### Development mode (hot reload)

Uses `docker-compose.dev.yml`. Source code is volume-mounted so changes reflect instantly without rebuilding.

```bash
docker compose -f docker-compose.dev.yml up --build
```

The dashboard backend overrides `MONGO_URI` to point at the local Docker MongoDB (`exopy-mongo-service`) automatically — no manual change needed.

**Access points:**

| Service | URL |
|---|---|
| AI Backend Swagger UI | http://localhost:8015/docs |
| Dashboard API | http://localhost:3000 |
| Frontend (Vite HMR) | http://localhost:5173 |

**Useful commands:**

```bash
# Tail logs for a specific service
docker compose -f docker-compose.dev.yml logs -f agent_ai_service
docker compose -f docker-compose.dev.yml logs -f dashboard_backend
docker compose -f docker-compose.dev.yml logs -f dashboard_frontend

# Stop all services
docker compose -f docker-compose.dev.yml down
```

### Production mode

Uses `docker-compose.yml`. Builds compiled production images — TypeScript compiled to JS, Vite bundle served via nginx.

```bash
docker compose up --build -d
```

**Access points:**

| Service | URL |
|---|---|
| AI Backend Swagger UI | http://localhost:8015/docs |
| Dashboard API | http://localhost:3000 |
| Frontend (nginx) | http://localhost:9023 |

**Useful commands:**

```bash
# Tail logs for a specific service
docker compose logs -f agent_ai_service
docker compose logs -f dashboard-backend
docker compose logs -f dashboard-frontend

# Stop all services
docker compose down
```

---

## Running Locally (Per App)

### AI Backend

```bash
cd apps/ai_backend
uv sync                 # install dependencies
uv run dev              # start on localhost:8000
# or
uv run server           # start on 0.0.0.0:8000
```

### Dashboard Backend

```bash
cd apps/dashboard_backend
npm install
npm run dev             # start with hot reload via tsx
```

### Dashboard Frontend

```bash
cd apps/dashboard_frontend
npm install
npm run dev             # start Vite dev server on localhost:5173
```

---

## Project Status

1. **Project Inception**
2. Requirements Gathering
3. Design Phase
4. **Development** ← _we are here_
5. Testing
6. Deployment
7. Maintenance
