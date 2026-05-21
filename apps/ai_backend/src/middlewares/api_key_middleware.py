from fastapi import Header, HTTPException, status
from src.config import settings


async def verify_api_key(apikey: str = Header(default=None, alias="apikey")):
    if apikey != settings.EXOPY_DASHBOARD_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )
