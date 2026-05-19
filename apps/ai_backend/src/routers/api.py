from fastapi import APIRouter

from .chat_routes import chat_router
from .file_routes import file_router

api_router = APIRouter()

# chat routes
api_router.include_router(chat_router, prefix="/chat", tags=["Chat API"])
# file routes
# TODO:
# - organization_id, uploaded_by, etc. are open query parameters
# -  Any caller can read or overwrite any tenant's knowledge base
# - implement an API key guard.
api_router.include_router(file_router, prefix="/file", tags=["VectorDB API"])

@api_router.get("/health")
def read_root():
    return {"message": "app is healthy!!!"}
