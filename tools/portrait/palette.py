"""Inks for the portrait, copied from src/styles/tokens.css. Keep the two in step."""

THEMES = {
    "light": {
        "paper": "#eef3f2",
        "ink": "#0d1b2a",
        "blue": "#1f4fa0",
        "mint": "#2fd3a5",
        "over": "#0e7f86",
        # Positive tone ramp: shadows are ink, highlights are the paper itself.
        "ramp": [(0.0, "#0d1b2a"), (0.28, "#173a78"), (0.52, "#2f5fae"), (0.78, "#9db6db"), (1.0, "#eef3f2")],
    },
    "dark": {
        "paper": "#0b1a30",
        "ink": "#e6eef7",
        "blue": "#6fa8ff",
        "mint": "#3ee6b5",
        "over": "#8fe3e6",
        # Shadows sink into the navy page, highlights are pale blueprint ink.
        "ramp": [(0.0, "#0b1a30"), (0.3, "#16365f"), (0.58, "#3f78c8"), (0.84, "#a6c8fb"), (1.0, "#eef5fc")],
    },
}
