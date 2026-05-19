# third-party imports
from contextlib import asynccontextmanager
from httpx import ConnectError
from fastapi import FastAPI, Request
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from loguru import logger

# application
from src.config import settings
from src.core.vector_store import VectorStoreDispatcher
from src.middlewares import (
    RateLimiterMiddleware, 
    SecurityHeadersMiddleware,  
    ProcessTimeMiddleware
)
from src.services import AsyncRedisClient
from src.routers.api import api_router
from src.exceptions import AppBaseException
from src.exception_handlers import (
    api_exception_handler, 
    validation_exception_handler
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # TODO (jyotsanh): need to initilize the vector instance at start of the application.
    # TODO (jyotsanh): need to initilize the redis instance at start of the application.
    # TODO (jyotsanh): need to initilize the ChatOpenAI instance at start of the application.
    if settings.MONGO_URI: # check if mongo URI is given or not.
        # If URI exists in .env, use it
        mongo_connection_string = settings.MONGO_URI
        logger.info("Initializing MongoDB client using MONGO_URI from env...")
    else:
        # Fallback to local configuration
        mongo_connection_string = f"mongodb://{settings.MONGO_HOST}:{settings.MONGO_PORT}"
        logger.info(
            f"MONGO_URI missing. Initializing "
            f"Local MongoDB at {settings.MONGO_HOST}:{settings.MONGO_PORT}..."
        )

    try:
        app.state.client = AsyncIOMotorClient(
            mongo_connection_string,
            serverSelectionTimeoutMS=5000
        )
        result  = await app.state.client.admin.command("ping")
        logger.info(f"Ping successful! Result: {result}")
        logger.info("Mongo connection initialized")
    
    except ConnectionFailure as e:
        logger.error(f"Unable to connect to the server: \n{e}")
        raise RuntimeError(f"MongoDB Unable to Ping: {e}") from e
    except ServerSelectionTimeoutError as e:
        # 5. Log as ERROR and re-raise to stop app startup
        logger.error(f"CRITICAL: Unable to connect to MongoDB. App startup failed. Error: \n{e}")
        raise RuntimeError(f"MongoDB unavailable at startup: {e}") from e
    
    app.state.mongo_db = app.state.client[settings.MONGO_DB]
    
    try:
        # TODO (jyotsanh): make use of this state vector_store instance in file routes.
        app.state.vector_store =  await VectorStoreDispatcher.dispatch(settings.ACTIVE_VECTOR_STORE)
        logger.info(f"active vector_store `{settings.ACTIVE_VECTOR_STORE}` successfull")
    # TODO: make a class that inherits from all exception for all kinds of vector store.
    except Exception as c_error:
        logger.error(f"vectors store: {settings.ACTIVE_VECTOR_STORE} connection error:\nreason {c_error}")
    
    try:
        
        rclient = AsyncRedisClient(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
        )
        if not await rclient.ping(): # check redis connection
            logger.error(
                "failed connecting redis:"
                f"host:{settings.REDIS_HOST}"
                f"port:{settings.REDIS_PORT}"
            )
            raise RuntimeError("failed redis ping")
        else:
            logger.info("redis connection successfull.")
            app.state.redis_client = rclient  # AsyncRedisClient instance
    
    except ConnectionError as r_error:
        logger.error(f"redis connection error: {r_error}")
        logger.error(
                "failed connecting redis -> "
                f"host:{settings.REDIS_HOST} "
                f"port:{settings.REDIS_PORT}"
            )
        raise RuntimeError("redis connection error")

    yield
    
    logger.info("Closing MongoDB connection...")
    app.state.client.close()
    logger.info("MongoDB connection closed.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Middleware layers
## Layer 1: cors middleware
app.add_middleware(
    CORSMiddleware,
    # TODO, implement BACKEND_CORS_ORIGINS list based on server start mode.
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    # TODO: important implement 'True' for cors origins.
    allow_credentials=settings.ALLOW_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Layer 2: Rate limit middleware (50 sec , 20 request)
app.add_middleware(
    RateLimiterMiddleware,
    limit=settings.API_LIMIT, 
    window=settings.API_WINDOW
)

## Layer 3: add security header middleware
app.add_middleware(SecurityHeadersMiddleware)

## Layer 4: middleware for tracking response time.
app.add_middleware(ProcessTimeMiddleware)

## Exception handlers
app.add_exception_handler(AppBaseException, api_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

app.include_router(api_router, prefix=settings.API_V1_STR)
