import { useMemo, useRef, useState } from 'react';
import { gaussian, rng } from '../../../lib/random.js';
import { isGrounded, topK } from '../../../lib/retrieval.js';

const W = 640;
const H = 330;
const SCALE = 220;
const THRESHOLD = 0.6;
const K = 3;

const TOPICS = Object.freeze([
  { id: 'admissions', label: 'Admissions', cx: 140, cy: 92, color: 'var(--blue)', text: ['fee for 2026', 'eligibility', 'deadlines', 'documents'] },
  { id: 'courses', label: 'Courses', cx: 480, cy: 88, color: 'var(--over)', text: ['B.Tech CSE', 'electives', 'credits', 'syllabus'] },
  { id: 'campus', label: 'Campus', cx: 486, cy: 244, color: 'var(--mint-text)', text: ['hostels', 'library hours', 'transport', 'clubs'] },
  { id: 'faq', label: 'FAQ', cx: 150, cy: 248, color: 'var(--ink-3)', text: ['refund policy', 'contact office', 'scholarships', 'results'] },
]);

const QUESTIONS = Object.freeze([
  { label: 'What is the admission fee?', x: 128, y: 80 },
  { label: 'Which electives exist?', x: 500, y: 100 },
  { label: 'What is Python?', x: 318, y: 168 },
]);

function makeChunks() {
  const rand = rng(7);
  return TOPICS.flatMap((t, ti) =>
    Array.from({ length: 7 }, (_, i) => ({
      id: ti * 7 + i + 1,
      color: t.color,
      text: t.text[i % t.text.length],
      x: t.cx + gaussian(rand) * 30,
      y: t.cy + gaussian(rand) * 20,
    })),
  );
}

const clampTo = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Retrieval in a 2-D embedding plane: the query pulls its top 3 chunks, and
// when even the best one is too far away the bot refuses to answer.
export default function RetrievalDemo() {
  const chunks = useMemo(makeChunks, []);
  const [query, setQuery] = useState(QUESTIONS[0]);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef(null);

  const hits = topK(chunks, query, K, SCALE);
  const grounded = isGrounded(hits, THRESHOLD);
  const hitIds = new Set(hits.map((h) => h.id));
  const cited = hits.filter((h) => h.score >= THRESHOLD);

  const moveTo = (e) => {
    const r = svgRef.current.getBoundingClientRect();
    setQuery({
      label: null,
      x: clampTo(((e.clientX - r.left) / r.width) * W, 12, W - 12),
      y: clampTo(((e.clientY - r.top) / r.height) * H, 12, H - 12),
    });
  };

  const nudge = (e) => {
    const step = { ArrowLeft: [-14, 0], ArrowRight: [14, 0], ArrowUp: [0, -14], ArrowDown: [0, 14] }[e.key];
    if (!step) return;
    e.preventDefault();
    setQuery((q) => ({ label: null, x: clampTo(q.x + step[0], 12, W - 12), y: clampTo(q.y + step[1], 12, H - 12) }));
  };

  return (
    <div className="plate rag">
      <div className="plate__bar">
        <span className="mono">
          <strong>Embedding space</strong> Mock University site, 28 chunks
        </span>
        <div className="rag__qs" role="group" aria-label="Example questions">
          {QUESTIONS.map((q) => (
            <button key={q.label} type="button" className="pill-btn" aria-pressed={query.label === q.label} onClick={() => setQuery(q)}>
              {q.label}
            </button>
          ))}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="plate__svg rag__svg"
        role="img"
        aria-label={`The query retrieves its ${K} nearest chunks. ${grounded ? 'The answer is grounded.' : 'Nothing is close enough, so the bot refuses.'}`}
        onPointerMove={(e) => dragging && moveTo(e)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        {TOPICS.map((t) => (
          <text key={t.id} x={t.cx} y={t.cy - 46} textAnchor="middle" className="rag__topic">
            {t.label}
          </text>
        ))}
        <circle cx={query.x} cy={query.y} r={(1 - THRESHOLD) * SCALE} className={`rag__reach ${grounded ? '' : 'is-miss'}`} />
        {hits.map((h) => (
          <line key={`l${h.id}`} x1={query.x} y1={query.y} x2={h.x} y2={h.y} className={`rag__link ${h.score >= THRESHOLD ? '' : 'is-weak'}`} />
        ))}
        {chunks.map((c) => (
          <circle key={c.id} cx={c.x} cy={c.y} r={hitIds.has(c.id) ? 7 : 4.5} style={{ fill: c.color }} className={`rag__chunk ${hitIds.has(c.id) ? 'is-hit' : ''}`} />
        ))}
        <g
          className="rag__query"
          transform={`translate(${query.x} ${query.y})`}
          tabIndex={0}
          role="slider"
          aria-label="Query position. Drag it, or use the arrow keys."
          aria-valuetext={grounded ? 'grounded' : 'out of scope'}
          onKeyDown={nudge}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture?.(e.pointerId);
            setDragging(true);
          }}
        >
          <circle r="22" className="rag__grab" />
          <circle r="10" className="rag__q" />
          <path d="M-4,0H4M0,-4V4" className="rag__qx" />
        </g>
        <text x={W - 12} y={H - 12} textAnchor="end" className="rag__hint">drag the query</text>
      </svg>

      <div className="plate__foot rag__foot" aria-live="polite">
        <span className={`rag__verdict ${grounded ? 'is-ok' : 'is-no'}`}>
          {grounded
            ? `Answer drafted from ${cited.map((h) => `#${h.id}`).join(', ')}, with sources.`
            : '"I couldn\'t find that information in the indexed pages."'}
        </span>
        <span className="mono rag__hits">
          {hits.map((h) => (
            <span key={h.id}>
              #{h.id} {h.text} <b>{h.score.toFixed(2)}</b>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
