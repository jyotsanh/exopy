import uvicorn

from src.config import settings
from loguru import logger

def dev():
    """
    running server in development mode
    """
    logger.info("running server **development** mode")
    uvicorn.run(
        "src.server:app",
        host=settings.DEV_HOST,
        port=settings.DEV_PORT,
        reload=True
    )


def server():
    """
    running server in production mode
    """
    logger.info("running server **production** mode")
    uvicorn.run(
        "src.server:app",
        host=settings.PROD_HOST,
        port=settings.PROD_PORT
    )

if __name__ == "__main__":
    dev()
