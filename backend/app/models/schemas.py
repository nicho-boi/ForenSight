from pydantic import BaseModel, Field


class Signal(BaseModel):
    key: str
    label: str
    status: str = Field(description="low, medium, high, info")
    score: float = Field(ge=0, le=1)
    explanation: str


class TimelineEvent(BaseModel):
    step: int
    title: str
    description: str
    risk: str


class Metrics(BaseModel):
    accuracy: float | None = None
    precision: float | None = None
    recall: float | None = None
    f1_score: float | None = None
    auc_roc: float | None = None
    mae: float | None = None
    confusion_matrix: list[list[int]] | None = None
    note: str


class AnalysisReport(BaseModel):
    id: str
    filename: str
    assessment: str
    confidence_score: float = Field(ge=0, le=100)
    ai_generated_likelihood: float = Field(ge=0, le=100)
    image_url: str
    ela_url: str | None = None
    timeline: list[TimelineEvent]
    signals: list[Signal]
    metadata: dict
    metrics: Metrics
    disclaimer: str
