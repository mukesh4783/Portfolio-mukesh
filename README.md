# Mukesh Kumar Pandey, portfolio

A "cyanotype" portfolio: Prussian-blue ink and a mint highlighter on cool paper in light mode, a navy blueprint in dark mode. Every featured project comes with a working demo or real output from the project itself.

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # logic tests (retrieval, request queue, stock, contact validation, kinetic type)
npm run build
```

## Where things live

| What | File |
| --- | --- |
| Name, links, stats, tape words | `src/data/profile.js` |
| Projects and their copy | `src/data/projects.js` |
| Toolkit tiles (exposure = depth of use) | `src/data/skills.js` |
| Education, training, commit log | `src/data/record.js` |
| Certificates | `src/data/credentials.js` |
| Colours, fonts, radii | `src/styles/tokens.css` |
| Real project media (videos, screenshots) | `public/media/` |
| Hero portrait (generated, see "Changing the profile picture") | `public/portrait/`, `src/components/hero/portrait/layout.json` |

## Media

- `manimax-*.mp4`: 15 s muted loops cut from real Manimax renders. `*-full.mp4` are the full narrated renders shown in the modal.
- `rag-*.jpg`: screenshots of the running WebRAG app (index, answer, refusal, diff), cropped from the repo's `ragPhoto/`.
- `meme-cat.jpg`: the image the Meme Error extension shows.

## Changing the profile picture

The hero portrait is generated from a photo by a script, so swapping it takes one command.

1. **Pick a photo.** Facing the camera, head and shoulders or more, face at least ~400 px wide. Any background works; it gets cut out. Photos that stop near the chin are framed tighter automatically.
2. **Drop it in `pfp/`**, e.g. `pfp/new-photo.jpg`. This folder is git-ignored, so raw photos never get committed.
3. **Generate the portrait:**

   ```bash
   npm run portrait -- pfp/new-photo.jpg
   ```

   File names with spaces need quotes: `npm run portrait -- "pfp/My Photo.jpeg"`.
4. **Check it:** `npm run dev`, open http://localhost:5173, look at it in light and dark mode, and hover it.
5. **Ship it:** commit the regenerated `public/portrait/` images and `src/components/hero/portrait/layout.json`, then push to `main` (which deploys to production).

What the script does: cuts you out, frames you on your face, recolours you in the site's inks, and rebuilds the data layer and the patch layout. It writes `public/portrait/{back,subject}-{light,dark}.webp` and `src/components/hero/portrait/layout.json`.

**First run:** it sets up a Python env in `tools/portrait/.venv` (needs Python 3.10+) and downloads the background-removal model (~1 GB) once. Later runs take about 30 s.

**If something is off:**

| Problem | Fix |
| --- | --- |
| The run gets killed, or the machine has under 8 GB free memory | add `--model u2net_human_seg` (lighter, slightly rougher hair edges) |
| Face too small, too big or too high in the frame | `--face-size 0.32 --face-top 0.24` (face width and top as fractions of the frame; defaults are about 0.29 and 0.20) |
| "no face found" | `--face x,y,w,h`, the face box in the photo's pixels |
| "the portrait will look soft" warning | use a larger or closer photo |

The inks in `tools/portrait/palette.py` mirror `src/styles/tokens.css`. If you change the site's colours, update both and rerun the script; `npm run portrait -- --test` fails if they drift apart.

## Notes

- The contact form posts to FormSubmit (`formsubmit.co/ajax/<email>`). The first submission sends a one-time confirmation email to that inbox.
- All motion respects `prefers-reduced-motion`. Looping demos and videos pause off-screen.
