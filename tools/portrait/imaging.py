"""Small image helpers. Arrays are float32 in 0..1; colour arrays are (H, W, 3)."""
from collections.abc import Sequence

import cv2
import numpy as np
from PIL import Image

Array = np.ndarray
Face = dict[str, float]


def hex2rgb(h: str) -> Array:
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)], dtype=np.float32)


def smoothstep(e0: float, e1: float, x: Array | float) -> Array:
    t = np.clip((np.asarray(x, dtype=np.float32) - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def luminance(rgb: Array, alpha: Array, clahe: float = 2.2) -> Array:
    """Luminance with local contrast, stretched over the subject only."""
    lum = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]
    l8 = cv2.createCLAHE(clipLimit=clahe, tileGridSize=(8, 8)).apply((lum * 255).astype(np.uint8))
    lum = l8.astype(np.float32) / 255
    inside = lum[alpha > 0.6]
    if inside.size == 0:
        raise ValueError("the cut-out is empty; is there a person in the photo?")
    lo, hi = np.percentile(inside, 1.5), np.percentile(inside, 99.2)
    return np.clip((lum - lo) / max(hi - lo, 1e-3), 0, 1)


def ramp(t: Array, stops: Sequence[tuple[float, str]]) -> Array:
    """Gradient-map a 0..1 array through (position, hex) colour stops."""
    xs = np.array([s[0] for s in stops], dtype=np.float32)
    cols = np.stack([hex2rgb(s[1]) for s in stops])
    return np.stack([np.interp(t, xs, cols[:, c]) for c in range(3)], axis=-1).astype(np.float32)


def noise(h: int, w: int, scale: float, seed: int) -> Array:
    """Smooth value noise in 0..1 with features about `scale` px across."""
    rng = np.random.default_rng(seed)
    g = rng.random((max(2, int(h / scale) + 2), max(2, int(w / scale) + 2))).astype(np.float32)
    return cv2.resize(g, (w, h), interpolation=cv2.INTER_CUBIC).clip(0, 1)


def subject_bottom(alpha: Array) -> int:
    """Lowest row that still has a meaningful amount of subject."""
    rows = np.where((alpha > 0.5).sum(axis=1) > alpha.shape[1] * 0.08)[0]
    return int(rows.max()) if len(rows) else alpha.shape[0]


def bottom_fade(alpha: Array, face: Face, start_frac: float = 0.6, soft: float = 0.3) -> Array:
    """1 at the top, 0 just above wherever the subject (or the photo) ends.

    It never starts above the chin, so a short photo gets a shorter, steeper fade.
    """
    h, w = alpha.shape
    end = subject_bottom(alpha) - 10
    start = max(min(h * start_frac, end - h * soft), face["y"] + face["h"] * 1.12)
    y = np.arange(h, dtype=np.float32)[:, None]
    return np.broadcast_to(1 - smoothstep(start, max(end, start + 1), y), (h, w)).astype(np.float32)


def over(dst_rgb: Array, dst_a: Array, src_rgb: Array, src_a: Array) -> tuple[Array, Array]:
    """Porter-Duff source-over on straight (unpremultiplied) colour."""
    out_a = src_a + dst_a * (1 - src_a)
    num = src_rgb * src_a[..., None] + dst_rgb * (dst_a * (1 - src_a))[..., None]
    safe = np.maximum(out_a[..., None], 1e-5)
    return np.where(out_a[..., None] > 1e-5, num / safe, 0).astype(np.float32), out_a


def save_webp(path: str, rgb: Array, alpha: Array, quality: int = 82) -> None:
    arr = np.dstack([rgb, alpha]).clip(0, 1)
    img = Image.fromarray((arr * 255 + 0.5).astype(np.uint8), "RGBA")
    img.save(path, "WEBP", quality=quality, alpha_quality=90, method=6)
