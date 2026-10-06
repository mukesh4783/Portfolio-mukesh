"""The two 'Signal' layers.

back:    data shapes behind the subject (panels, pills, plot points, hairlines).
subject: the person in the theme's tone ramp, with data textures exposed into the
         hair and shoulders (the face stays clean), fading out toward the bottom.
"""
import cv2
import numpy as np

from framing import FH as H
from framing import FW as W
from imaging import Array, Face, hex2rgb, noise, over, ramp, smoothstep

SHIFT = 4  # cv2 sub-pixel bits for anti-aliased circles


def _mask(draw) -> Array:
    m = np.zeros((H, W), np.uint8)
    draw(m)
    return m.astype(np.float32) / 255


def _p(v: float) -> int:
    return int(round(v * (1 << SHIFT)))


def rect(x0: float, y0: float, x1: float, y1: float) -> Array:
    return _mask(lambda m: cv2.rectangle(m, (int(x0), int(y0)), (int(x1), int(y1)), 255, -1))


def pill(x0: float, y0: float, x1: float, y1: float) -> Array:
    r = (y1 - y0) / 2

    def draw(m: Array) -> None:
        cv2.rectangle(m, (int(x0 + r), int(y0)), (int(x1 - r), int(y1)), 255, -1)
        for cx in (x0 + r, x1 - r):
            cv2.circle(m, (_p(cx), _p(y0 + r)), _p(r), 255, -1, cv2.LINE_AA, SHIFT)
    return _mask(draw)


def dot(cx: float, cy: float, r: float) -> Array:
    return _mask(lambda m: cv2.circle(m, (_p(cx), _p(cy)), _p(r), 255, -1, cv2.LINE_AA, SHIFT))


def vline(x: float, y0: float, y1: float, t: int = 2) -> Array:
    return rect(x, y0, x + t - 1, y1)


def hline(y: float, x0: float, x1: float, t: int = 2) -> Array:
    return rect(x0, y, x1, y + t - 1)


def outline(x0: float, y0: float, x1: float, y1: float, t: int = 2) -> Array:
    edges = hline(y0, x0, x1, t) + hline(y1, x0, x1, t) + vline(x0, y0, y1, t) + vline(x1, y0, y1, t)
    return np.clip(edges, 0, 1)


def stripes(period: int, duty: int, axis: int) -> Array:
    """Scanlines (axis 0) or vertical bars (axis 1)."""
    idx = np.arange(H if axis == 0 else W)
    on = ((idx % period) < duty).astype(np.float32)
    return np.broadcast_to(on[:, None] if axis == 0 else on[None, :], (H, W))


def halftone(pitch: int, r: float) -> Array:
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.hypot((x % pitch) - pitch / 2, (y % pitch) - pitch / 2)
    return np.clip(r - d + 0.5, 0, 1)


def vgrad(y0: float, y1: float, a0: float = 1.0, a1: float = 0.0) -> Array:
    t = np.clip((np.arange(H, dtype=np.float32)[:, None] - y0) / (y1 - y0), 0, 1)
    return np.broadcast_to(a0 + (a1 - a0) * t, (H, W))


def back_layer(pal: dict) -> tuple[Array, Array]:
    col, a = np.zeros((H, W, 3), np.float32), np.zeros((H, W), np.float32)
    c = {k: hex2rgb(pal[k]) for k in ("blue", "mint", "over", "ink", "paper")}

    def paint(mask: Array, colour: Array, k: float = 1.0) -> None:
        nonlocal col, a
        col, a = over(col, a, np.broadcast_to(colour, (H, W, 3)), mask * k)

    # Plot grid first, so the data sits on top of it.
    for x, y0, y1 in ((150, 40, 1180), (300, 0, 760), (468, 90, 1240), (762, 20, 1220), (906, 120, 980)):
        paint(vline(x, y0, y1), c["ink"], 0.14)
    for y, x0, x1 in ((640, 40, 360), (1010, 640, 1000), (150, 520, 980)):
        paint(hline(y, x0, x1), c["ink"], 0.12)

    # Tall scanned panel behind the right shoulder, fading out downward.
    panel = rect(572, 168, 940, 1060)
    paint(panel * vgrad(168, 1060, 0.95, 0.0), c["blue"])
    paint(panel * stripes(8, 2, 0) * vgrad(168, 1060, 0.35, 0.0), c["paper"])
    # Halftone panel behind the left arm.
    paint(rect(92, 600, 432, 1000) * halftone(12, 3.4) * vgrad(600, 1000, 1.0, 0.1), c["over"], 0.75)
    paint(outline(92, 600, 432, 1000), c["over"], 0.35)
    # Pills either side of the head.
    paint(pill(56, 372, 440, 440), c["mint"], 0.82)
    paint(pill(720, 620, 990, 668), c["over"], 0.55)

    # Plot points.
    paint(dot(250, 176, 38), c["mint"])
    points = ((70, 520, 7, "blue"), (118, 760, 9, "mint"), (60, 980, 6, "over"), (206, 300, 5, "blue"),
              (980, 420, 8, "mint"), (960, 760, 6, "blue"), (1000, 1120, 7, "over"), (880, 90, 10, "blue"),
              (40, 640, 4, "ink"), (520, 70, 5, "mint"), (640, 1180, 6, "blue"), (210, 1110, 5, "mint"))
    for x, y, r, k in points:
        paint(dot(x, y, r), c[k], 0.9)

    # Bounding boxes and a barcode: data texture without words.
    paint(outline(780, 210, 870, 262), c["ink"], 0.3)
    paint(outline(140, 470, 214, 520), c["ink"], 0.25)
    rng = np.random.default_rng(4)
    bars, x = np.zeros((H, W), np.float32), 820
    while x < 980:
        w = int(rng.integers(2, 7))
        bars += rect(x, 1080, x + w, 1080 + int(rng.integers(24, 58)))
        x += w + int(rng.integers(3, 8))
    paint(np.clip(bars, 0, 1), c["ink"], 0.35)
    return col, a


def _screen(col: Array, colour: Array, t: Array) -> Array:
    scr = 1 - (1 - col) * (1 - colour)
    return col * (1 - t[..., None]) + scr * t[..., None]


def subject_layer(lum: Array, alpha: Array, fade: Array, face: Face, pal: dict) -> tuple[Array, Array]:
    col = ramp(np.clip(lum + (noise(H, W, 1.5, 12) - 0.5) * 0.04, 0, 1), pal["ramp"])

    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    fx, fy, fw, fh = face["x"], face["y"], face["w"], face["h"]
    ellipse = ((x - (fx + fw / 2)) / (fw * 0.62)) ** 2 + ((y - (fy + fh * 0.58)) / (fh * 0.78)) ** 2
    keep_face = smoothstep(0.75, 1.35, ellipse)

    blocks = (
        (rect(fx - 0.18 * fw, fy - 0.46 * fh, fx + 1.13 * fw, fy + 0.15 * fh) * stripes(6, 2, 0), "blue", 0.55),
        (rect(60, 680, 360, 940) * stripes(10, 3, 1), "mint", 0.4),
        (rect(700, 560, 940, 860) * stripes(10, 3, 0), "blue", 0.45),
        (rect(420, 860, 640, 1000) * halftone(10, 2.6), "over", 0.5),
    )
    for mask, key, k in blocks:
        col = _screen(col, hex2rgb(pal[key]), mask * k * keep_face * alpha)
    return col, alpha * fade
