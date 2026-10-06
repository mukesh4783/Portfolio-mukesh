# Mukesh Kumar Pandey — Portfolio

React + Vite. No UI or chart libraries: every figure is hand-written SVG driven by small, tested math modules.

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # unit tests for the math behind the figures
npm run build    # static site in dist/
```

## Editing content

All content lives in `src/data/`:

| File | What's in it |
| --- | --- |
| `profile.js` | Name, status line, email, links, the `describe()` summary numbers, About text |
| `projects.js` | The four projects — copy, metrics, stack, repo links (currently point to the GitHub profile; swap in exact repo URLs) |
| `skills.js` | Toolbox groups and methods |
| `timeline.js` | Swimlane events (dates as fractional years, e.g. `2026.52` ≈ Jul 2026) and training notes |

## How the figures work

| Figure | Component | Logic (tested) |
| --- | --- | --- |
| Hero regression playground | `components/hero/FitPlayground.jsx` | `lib/regression.js` — polynomial least squares + 95% CI band |
| WebRAG retrieval | `components/work/viz/RetrievalViz.jsx` | `lib/retrieval.js` — top-k + grounding threshold |
| GramSetu request flow | `components/work/viz/FlowViz.jsx` | `lib/queue.js` — staged queue simulation |
| Manimax morph | `components/work/viz/MorphViz.jsx` | `lib/curves.js` — sampled curve interpolation |
| Inventory stock + bill | `components/work/viz/StockViz.jsx` | `lib/inventory.js` — stock / reorder simulation |
| Timeline swimlanes | `components/record/Timeline.jsx` | `lib/timeline.js` — overlap stacking |

Animations pause when off-screen and respect `prefers-reduced-motion`.
