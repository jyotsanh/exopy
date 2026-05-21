from fastapi import APIRouter, Depends

from .chat_routes import chat_router
from .file_routes import file_router
from src.middlewares import verify_api_key

api_router = APIRouter()

# chat routes
api_router.include_router(chat_router, prefix="/chat", tags=["Chat API"])
# file routes — all endpoints require a valid API key in the `apikey` header
api_router.include_router(
    file_router,
    prefix="/file",
    tags=["VectorDB API"],
    dependencies=[Depends(verify_api_key)],
)

@api_router.get("/health")
def read_root():
    return {"message": "app is healthy!!!"}
