"""Unit tests for the portrait pipeline (no model download needed): ./run.sh --test"""
import argparse
import json
import os
import re

import numpy as np
import pytest

from build import face_box, fraction
from framing import DEFAULT_SIZE, DEFAULT_TOP, FH, FW, MAX_SIZE, TARGET_END, Framing, auto_framing
from imaging import bottom_fade, hex2rgb, ramp
from palette import THEMES
from patches import COLS, P, ROWS, layout

TOKENS = os.path.join(os.path.dirname(__file__), "..", "..", "src", "styles", "tokens.css")
FACE = {"x": 384.0, "y": 256.0, "w": 297.0, "h": 297.0}


def person(bottom: int = FH) -> np.ndarray:
    """A head-and-shoulders silhouette: an ellipse head on a wide body."""
    y, x = np.mgrid[0:FH, 0:FW].astype(np.float32)
    head = ((x - 532) / 170) ** 2 + ((y - 400) / 210) ** 2 < 1
    body = (y > 560) & (np.abs(x - 520) < 120 + (y - 560) * 0.9)
    return ((head | body) & (y < bottom)).astype(np.float32)


class TestFraming:
    def test_tall_photo_keeps_default(self):
        assert auto_framing(900, 2100) == Framing(DEFAULT_SIZE, DEFAULT_TOP)

    def test_short_photo_is_framed_tighter_and_lower(self):
        f = auto_framing(590, 530)
        assert DEFAULT_SIZE < f.size <= MAX_SIZE
        assert f.top > DEFAULT_TOP

    def test_short_photo_is_stretched_to_reach_the_target(self):
        f = auto_framing(500, 700)                       # 1.4 face heights below the chin
        end = f.top + f.size * FW / FH * (1 + 700 / 500)
        assert f.size < MAX_SIZE
        assert end == pytest.approx(TARGET_END, abs=1e-6)

    def test_very_short_photo_is_capped(self):
        assert auto_framing(590, 100).size == MAX_SIZE


class TestImaging:
    def test_ramp_hits_its_stops(self):
        stops = THEMES["light"]["ramp"]
        out = ramp(np.array([0.0, 1.0], np.float32), stops)
        assert np.allclose(out[0], hex2rgb(stops[0][1]), atol=1e-6)
        assert np.allclose(out[1], hex2rgb(stops[-1][1]), atol=1e-6)

    def test_fade_runs_from_one_to_zero_below_the_chin(self):
        alpha = person()
        fade = bottom_fade(alpha, FACE)
        col = fade[:, 0]
        assert col[0] == 1 and col[-1] == 0
        assert np.all(np.diff(col) <= 1e-6)
        chin = int(FACE["y"] + FACE["h"])
        assert np.all(col[:chin] == 1)

    def test_short_photo_fades_out_before_it_ends(self):
        alpha = person(bottom=820)
        fade = bottom_fade(alpha, FACE)
        assert fade[815, 0] == pytest.approx(0, abs=1e-3)


class TestPalette:
    def test_ramps_melt_into_the_page(self):
        assert THEMES["light"]["ramp"][-1][1] == THEMES["light"]["paper"]
        assert THEMES["dark"]["ramp"][0][1] == THEMES["dark"]["paper"]

    @pytest.mark.parametrize("key", ["paper", "ink", "blue", "mint", "over"])
    def test_matches_tokens_css(self, key):
        css = open(TOKENS, encoding="utf-8").read()
        light = css.split("@media")[0]
        dark = css.split(":root[data-theme='dark']")[1]
        for theme, block in (("light", light), ("dark", dark)):
            m = re.search(rf"--{key}:\s*(#[0-9a-fA-F]{{6}})", block)
            assert m, f"--{key} missing from tokens.css ({theme})"
            assert m.group(1).lower() == THEMES[theme][key], f"{theme} --{key} drifted from tokens.css"


class TestPatches:
    def setup_method(self):
        alpha = person()
        self.data = layout(alpha, bottom_fade(alpha, FACE), FACE)

    def test_every_cell_is_used_once_and_in_range(self):
        cells = [tuple(c) for c in self.data["core"] + self.data["ghost"]] + [tuple(c[:2]) for c in self.data["loose"]]
        assert len(cells) == len(set(cells))
        assert all(0 <= i < ROWS and 0 <= j < COLS for i, j in cells)

    def test_face_stays_whole(self):
        core = {tuple(c) for c in self.data["core"]}
        i, j = int((FACE["y"] + FACE["h"] / 2) // P), int((FACE["x"] + FACE["w"] / 2) // P)
        assert (i, j) in core

    def test_lower_body_breaks_up(self):
        assert self.data["loose"], "expected some drifting patches"
        assert min(c[0] for c in self.data["loose"]) * P > FACE["y"] + FACE["h"]

    def test_attention_indexes_loose_patches(self):
        assert all(0 <= k < len(self.data["loose"]) for k in self.data["attn"])

    def test_is_deterministic_and_json_ready(self):
        alpha = person()
        again = layout(alpha, bottom_fade(alpha, FACE), FACE)
        assert json.dumps(again) == json.dumps(self.data)

    def test_rejects_a_wrong_frame_size(self):
        with pytest.raises(ValueError):
            layout(np.zeros((10, 10), np.float32), np.ones((10, 10), np.float32), FACE)


class TestArgs:
    def test_face_box_parses(self):
        assert face_box("1,2,30,40") == (1, 2, 30, 40)

    @pytest.mark.parametrize("bad", ["1,2,3", "a,b,c,d", "1,2,0,4", "-1,2,3,4"])
    def test_face_box_rejects(self, bad):
        with pytest.raises(argparse.ArgumentTypeError):
            face_box(bad)

    def test_fraction_bounds(self):
        parse = fraction(0.1, 0.5)
        assert parse("0.3") == 0.3
        with pytest.raises(argparse.ArgumentTypeError):
            parse("0.9")
