from functools import lru_cache
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Central application configuration.
    Values are loaded from environment variables and .env file.
    """

    # Application
    APP_NAME: str = "Smart PDF Chat"
    APP_ENV: str = "development"

    HOST: str = "0.0.0.0"
    PORT: int = 8000

    API_PREFIX: str = "/api/v1"

    LOG_LEVEL: str = "INFO"


    # Ollama Configuration

    OLLAMA_BASE_URL: str = "http://localhost:11434"

    OLLAMA_CHAT_MODEL: str = "qwen3.5:4b"

    OLLAMA_EMBED_MODEL: str = "nomic-embed-text"


    # Qdrant Configuration

    QDRANT_HOST: str = "localhost"

    QDRANT_PORT: int = 6333

    QDRANT_COLLECTION: str = "smart_pdf_chat"

    EMBEDDING_DIMENSION: int = 768


    # PDF Configuration

    UPLOAD_DIR: str = "uploads"

    MAX_UPLOAD_SIZE_MB: int = 50

    ALLOWED_FILE_TYPES: List[str] = [
        "application/pdf"
    ]


    # CORS

    CORS_ORIGINS: List[str] = [
        "http://localhost:5173"
    ]


    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value):

        if isinstance(value, str):
            return [
                origin.strip()
                for origin in value.split(",")
                if origin.strip()
            ]

        return value


    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
        env_ignore_empty=True,
    )



@lru_cache()
def get_settings() -> Settings:
    """
    Returns cached settings instance.
    """

    return Settings()



settings = get_settings()