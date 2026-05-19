# Exopy

Exopy is a SaaS monorepo platform for deploying AI-powered chatbots, automation workflows, and CRM tools for organizations. It combines an AI agent service, a dashboard API, and a React frontend into a single deployable system.

---

## Repository Structure

```
exopy/
├── apps/
│   ├── ai_backend/          # FastAPI AI agent service (Python)
│   ├── dashboard_backend/   # Express.js dashboard API (TypeScript)
│   └── dashboard_frontend/  # React + Vite frontend (TypeScript)
├── docker-compose.yml       # Root compose file for all services
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

| Service | Container Name | Host Port | Container Port |
|---|---|---|---|
| Redis | `exopy-redis-service` | `6399` | `6379` |
| MongoDB | `exopy-mongo-service` | `27017` | `27017` |
| AI Backend | `exopy-agent-service` | `8015` | `8000` |
| Dashboard API | `agent-dashboard-backend` | `3000` | `3000` |
| Frontend | `agent-dashboard-frontend` | `9023` | `80` |

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

Each app has its own `.env.example` file. Copy and configure each:

```bash
cp apps/ai_backend/.env.example apps/ai_backend/.env.prod
cp apps/dashboard_backend/.env.example apps/dashboard_backend/.env
cp apps/dashboard_frontend/.env.example apps/dashboard_frontend/.env
```

---

## Running with Docker (Recommended)

The root `docker-compose.yml` orchestrates all services.

```bash
# Build and start all services
docker compose up -d --build

# Check running containers
docker ps

# View logs for a specific service
docker compose logs -f agent_ai_service
docker compose logs -f api
docker compose logs -f frontend
```

### Access Points

| Service | URL |
|---|---|
| AI Backend Swagger UI | http://localhost:8015/docs |
| Dashboard API | http://localhost:3000 |
| Frontend | http://localhost:9023 |

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
npm run dev             # start Vite dev server
```


---

## Project Status

1. **Project Inception** ← _we are here_
2. Requirements Gathering
3. Design Phase
4. Development
5. Testing
6. Deployment
7. Maintenance
