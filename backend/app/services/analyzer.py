from pathlib import Path
from uuid import uuid4

from app.config import get_settings
from app.models.schemas import AnalysisReport, Signal
from app.services.ela import generate_ela
from app.services.metadata import metadata_signal, read_metadata
from app.services.noise import copy_move_score, jpeg_artifact_score, noise_inconsistency_score, text_overlay_score
from app.services.report import build_assessment, build_timeline, placeholder_metrics, risk_status


WEIGHTS = {
    "metadata": 0.18,
    "ela": 0.24,
    "noise": 0.22,
    "jpeg": 0.14,
    "copy_move": 0.14,
    "text_overlay": 0.08,
}


def make_public_url(path: str) -> str:
    settings = get_settings()
    relative = Path(path).as_posix()
    if relative.startswith("uploads/"):
        upload_path = f"/{relative}"
    else:
        upload_path = f"/uploads/{Path(path).name}"

    if not settings.public_base_url:
        return upload_path
    return f"{settings.public_base_url.rstrip('/')}{upload_path}"


def analyze_image(image_path: str, original_filename: str) -> AnalysisReport:
    metadata = read_metadata(image_path)
    metadata_score, metadata_explanation = metadata_signal(metadata)
    ela_path, ela_score = generate_ela(image_path, get_settings().upload_dir)
    noise_score, noise_explanation = noise_inconsistency_score(image_path)
    jpeg_score, jpeg_explanation = jpeg_artifact_score(image_path)
    copy_score, copy_explanation = copy_move_score(image_path)
    text_score, text_explanation = text_overlay_score(image_path)

    raw_signals = [
        ("metadata", "Metadata review", metadata_score, metadata_explanation),
        ("ela", "Error Level Analysis", ela_score, "ELA highlights estimate recompression differences across the image."),
        ("noise", "Noise inconsistency", noise_score, noise_explanation),
        ("jpeg", "JPEG artifact estimate", jpeg_score, jpeg_explanation),
        ("copy_move", "Copy-move estimate", copy_score, copy_explanation),
        ("text_overlay", "Text overlay placeholder", text_score, text_explanation),
    ]

    signals = [
        Signal(key=key, label=label, score=round(score, 3), status=risk_status(score), explanation=explanation)
        for key, label, score, explanation in raw_signals
    ]

    combined = sum(score * WEIGHTS[key] for key, _, score, _ in raw_signals)
    confidence = round(min(max(combined * 100, 1), 99), 1)
    assessment = build_assessment(confidence)
    ai_likelihood = round(min((ela_score * 0.32 + noise_score * 0.28 + metadata_score * 0.2 + jpeg_score * 0.2) * 100, 99), 1)

    return AnalysisReport(
        id=uuid4().hex,
        filename=original_filename,
        assessment=assessment,
        confidence_score=confidence,
        ai_generated_likelihood=ai_likelihood,
        image_url=make_public_url(image_path),
        ela_url=make_public_url(ela_path),
        timeline=build_timeline(signals, assessment),
        signals=signals,
        metadata=metadata,
        metrics=placeholder_metrics(),
        disclaimer="ForenSight reports probable forensic indicators only. It cannot perfectly prove whether an image is original, edited, or AI-generated.",
    )
