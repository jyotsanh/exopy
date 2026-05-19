from src.schemas.vector_store_schema import VectorStoreType

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True, # ignore empty key
        extra="ignore" # ignores extra key if provided
    )
    # Production HOST & PORT
    PROD_HOST:str = "0.0.0.0"
    PROD_PORT:int = 8000

    # Development HOST & PORT
    DEV_HOST:str = "localhost"
    DEV_PORT:int = 8000

    # project-setting
    PROJECT_NAME:str="Agent-AI-Service"
    API_V1_STR:str = "/api/v1"

    # cors
    BACKEND_CORS_ORIGINS:list[str] = [
        "https://agent-dashboard-frontend-chi.vercel.app/",
        "http://localhost:8015",
        "http://localhost:8000"
    ]
    ALLOW_CREDENTIALS:bool = False
    API_LIMIT:int = 20
    API_WINDOW:int = 60

    # database
    MONGO_HOST:str = "localhost"
    MONGO_PORT:int = 27017
    MONGO_DB:str = "agent-ai-service"
    # Set default to None to easily detect if it's missing in .env
    MONGO_URI: str | None = None

    # openai
    OPENAI_API_KEY:str
    OPENAI_EMBEDDING_MODEL:str = "text-embedding-3-small"
    FALLBACK_OPENAI_API_KEY:str = "test"

    # Pinecone key
    PINECONE_API_KEY:str = "test-api-key"
    INDEX_NAME:str = "test-index"

    # active vector store.
    ACTIVE_VECTOR_STORE: VectorStoreType = VectorStoreType.PINECONE

    # chroma
    CHROMA_HOST:str = "localhost"
    CHROMA_PORT:int = 8000
    
    # aws S3 bucket:
    AWS_ACCESS_KEY_ID:str
    AWS_SECRET_ACCESS_KEY:str
    BUCKET_NAME:str = "exopy"

    # Dashboard api
    EXOPY_DASHBOARD_URL:str
    EXOPY_DASHBOARD_KEY:str = "1234" # TODO: implement proper dashboard key

    # Redis HOST & PORT
    REDIS_HOST:str = "localhost"
    REDIS_PORT:int = 6379
    REDIS_TTL:int = 60*60*8
    REDIS_PASSWORD: str | None = None
    REDIS_DB: int = 0

settings = Settings() # type: ignore
