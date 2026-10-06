"""Patch layout: the subject cut into 16x20 patches of 32 CSS px, the way a vision
transformer reads an image.

Head and shoulders hold together as one seamless core. Lower down, patches drift
outward and shrink as the image fades, and past them only ghost cells remain, so
the portrait hands over to the page's 32 px blueprint grid.
"""
import numpy as np

from imaging import Array, Face

COLS, ROWS, P = 16, 20, 64


def layout(alpha: Array, fade: Array, face: Face, seed: int = 3) -> dict:
    if alpha.shape != (ROWS * P, COLS * P):
        raise ValueError(f"expected a {COLS * P}x{ROWS * P} frame, got {alpha.shape[1]}x{alpha.shape[0]}")
    rng = np.random.default_rng(seed)
    vis = alpha * fade
    chin = face["y"] + face["h"]
    cx, cy = face["x"] + face["w"] / 2, face["y"] + face["h"] * 1.4   # drift away from the chest

    core, loose, ghost = [], [], []
    for i in range(ROWS):
        for j in range(COLS):
            cover = float(vis[i * P:(i + 1) * P, j * P:(j + 1) * P].mean())
            ring = float(alpha[max(0, (i - 1) * P):(i + 2) * P, max(0, (j - 1) * P):(j + 2) * P].mean())
            mx, my = (j + 0.5) * P, (i + 0.5) * P
            fmean = float(fade[i * P:(i + 1) * P, 0].mean())

            if cover < 0.03:
                if my > chin + P and ring > 0.08 and rng.random() < 0.35:
                    ghost.append([i, j])
                continue
            if my < chin + P * 1.5:                       # head and shoulders stay whole
                core.append([i, j])
                continue
            # Noise on the threshold staggers the edge of the core instead of a straight cut.
            u = (1 - min(cover / 0.9, 1)) * 0.7 + (1 - fmean) * 1.25 + rng.normal(0, 0.14)
            if u < 0.22:
                core.append([i, j])
                continue
            # The least stable patches drift furthest and nearly vanish, but still fly
            # home on hover so the assembled picture has no holes.
            far = u > 1.0 and rng.random() < 0.5
            vx, vy = mx - cx, my - cy
            n = max(float(np.hypot(vx, vy)), 1.0)
            mag = 0.06 + min(u, 1.2) * 0.42 + (0.5 if far else 0)    # in patch widths
            dx = vx / n * mag + rng.normal(0, 0.05)
            dy = abs(vy / n) * mag * 0.6 + (1 - fmean) * 0.3 + rng.normal(0, 0.04)
            scale = 1 - min(u, 1) * 0.18
            opacity = 0.1 if far else max(0.3, 1 - max(u - 0.35, 0) * 0.9)
            loose.append([i, j, round(float(dx), 2), round(float(dy), 2), round(scale, 2), round(opacity, 2)])

    # A few loose patches carry the mint 'attention' outline.
    attn = sorted(int(k) for k in rng.choice(len(loose), size=min(4, len(loose)), replace=False)) if loose else []
    return {"cols": COLS, "rows": ROWS, "core": core, "loose": loose, "ghost": ghost, "attn": attn}
