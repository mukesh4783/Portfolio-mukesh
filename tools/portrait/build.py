"""Rebuild the hero portrait from a photo.

    npm run portrait -- pfp/photo.jpg
    npm run portrait -- pfp/photo.jpg --face-size 0.32 --face-top 0.24

Writes public/portrait/{back,subject}-{light,dark}.webp and
src/components/hero/portrait/layout.json. Then check it with `npm run dev`.
"""
import argparse
import json
import logging
import os
import sys

from framing import MODELS, Framing, frame_photo
from imaging import bottom_fade, luminance, save_webp
from layers import back_layer, subject_layer
from palette import THEMES
from patches import layout

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
IMG_DIR = os.path.join(ROOT, "public", "portrait")
LAYOUT = os.path.join(ROOT, "src", "components", "hero", "portrait", "layout.json")
MAX_UPSCALE = 1.25                # frame px per photo px before it starts to look soft

log = logging.getLogger("portrait")


def face_box(text: str) -> tuple[int, int, int, int]:
    parts = text.split(",")
    if len(parts) != 4 or not all(p.strip().isdigit() for p in parts):
        raise argparse.ArgumentTypeError("use x,y,w,h in photo pixels, e.g. 1085,1027,903,903")
    x, y, w, h = (int(p) for p in parts)
    if w <= 0 or h <= 0:
        raise argparse.ArgumentTypeError("face width and height must be positive")
    return x, y, w, h


def fraction(lo: float, hi: float):
    def parse(text: str) -> float:
        v = float(text)
        if not lo <= v <= hi:
            raise argparse.ArgumentTypeError(f"must be between {lo} and {hi}")
        return v
    return parse


def parse_args(argv: list[str]) -> argparse.Namespace:
    ap = argparse.ArgumentParser(prog="npm run portrait --", description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("photo", help="a photo of you, facing the camera, head and shoulders or more")
    ap.add_argument("--face-size", type=fraction(0.15, 0.6),
                    help="face width as a fraction of the frame (auto, usually 0.29)")
    ap.add_argument("--face-top", type=fraction(0.0, 0.5),
                    help="top of the face as a fraction of the frame height (auto, usually 0.20)")
    ap.add_argument("--face", type=face_box, help="face box x,y,w,h if it is not found automatically")
    ap.add_argument("--model", choices=MODELS, default=MODELS[0], help="background removal model")
    return ap.parse_args(argv)


def main(argv: list[str]) -> int:
    logging.basicConfig(level=logging.INFO, format="%(message)s")
    args = parse_args(argv)
    if not os.path.isfile(args.photo):
        log.error("no such file: %s", args.photo)
        return 1
    if (args.face_size is None) != (args.face_top is None):
        log.error("pass --face-size and --face-top together, or neither")
        return 1

    framing = Framing(args.face_size, args.face_top) if args.face_size is not None else None
    log.info("cutting out %s (first run downloads the model) ...", args.photo)
    if args.model == "birefnet-portrait":
        log.info("this model needs about 8 GB of free memory; on a smaller machine add --model u2net_human_seg")
    try:
        frame = frame_photo(args.photo, args.model, framing, args.face)
    except (OSError, ValueError) as e:
        log.error("could not use that photo: %s", e)
        return 1
    if frame.scale > MAX_UPSCALE:
        log.warning("the face is small in this photo, so the portrait will look soft; a closer or larger photo is better")

    lum = luminance(frame.rgb, frame.alpha)
    fade = bottom_fade(frame.alpha, frame.face)
    os.makedirs(IMG_DIR, exist_ok=True)
    for theme, pal in THEMES.items():
        back_rgb, back_a = back_layer(pal)
        subj_rgb, subj_a = subject_layer(lum, frame.alpha, fade, frame.face, pal)
        save_webp(os.path.join(IMG_DIR, f"back-{theme}.webp"), back_rgb, back_a)
        save_webp(os.path.join(IMG_DIR, f"subject-{theme}.webp"), subj_rgb, subj_a)
        log.info("wrote %s back + subject", theme)

    data = layout(frame.alpha, fade, frame.face)
    with open(LAYOUT, "w", encoding="utf-8") as f:
        json.dump(data, f, separators=(",", ":"))
    log.info("wrote layout: %d core, %d loose, %d ghost patches", len(data["core"]), len(data["loose"]), len(data["ghost"]))
    log.info("done. run `npm run dev` to see it.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
