from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ForenSight API"
    environment: str = "development"
    frontend_origin: str = "http://localhost:3000"
    database_url: str = "sqlite:///./forensight.db"
    upload_dir: str = "uploads"
    public_base_url: str = "http://localhost:8000"
    max_upload_mb: int = 8
    cloudinary_cloud_name: str | None = None
    cloudinary_api_key: str | None = None
    cloudinary_api_secret: str | None = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    return Settings()
