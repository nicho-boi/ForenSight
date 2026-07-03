from app.models.schemas import Metrics, Signal, TimelineEvent


def risk_status(score: float) -> str:
    if score >= 0.66:
        return "high"
    if score >= 0.35:
        return "medium"
    return "low"


def build_assessment(score: float) -> str:
    if score >= 68:
        return "Likely Manipulated"
    if score >= 38:
        return "Possibly Edited"
    return "Likely Original"


def build_timeline(signals: list[Signal], assessment: str) -> list[TimelineEvent]:
    events = [
        TimelineEvent(step=1, title="Original image loaded", description="The uploaded file was decoded and prepared for lightweight forensic checks.", risk="info"),
    ]

    for signal in signals:
        if signal.score >= 0.35:
            events.append(
                TimelineEvent(
                    step=len(events) + 1,
                    title=signal.label,
                    description=signal.explanation,
                    risk=signal.status,
                )
            )

    events.append(
        TimelineEvent(
            step=len(events) + 1,
            title="Final exported image estimated",
            description=f"The combined indicators produce an overall assessment of {assessment.lower()}.",
            risk="medium" if assessment == "Possibly Edited" else risk_status(max((s.score for s in signals), default=0)),
        )
    )
    return events


def placeholder_metrics() -> Metrics:
    return Metrics(
        note=(
            "Evaluation metrics require a labeled validation dataset. "
            "This scaffold exposes the metric fields for future benchmarking "
            "but does not claim measured accuracy, precision, recall, F1-score, AUC-ROC, MAE, or confusion matrix values yet."
        )
    )
