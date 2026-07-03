from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.models.schemas import AnalysisReport
from app.services.analyzer import analyze_image

settings = get_settings()
app = FastAPI(title=settings.app_name, version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

upload_dir = Path(settings.upload_dir)
upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")

ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": settings.app_name}


@app.post("/api/analyze", response_model=AnalysisReport)
async def analyze(file: UploadFile = File(...)) -> AnalysisReport:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use JPG, JPEG, PNG, or WEBP.")

    contents = await file.read()
    max_bytes = settings.max_upload_mb * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(status_code=413, detail=f"File exceeds {settings.max_upload_mb}MB limit.")

    suffix = Path(file.filename or "upload.jpg").suffix.lower()
    safe_name = f"{uuid4().hex}{suffix}"
    image_path = upload_dir / safe_name
    image_path.write_bytes(contents)

    try:
        return analyze_image(str(image_path), file.filename or safe_name)
    except Exception as exc:
        image_path.unlink(missing_ok=True)
        raise HTTPException(status_code=422, detail=f"Image analysis failed: {exc}") from exc


@app.exception_handler(HTTPException)
async def http_exception_handler(_, exc: HTTPException) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"error": exc.detail})
