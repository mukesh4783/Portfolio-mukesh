#!/usr/bin/env sh
# Rebuild the hero portrait from a photo: npm run portrait -- path/to/photo.jpg
# The first run creates a local Python env here, and the background-removal model
# (about 1 GB) downloads once into ~/.u2net or ~/.rembg.
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
venv="$here/.venv"
if [ ! -x "$venv/bin/python" ]; then
  echo "setting up the portrait tools (first run only) ..."
  python3 -m venv "$venv"
  "$venv/bin/pip" install --quiet --upgrade pip
  "$venv/bin/pip" install --quiet -r "$here/requirements.txt"
fi
if [ "${1:-}" = "--test" ]; then
  cd "$here" && exec "$venv/bin/python" -m pytest -q
fi
exec "$venv/bin/python" "$here/build.py" "$@"
