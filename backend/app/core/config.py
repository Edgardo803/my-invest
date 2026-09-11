from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "My Invest"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "cambia-esta-clave-secreta-en-produccion-muy-larga-y-segura-123456789"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 días

    # Database
    DATABASE_URL: str = "sqlite:///./myinvest.db"  # Cambiar a PostgreSQL en producción

    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://my-invest-delta.vercel.app",
]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
