from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageEnhance


def generate_ela(image_path: str, output_dir: str, quality: int = 90) -> tuple[str, float]:
    source = Path(image_path)
    out_dir = Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    with Image.open(source) as image:
        rgb = image.convert("RGB")
        resaved_path = out_dir / f"{source.stem}_resaved.jpg"
        ela_path = out_dir / f"{source.stem}_ela.jpg"

        rgb.save(resaved_path, "JPEG", quality=quality)
        resaved = Image.open(resaved_path)
        diff = ImageChops.difference(rgb, resaved)
        extrema = diff.getextrema()
        max_diff = max(channel[1] for channel in extrema) or 1
        scale = min(255 / max_diff, 12)
        enhanced = ImageEnhance.Brightness(diff).enhance(scale)
        enhanced.save(ela_path, "JPEG", quality=95)

        arr = np.asarray(diff).astype("float32")
        normalized = float(min(arr.mean() / 18, 1.0))

    resaved_path.unlink(missing_ok=True)
    return str(ela_path), normalized
