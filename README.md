# ForenSight: AI Image Manipulation Timeline Analyzer

ForenSight is a deployed-ready full-stack scaffold for uploading an image, running lightweight forensic checks, and viewing an explainable authenticity report. The system uses careful language: results are probable indicators, not proof that an image is original, edited, or AI-generated.

## Features

- Dark modern forensic dashboard built with Next.js, TypeScript, and Tailwind CSS.
- Drag-and-drop upload for JPG, JPEG, PNG, and WEBP files.
- FastAPI endpoint at `POST /api/analyze`.
- Local upload storage for development with Cloudinary-ready configuration for deployment.
- PostgreSQL-ready database configuration with SQLite fallback for local development.
- Lightweight forensic modules:
  - Pillow EXIF metadata review.
  - Error Level Analysis preview image.
  - Noise inconsistency heuristic.
  - JPEG compression artifact estimate.
  - Copy-move suspicious region estimate.
  - Text overlay detection placeholder.
  - AI-generated likelihood placeholder from combined heuristic signals.
- Report page with overall assessment, confidence score, probable timeline, ELA preview, signal badges, and evaluation metric placeholders.

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS, lucide-react.
- Backend: FastAPI, Python, Pillow, OpenCV, scikit-image.
- Database: PostgreSQL for production, SQLite fallback for local development.
- Storage: local filesystem for development, Cloudinary-ready service helper.
- Deployment: Vercel frontend, Render backend, Supabase or Neon PostgreSQL.

## Project Structure

```text
ForenSight/
  frontend/
    app/
      page.tsx
      upload/page.tsx
      report/page.tsx
    components/
      Navbar.tsx
      UploadBox.tsx
      ReportCard.tsx
      Timeline.tsx
      SignalBadge.tsx
      ImagePreview.tsx
    lib/
      api.ts
      types.ts
  backend/
    app/
      main.py
      config.py
      database.py
      models/schemas.py
      services/analyzer.py
      services/metadata.py
      services/ela.py
      services/noise.py
      services/report.py
      services/storage.py
    uploads/
    requirements.txt
```

## Local Setup

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

On macOS or Linux, activate the virtual environment with:

```bash
source .venv/bin/activate
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## API

### Analyze Image

`POST /api/analyze`

Form field:

- `file`: JPG, JPEG, PNG, or WEBP image, max 8MB by default.

Sample response:

```json
{
  "id": "f764b9814a9e4e4ca941da48aa26cf5b",
  "filename": "sample.jpg",
  "assessment": "Possibly Edited",
  "confidence_score": 52.4,
  "ai_generated_likelihood": 47.8,
  "image_url": "http://localhost:8000/uploads/sample.jpg",
  "ela_url": "http://localhost:8000/uploads/sample_ela.jpg",
  "timeline": [
    {
      "step": 1,
      "title": "Original image loaded",
      "description": "The uploaded file was decoded and prepared for lightweight forensic checks.",
      "risk": "info"
    }
  ],
  "signals": [
    {
      "key": "metadata",
      "label": "Metadata review",
      "status": "medium",
      "score": 0.55,
      "explanation": "No EXIF metadata was found. This can happen after export, editing, or privacy stripping."
    }
  ],
  "metadata": {
    "format": "JPEG",
    "mode": "RGB",
    "width": 1280,
    "height": 720,
    "has_exif": false,
    "exif": {}
  },
  "metrics": {
    "accuracy": null,
    "precision": null,
    "recall": null,
    "f1_score": null,
    "auc_roc": null,
    "mae": null,
    "confusion_matrix": null,
    "note": "Evaluation metrics require a labeled validation dataset."
  },
  "disclaimer": "ForenSight reports probable forensic indicators only. It cannot perfectly prove whether an image is original, edited, or AI-generated."
}
```

## Evaluation Metrics

The report schema includes the requested metrics:

- Accuracy: overall correct predictions.
- Precision: when the system says manipulated, how often it is correct.
- Recall: how many manipulated images it successfully detects.
- F1-score: balance between precision and recall.
- Confusion Matrix: correct and wrong results per class.
- AUC-ROC: separation between original and manipulated classes.
- MAE: difference between predicted confidence score and expected score.

These values are intentionally returned as `null` until you add a labeled validation dataset and benchmarking script. This avoids overstating model quality.

## Deployment Notes

### Vercel Frontend

- Set project root to `frontend`.
- Add `NEXT_PUBLIC_API_URL` with your Render backend URL.
- Build command: `npm run build`.
- Output is handled by Next.js.

### Render Backend

- Set project root to `backend`.
- Build command: `pip install -r requirements.txt`.
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- Add environment variables from `backend/.env.example`.
- Set `FRONTEND_ORIGIN` to your Vercel app URL.
- Set `PUBLIC_BASE_URL` to your Render service URL.

### PostgreSQL With Supabase Or Neon

- Create a PostgreSQL database.
- Set `DATABASE_URL` in Render to the provider connection string.
- Keep SQLite locally with `DATABASE_URL=sqlite:///./forensight.db`.

### Cloudinary

- Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
- `backend/app/services/storage.py` includes a ready helper for upload integration.
- The first scaffold serves local files. In production, wire `upload_to_cloudinary_if_configured` into `analyzer.py` or `main.py` when persistent remote storage is required.

## Limitations

- Heuristics are lightweight indicators and can produce false positives or false negatives.
- ELA is sensitive to file format, recompression, resizing, and platform exports.
- AI-generated likelihood is a placeholder derived from simple combined signals, not a trained detector.
- OCR is not enabled by default to keep setup lightweight.
- Evaluation metrics need a labeled dataset before meaningful values can be reported.

## Future Improvements

- Add SQLAlchemy models to persist analyses and report history.
- Add Cloudinary upload flow for original and ELA images.
- Add a labeled benchmark command for accuracy, precision, recall, F1-score, confusion matrix, AUC-ROC, and MAE.
- Add optional OCR with pytesseract or easyocr.
- Add user accounts and report sharing.
- Add region heatmaps and richer copy-move localization.
