"""Cut the person out of a photo and frame them on their face.

Every photo is framed the same way (face at the same size and place), so the data
shapes drawn around it line up whatever photo goes in.
"""
from dataclasses import dataclass

import cv2
import numpy as np
from PIL import Image, ImageOps

from imaging import Array, Face

FW, FH = 1024, 1280          # 2x the 512x640 CSS frame: 16x20 patches of 64 px
FACE_CX = 0.52               # face centre, fraction of frame width
DEFAULT_SIZE = 0.29          # face width, fraction of frame width
DEFAULT_TOP = 0.20           # top of the face, fraction of frame height
MAX_SIZE = 0.36
TARGET_END = 0.82            # the photo should reach at least this far down the frame
MAX_INPUT = 2400             # long side the photo is reduced to before cutting out
MODELS = ("birefnet-portrait", "isnet-general-use", "u2net_human_seg")


@dataclass(frozen=True)
class Framing:
    size: float
    top: float


@dataclass(frozen=True)
class Frame:
    rgb: Array
    alpha: Array
    face: Face               # x, y, w, h in frame pixels
    scale: float             # frame pixels per photo pixel; above 1 the photo was enlarged


def auto_framing(face_h: float, below_chin: float) -> Framing:
    """The default framing, tightened for a photo that stops soon under the chin.

    `below_chin` is how much photo there is under the face, in the same units as face_h.
    """
    aspect = FW / FH
    reach = 1 + below_chin / face_h                    # face + body, in face heights

    def end(size: float, top: float) -> float:
        return top + size * aspect * reach

    if end(DEFAULT_SIZE, DEFAULT_TOP) >= TARGET_END:
        return Framing(DEFAULT_SIZE, DEFAULT_TOP)
    # Grow the face and move it down by the same amount until the photo fills the frame.
    size = (TARGET_END - DEFAULT_TOP + DEFAULT_SIZE) / (1 + aspect * reach)
    size = min(max(size, DEFAULT_SIZE), MAX_SIZE)
    return Framing(size, DEFAULT_TOP + size - DEFAULT_SIZE)


def load_photo(path: str) -> Image.Image:
    img = Image.open(path)
    img = ImageOps.exif_transpose(img)                 # phone photos store rotation in EXIF
    img = img.convert("RGB")
    # The cut-out model works at ~1024 px anyway; a 12 MP original only costs memory.
    if max(img.size) > MAX_INPUT:
        k = MAX_INPUT / max(img.size)
        img = img.resize((round(img.width * k), round(img.height * k)), Image.LANCZOS)
    return img


def cut_out(img: Image.Image, model: str) -> Array:
    """RGBA uint8 array with the background removed."""
    import onnxruntime as ort                        # heavy imports, only when actually cutting
    from rembg import new_session, remove

    # Without the arena and pre-planned buffers the peak drops by several GB on BiRefNet.
    opts = ort.SessionOptions()
    opts.enable_cpu_mem_arena = False
    opts.enable_mem_pattern = False
    return np.array(remove(img, session=new_session(model, sess_opts=opts)))


def find_face(rgb: Array) -> tuple[int, int, int, int]:
    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
    casc = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    min_side = max(24, min(gray.shape) // 10)
    faces = casc.detectMultiScale(gray, scaleFactor=1.08, minNeighbors=6, minSize=(min_side, min_side))
    if len(faces) == 0:
        raise ValueError("no face found. Use a photo facing the camera, or pass --face x,y,w,h")
    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
    return int(x), int(y), int(w), int(h)


def frame_photo(path: str, model: str, framing: Framing | None = None,
                face_box: tuple[int, int, int, int] | None = None) -> Frame:
    img = load_photo(path)
    rgba = cut_out(img, model)
    x, y, w, h = face_box or find_face(rgba[..., :3])
    fr = framing or auto_framing(h, rgba.shape[0] - (y + h))

    fw = w / fr.size
    fh = fw * FH / FW
    fx = x + w / 2 - FACE_CX * fw
    fy = y - fr.top * fh
    s = FW / fw
    m = np.array([[s, 0, -fx * s], [0, s, -fy * s]], dtype=np.float32)
    out = cv2.warpAffine(rgba, m, (FW, FH), flags=cv2.INTER_AREA,
                         borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))
    out = out.astype(np.float32) / 255
    face = {"x": (x - fx) * s, "y": (y - fy) * s, "w": w * s, "h": h * s}
    return Frame(rgb=out[..., :3], alpha=out[..., 3], face=face, scale=s)
