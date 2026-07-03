from PIL import ExifTags, Image


def read_metadata(image_path: str) -> dict:
    with Image.open(image_path) as image:
        exif = image.getexif()
        metadata = {
            "format": image.format,
            "mode": image.mode,
            "width": image.width,
            "height": image.height,
            "has_exif": bool(exif),
            "exif": {},
        }

        for tag_id, value in exif.items():
            tag = ExifTags.TAGS.get(tag_id, str(tag_id))
            if isinstance(value, bytes):
                value = value.decode(errors="ignore")
            metadata["exif"][tag] = str(value)

        return metadata


def metadata_signal(metadata: dict) -> tuple[float, str]:
    if not metadata.get("has_exif"):
        return 0.55, "No EXIF metadata was found. This can happen after export, editing, or privacy stripping."

    software = metadata.get("exif", {}).get("Software")
    if software:
        return 0.7, f"Metadata references editing or export software: {software}."

    return 0.18, "EXIF metadata is present and no obvious editing software tag was found."
