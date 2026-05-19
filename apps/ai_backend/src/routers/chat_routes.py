
from fastapi import APIRouter, HTTPException, status
from loguru import logger

from src.schemas.request_schema import ChatRequest
from src.schemas.response_schema import ChatResponse

chat_router = APIRouter()


@chat_router.post("/chat", response_model=ChatResponse)
async def chat(
    request_data: ChatRequest,
):
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Not Implemented"
    )

