from pathlib import Path

import cloudinary
import cloudinary.uploader

from app.config import get_settings


def configure_cloudinary() -> bool:
    settings = get_settings()
    if not all([settings.cloudinary_cloud_name, settings.cloudinary_api_key, settings.cloudinary_api_secret]):
        return False

    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
        secure=True,
    )
    return True


def upload_to_cloudinary_if_configured(path: str) -> str | None:
    if not configure_cloudinary():
        return None
    result = cloudinary.uploader.upload(path, folder="forensight")
    return str(result.get("secure_url"))


def ensure_local_upload_dir(upload_dir: str) -> Path:
    path = Path(upload_dir)
    path.mkdir(parents=True, exist_ok=True)
    return path
