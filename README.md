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

## Media

- `manimax-*.mp4`: 15 s muted loops cut from real Manimax renders. `*-full.mp4` are the full narrated renders shown in the modal.
- `rag-*.jpg`: screenshots of the running WebRAG app (index, answer, refusal, diff), cropped from the repo's `ragPhoto/`.
- `meme-cat.jpg`: the image the Meme Error extension shows.

## Notes

- The contact form posts to FormSubmit (`formsubmit.co/ajax/<email>`). The first submission sends a one-time confirmation email to that inbox.
- All motion respects `prefers-reduced-motion`. Looping demos and videos pause off-screen.
