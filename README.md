# Mukesh Kumar Pandey — Portfolio

React + Vite. No UI or animation libraries — CSS, SVG and canvas only.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

## Editing content

All content lives in `src/data/` — search for `TODO` to find placeholders.

| File | What's in it |
| --- | --- |
| `profile.js` | Name, thesis, email, socials (LeetCode handle is TODO), photo path, "at a glance" stats, about text |
| `projects.js` | The four projects: repo/demo URLs (TODO), metrics, pipeline steps, write-ups |
| `skills.js` | Toolkit groups and methods |
| `record.js` | Timeline, certificate links (TODO), LeetCode/GitHub numbers (**placeholder values**), education |

- **Photo:** put a portrait in `public/images/` and set `photo: '/images/you.jpg'` in `profile.js`.
- **CV:** replace `public/Mukesh_Kumar_Pandey_CV.pdf`.
- **Icons:** tech names map to logos in `src/components/TechIcon.jsx`; unknown names fall back to a monogram.
- **Project animations:** `src/components/work/visuals/` — one file per project, driven by the step timings at the top of each file.
