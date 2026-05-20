# Plan: Exopy 8-Week Feature Completion Roadmap

**TL;DR**: Complete all discovered gaps across the 3 Exopy sub-applications (ai_backend, dashboard_backend, dashboard_frontend) over 8 weeks, ordered so each week's output unblocks the next. Solo developer, so no parallelism across apps — each week focuses on full vertical slices (backend + frontend together).

---

## Week 1: Security Hardening & Foundation Fixes

Foundation work that every subsequent feature depends on.

**Steps**

1. **Fix soft-delete uniqueness conflicts** — Remove field-level `unique` on `email`/`username` in User and Organization models; rely solely on compound indexes `(field, is_deleted)`.
   - `apps/dashboard_backend/src/models/user.model.ts`
   - `apps/dashboard_backend/src/models/organization.model.ts`

2. **Enforce role-based authorization on Organization routes** — Uncomment and configure `authorization([SUPERADMIN])` or appropriate roles on org CRUD routes.
   - `apps/dashboard_backend/src/routes/organization.route.ts`

3. **Implement API key authentication for ai_backend file routes** — Add an API key guard middleware (the TODO at `apps/ai_backend/src/routers/api.py#L11`). The key should be validated against the dashboard backend's per-org bot config.
   - `apps/ai_backend/src/routers/api.py`
   - New middleware file in `apps/ai_backend/src/middlewares/`

4. **Fix Google OAuth to auto-create new users** — Currently the passport strategy returns `false` for unknown users. Add user creation path for new Google sign-ins.
   - `apps/dashboard_backend/src/config/passport.ts`
   - `apps/dashboard_backend/src/modules/auth/repositories/auth.repository.ts`

5. **Remove hardcoded default dashboard key** — Address the TODO at `apps/ai_backend/src/config/config.py#L64`.
   - `apps/ai_backend/src/config/config.py`

6. **Fix login path inconsistency** — Frontend `utils/path.ts` defines `/auth/login` but router uses `/login`.
   - `apps/dashboard_frontend/src/utils/path.ts` or `apps/dashboard_frontend/src/router/index.tsx`

7. **Wire "Remember Me" checkbox behavior** — Make it affect token persistence strategy (session vs localStorage).
   - `apps/dashboard_frontend/src/features/auth/components/RememberMeSection.tsx`
   - `apps/dashboard_frontend/src/store/slice/authSlice/authSlice.ts`

**Verification**
- All existing auth tests pass (if any); manually test login/register/OAuth flows
- Verify soft-deleted org/user can be re-created with same email
- Verify unauthorized users get 403 on org routes
- Verify ai_backend rejects requests without valid API key

---

## Week 2: Region & Branch CRUD (Full Stack)

Models exist in dashboard_backend but have zero routes/controllers/services. Frontend has no UI.

**Steps**

1. **Create Region service** — Following the pattern in `organization.service.ts`: create, getAll (with pagination/search), getById, update, soft-delete. Region is scoped to an Organization (`org_id`).
   - New: `apps/dashboard_backend/src/services/region.service.ts`

2. **Create Region controller** — Following `organization.controller.ts` pattern.
   - New: `apps/dashboard_backend/src/controllers/region.controller.ts`

3. **Create Region validators** — Following `organization.validator.ts` pattern.
   - New: `apps/dashboard_backend/src/validators/region.validator.ts`

4. **Create Region routes** — CRUD at `/api/organizations/:orgId/regions`. Auth + role middleware.
   - New: `apps/dashboard_backend/src/routes/region.route.ts`
   - Update: `apps/dashboard_backend/src/routes/index.route.ts`

5. **Repeat steps 1-4 for Branch** — Branch is scoped to a Region (`reg_id`). Routes: `/api/organizations/:orgId/regions/:regionId/branches`.
   - New: `apps/dashboard_backend/src/services/branch.service.ts`
   - New: `apps/dashboard_backend/src/controllers/branch.controller.ts`
   - New: `apps/dashboard_backend/src/validators/branch.validator.ts`
   - New: `apps/dashboard_backend/src/routes/branch.route.ts`

6. **Create Region management UI** — Feature module with table/toolbar/create-sheet, following `features/organization/` as template.
   - New: `apps/dashboard_frontend/src/features/region/`
   - New page + route at `/organization/:orgId/regions`

7. **Create Branch management UI** — Same pattern.
   - New: `apps/dashboard_frontend/src/features/branch/`
   - New page + route at `/organization/:orgId/regions/:regionId/branches`

8. **Wire Organization "Open" button** to navigate to the org's region list.
   - `apps/dashboard_frontend/src/features/organization/components/OrganizationTableRow.tsx`

9. **Add Redux slices** for region and branch state.
   - New: `apps/dashboard_frontend/src/store/slice/region/`
   - New: `apps/dashboard_frontend/src/store/slice/branch/`
   - Update: `apps/dashboard_frontend/src/store/store.ts`

**Verification**
- CRUD operations for Region and Branch work end-to-end (API + UI)
- Proper scoping: regions belong to org, branches belong to region
- Pagination and search work
- Soft-delete works correctly

---

## Week 3: User Management (Full Stack)

User model exists with auth, but there's no admin UI for managing users.

**Steps**

1. **Create User service** — admin-level user CRUD: list users (paginated), getById, update role, soft-delete, reset password.
   - New: `apps/dashboard_backend/src/services/user.service.ts`

2. **Create User controller** — With proper superadmin/admin role enforcement.
   - New: `apps/dashboard_backend/src/controllers/user.controller.ts`

3. **Create User validators** — Update user, change role, pagination/search.
   - New: `apps/dashboard_backend/src/validators/user.validator.ts`

4. **Create User routes** — `/api/users` with admin-only access.
   - New: `apps/dashboard_backend/src/routes/user.route.ts`
   - Update: `apps/dashboard_backend/src/routes/index.route.ts`

5. **Implement forgot password flow** — Backend endpoint for password reset request + token + reset.
   - New endpoint in auth routes: `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`
   - Update: `apps/dashboard_backend/src/modules/auth/`

6. **Create User management UI** — Admin page with user table, role assignment, delete.
   - New: `apps/dashboard_frontend/src/features/users/`
   - New page + route at `/users`
   - New Redux slice: `apps/dashboard_frontend/src/store/slice/user/`

7. **Wire forgot password link** — Replace placeholder href in `RememberMeSection.tsx` with actual forgot-password page/modal.
   - `apps/dashboard_frontend/src/features/auth/components/RememberMeSection.tsx`
   - New: forgot password page or modal component

8. **Activate RoleRoute** — Wire the existing `RoleRoute` component for admin-only pages.
   - `apps/dashboard_frontend/src/router/index.tsx`
   - `apps/dashboard_frontend/src/router/RoleRoute.tsx`

9. **Fix sidebar navigation** — Remove or properly mount routes for all sidebar links that currently 404.
   - `apps/dashboard_frontend/src/hooks/useNavigation.ts`
   - `apps/dashboard_frontend/src/router/index.tsx`

**Verification**
- Admin can list, view, edit roles, and soft-delete users
- Non-admin users cannot access user management endpoints or UI
- Forgot password flow works end-to-end (email sending can be mocked initially)
- RoleRoute properly gates admin pages
- No sidebar links lead to 404

---

## Week 4: File Ingestion Completion (AI Backend)

Complete the partially-implemented ingestion pipeline.

**Steps**

1. **Implement PDF cleaning handler** — Extract text from PDF files using a library (e.g., `pymupdf` or `pdfplumber`). Add dependency to `pyproject.toml`.
   - `apps/ai_backend/src/core/preprocessing/cleaning_data_handlers.py`
   - `apps/ai_backend/pyproject.toml`

2. **Implement PDF chunking handler** — Chunk extracted PDF text (can reuse text chunking logic with page-boundary awareness).
   - `apps/ai_backend/src/core/preprocessing/chunking_data_handlers.py`

3. **Implement PDF embedding handler** — Feed PDF chunks through the same embedding pipeline as text.
   - `apps/ai_backend/src/core/preprocessing/embedding_data_handlers.py`

4. **Implement CSV cleaning handler** — Parse CSV, optionally stringify rows or extract column-based documents.
   - `apps/ai_backend/src/core/preprocessing/cleaning_data_handlers.py`

5. **Implement CSV chunking and embedding** — Similar pattern to PDF.
   - `apps/ai_backend/src/core/preprocessing/chunking_data_handlers.py`
   - `apps/ai_backend/src/core/preprocessing/embedding_data_handlers.py`

6. **Implement real S3 upload** — Replace the mock in `s3.py` with actual boto3 `put_object`/`upload_fileobj`. Fix the file pointer issue (TODO in cleaning handler).
   - `apps/ai_backend/src/core/cloud/s3.py`
   - `apps/ai_backend/src/core/preprocessing/cleaning_data_handlers.py`

7. **Fix `create_vector_store_index` dummy org_id** — Wire real organization_id from request context.
   - `apps/ai_backend/src/routers/file_routes.py` (around line 98)

8. **Add missing Chroma dependencies to pyproject.toml** — `chromadb`, `openai`, `uuid6` if Chroma remains in scope.
   - `apps/ai_backend/pyproject.toml`

**Verification**
- Upload a PDF file → verify text extracted, chunked, embedded in Pinecone, uploaded to S3
- Upload a CSV file → same verification
- Upload a text file → same verification (regression)
- Verify S3 URLs in MongoDB metadata are real, accessible URLs
- Verify file pointer is properly handled (no empty uploads)

---

## Week 5: File Management UI (Frontend)

Build the frontend for file upload, listing, and management.

**Steps**

1. **Create File management backend endpoints** in dashboard_backend — The `file.model.ts` exists but has no routes/controllers/services.
   - New: `apps/dashboard_backend/src/services/file.service.ts`
   - New: `apps/dashboard_backend/src/controllers/file.controller.ts`
   - New: `apps/dashboard_backend/src/routes/file.route.ts`
   - New: `apps/dashboard_backend/src/validators/file.validator.ts`
   - Update: `apps/dashboard_backend/src/routes/index.route.ts`

2. **Create File management page** — Table listing files with status, upload date, type, size. Actions: upload, delete, re-process.
   - New: `apps/dashboard_frontend/src/features/files/`
   - New: `apps/dashboard_frontend/src/pages/files/`
   - New route at `/files`

3. **Build file upload component** — Multi-file upload with drag-and-drop, progress indication. Calls the ai_backend ingestion endpoint.
   - New component in `apps/dashboard_frontend/src/features/files/components/`

4. **Create File Redux slice** — State for file list, upload progress, selected files.
   - New: `apps/dashboard_frontend/src/store/slice/file/`
   - Update: `apps/dashboard_frontend/src/store/store.ts`

5. **Wire semantic search UI** — Basic search interface that queries `GET /api/v1/file/vectordb/similarity/search` on ai_backend.
   - New component in `apps/dashboard_frontend/src/features/files/components/`

**Verification**
- Upload files through the UI → files appear in the list with correct metadata
- Delete file from UI → soft-deleted in both MongoDB and vector store
- Re-process file from UI → old vectors deleted, new vectors created
- Semantic search returns relevant results from uploaded files

---

## Week 6: Chat / AI Features (Full Stack)

Implement the RAG-powered chat endpoint and frontend chat UI.

**Steps**

1. **Implement chat service** — RAG pipeline: receive query → semantic search on vector store → construct prompt with context → call LLM → return response.
   - New: `apps/ai_backend/src/services/chat/chat_service.py`
   - Uses: `apps/ai_backend/src/core/vector_store/` for retrieval
   - Uses: LangChain/OpenAI for LLM call

2. **Replace the 501 stub in chat route** — Wire the chat service to `POST /api/v1/chat/chat`.
   - `apps/ai_backend/src/routers/chat_routes.py`

3. **Add streaming support** — Use FastAPI `StreamingResponse` for token-by-token chat output.
   - `apps/ai_backend/src/routers/chat_routes.py`

4. **Add chat history support** — Store chat history in MongoDB, support conversation context.
   - New: `apps/ai_backend/src/services/chat/chat_history.py`
   - `apps/ai_backend/src/utils/mongo_utils.py`

5. **Build chat frontend UI** — Conversational interface with message bubbles, input box, streaming display.
   - New: `apps/dashboard_frontend/src/features/chat/`
   - New: `apps/dashboard_frontend/src/pages/chat/`
   - New route at `/chat`

6. **Create Chat Redux slice** — Conversations list, active conversation, messages.
   - New: `apps/dashboard_frontend/src/store/slice/chat/`
   - Update: `apps/dashboard_frontend/src/store/store.ts`

7. **Wire sidebar "Chats" navigation** — Point to the new chat page.
   - `apps/dashboard_frontend/src/hooks/useNavigation.ts`

**Verification**
- Send a chat message → get an AI response grounded in uploaded document content
- Streaming tokens appear progressively in the UI
- Chat history persists across page reloads
- New conversation can be started, old ones reviewed

---

## Week 7: Dashboard Analytics (Full Stack)

Replace static dashboard data with real metrics.

**Steps**

1. **Create analytics endpoints in dashboard_backend** — Aggregate stats: total orgs, total users, total files, total regions/branches, recent activity.
   - New: `apps/dashboard_backend/src/services/analytics.service.ts`
   - New: `apps/dashboard_backend/src/controllers/analytics.controller.ts`
   - New: `apps/dashboard_backend/src/routes/analytics.route.ts`
   - Update: `apps/dashboard_backend/src/routes/index.route.ts`

2. **Create ai_backend analytics endpoint** — Stats: total vectors, total ingested files, chat usage counts, query latency metrics.
   - New endpoint in `apps/ai_backend/src/routers/api.py` or new analytics router

3. **Replace static dashboard data** — Swap fixture data in `dashboard.data.ts` with API-driven data. Wire dashboard action handlers (currently console.log placeholders).
   - `apps/dashboard_frontend/src/data/dashboard.data.ts`
   - `apps/dashboard_frontend/src/pages/dashboard/Dashboard.tsx`

4. **Create Dashboard Redux slice** — Fetch and cache analytics data.
   - New: `apps/dashboard_frontend/src/store/slice/dashboard/`
   - Update: `apps/dashboard_frontend/src/store/store.ts`

5. **Enhance dashboard cards** — Show real KPIs with trends, clickable to navigate to detail pages.
   - `apps/dashboard_frontend/src/components/dashboard/cards/`

6. **Add recent activity feed** — Show recent file uploads, chat queries, user sign-ups.
   - New component in `apps/dashboard_frontend/src/components/dashboard/`

**Verification**
- Dashboard loads with real counts matching database records
- Creating/deleting entities updates dashboard counts on refresh
- Dashboard cards navigate to their respective pages
- Activity feed shows chronologically correct recent actions

---

## Week 8: Real-Time Features & Polish

Socket.IO integration and final polish.

**Steps**

1. **Set up Socket.IO server** in dashboard_backend — `socket.io` is already a dependency. Initialize with the Express server.
   - `apps/dashboard_backend/src/index.ts`
   - New: `apps/dashboard_backend/src/config/socket.ts`

2. **Emit real-time events** — On org/region/branch/user create/delete, emit events to connected clients.
   - Update services to emit after DB operations
   - New: `apps/dashboard_backend/src/services/socket.service.ts`

3. **Emit file processing events from ai_backend** — Notify dashboard when ingestion completes/fails. Options: (a) ai_backend calls a dashboard webhook, or (b) ai_backend pushes to Redis pub/sub and dashboard_backend subscribes.
   - `apps/ai_backend/src/services/ingestion/file_service.py`
   - `apps/dashboard_backend/src/config/socket.ts`

4. **Integrate Socket.IO client in frontend** — Listen for real-time events, update Redux store.
   - New: `apps/dashboard_frontend/src/services/socket.ts`
   - Update relevant slices to handle socket events

5. **Add real-time notifications UI** — Toast/notification system for events (file processed, new user, etc.).
   - New: `apps/dashboard_frontend/src/components/notifications/`

6. **Final polish** — Clean up debug logs in authorization middleware, remove unused imports, fix duplicate type declarations.
   - `apps/dashboard_backend/src/middlewares/auth/authorization.middleware.ts`
   - `apps/dashboard_backend/src/routes/index.route.ts`
   - `apps/dashboard_backend/src/types/organization/`
   - `apps/dashboard_backend/src/modules/auth/types/`

7. **Add `GET /api/auth/me` consumption** — Dashboard currently logs `auth/me` as a test side effect; wire it into the auth flow for session revalidation on app load.
   - `apps/dashboard_frontend/src/store/slice/authSlice/authSlice.ts`

**Verification**
- Create an org in one browser tab → another tab sees it appear in real-time
- Upload a file → real-time notification when processing completes
- Socket connection re-establishes after network interruption
- No console warnings/errors in production build
- All routes accessible, no 404s from sidebar navigation

---

## Key Files Reference

### AI Backend (Python/FastAPI)
- `apps/ai_backend/src/server.py` — App bootstrap, lifespan, middleware
- `apps/ai_backend/src/routers/chat_routes.py` — Chat endpoint (currently 501)
- `apps/ai_backend/src/routers/file_routes.py` — File ingestion endpoints
- `apps/ai_backend/src/services/ingestion/file_service.py` — Ingestion pipeline
- `apps/ai_backend/src/core/preprocessing/` — Clean/chunk/embed handlers (PDF/CSV stubbed)
- `apps/ai_backend/src/core/cloud/s3.py` — S3 upload (mocked)
- `apps/ai_backend/src/core/vector_store/pinecone.py` — Primary vector store impl
- `apps/ai_backend/src/config/config.py` — Settings with hardcoded default key

### Dashboard Backend (TypeScript/Express)
- `apps/dashboard_backend/src/models/` — All Mongoose models (org, region, branch, user, file, refreshToken)
- `apps/dashboard_backend/src/routes/index.route.ts` — Route mounting
- `apps/dashboard_backend/src/services/organization.service.ts` — Service pattern template
- `apps/dashboard_backend/src/modules/auth/` — Full auth module (template for new modules)
- `apps/dashboard_backend/src/config/passport.ts` — Google OAuth strategy

### Dashboard Frontend (React/TypeScript)
- `apps/dashboard_frontend/src/router/index.tsx` — Route definitions
- `apps/dashboard_frontend/src/store/store.ts` — Redux store config
- `apps/dashboard_frontend/src/features/organization/` — Feature module template
- `apps/dashboard_frontend/src/hooks/useNavigation.ts` — Sidebar nav config
- `apps/dashboard_frontend/src/data/dashboard.data.ts` — Static fixture data to replace

---

## Decisions
- **Solo developer** — each week is a full vertical slice (backend + frontend) to keep context tight
- **Dependency ordering** — Security (W1) → Entity CRUD (W2-3) → Ingestion (W4) → UI (W5) → Chat (W6) → Analytics (W7) → Real-time (W8)
- **Chroma/Milvus/Qdrant/GCP** — Explicitly excluded from this plan; Pinecone + S3 are the primary backends
- **Email sending** — Forgot password flow can use a mock/console logger initially; real email (SendGrid/SES) is out of scope
- **Testing** — Not a dedicated week, but each week's verification section includes manual and basic automated checks
