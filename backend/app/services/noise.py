import cv2
import numpy as np


def load_grayscale(image_path: str) -> np.ndarray:
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if image is None:
        raise ValueError("Unable to decode image for forensic analysis.")
    return image


def noise_inconsistency_score(image_path: str) -> tuple[float, str]:
    gray = load_grayscale(image_path)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    residual = cv2.absdiff(gray, blur)
    block = 64
    variances = []

    for y in range(0, residual.shape[0], block):
        for x in range(0, residual.shape[1], block):
            patch = residual[y : y + block, x : x + block]
            if patch.size > 256:
                variances.append(float(np.var(patch)))

    if not variances:
        return 0.15, "Image is too small for meaningful local noise comparison."

    spread = float(np.std(variances) / (np.mean(variances) + 1e-6))
    score = min(spread / 1.7, 1.0)
    return score, "Local noise residuals vary across image regions." if score > 0.45 else "Local noise residuals look relatively consistent."


def jpeg_artifact_score(image_path: str) -> tuple[float, str]:
    gray = load_grayscale(image_path)
    edges = cv2.Canny(gray, 100, 200)
    vertical_grid = edges[:, 7::8].mean() if edges.shape[1] > 8 else 0
    horizontal_grid = edges[7::8, :].mean() if edges.shape[0] > 8 else 0
    overall = edges.mean() + 1e-6
    ratio = float((vertical_grid + horizontal_grid) / (2 * overall))
    score = min(max((ratio - 0.85) / 1.2, 0), 1)
    return score, "JPEG block grid artifacts are elevated." if score > 0.45 else "JPEG block artifacts are not strongly elevated."


def normalized_patch_similarity(first: np.ndarray, second: np.ndarray) -> float:
    first_float = first.astype("float32")
    second_float = second.astype("float32")
    first_float -= first_float.mean()
    second_float -= second_float.mean()
    denominator = float(np.linalg.norm(first_float) * np.linalg.norm(second_float))
    if denominator <= 1e-6:
        return 0.0
    return float(np.clip(np.sum(first_float * second_float) / denominator, -1.0, 1.0))


def copy_move_score(image_path: str) -> tuple[float, str]:
    gray = load_grayscale(image_path)
    resized = cv2.resize(gray, (256, 256), interpolation=cv2.INTER_AREA)
    patch_size = 48
    samples = []

    for y in range(0, 256 - patch_size, 32):
        for x in range(0, 256 - patch_size, 32):
            samples.append((x, y, resized[y : y + patch_size, x : x + patch_size]))

    suspicious = 0
    comparisons = 0
    for idx, (x1, y1, p1) in enumerate(samples):
        for x2, y2, p2 in samples[idx + 1 :]:
            if abs(x1 - x2) + abs(y1 - y2) < patch_size:
                continue
            comparisons += 1
            similarity = normalized_patch_similarity(p1, p2)
            if similarity > 0.92:
                suspicious += 1

    score = min(suspicious / max(comparisons * 0.025, 1), 1)
    return score, "Similar separated patches may indicate copy-move editing." if score > 0.35 else "No strong repeated-region pattern was estimated."


def text_overlay_score(image_path: str) -> tuple[float, str]:
    gray = load_grayscale(image_path)
    edges = cv2.Canny(gray, 80, 160)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    rectangular = 0
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        if 8 <= w <= 220 and 8 <= h <= 80 and 1.2 <= w / max(h, 1) <= 12:
            rectangular += 1
    score = min(rectangular / 80, 1)
    return score, "Possible text or graphic overlay edges were detected." if score > 0.35 else "Text overlay detection is a lightweight placeholder and found no strong signal."
