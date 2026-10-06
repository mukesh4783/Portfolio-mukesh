import React, { useMemo, useRef, useState } from 'react';
import { gaussian, rng } from '../../../lib/random';
import { isGrounded, topK } from '../../../lib/retrieval';

const W = 440;
const H = 300;
const SCALE = 190;
const THRESHOLD = 0.62;

const TOPICS = [
  { id: 'setup', label: 'Setup', cx: 110, cy: 90, color: 'var(--blue)', text: ['pip install the package', 'set OPENAI_API_KEY', 'create a Chroma client', 'load your first URL'] },
  { id: 'pricing', label: 'Pricing', cx: 330, cy: 80, color: 'var(--red)', text: ['free tier limits', 'pay-as-you-go rates', 'team plan seats', 'billing FAQ'] },
  { id: 'api', label: 'API', cx: 320, cy: 220, color: 'var(--green)', text: ['query() parameters', 'top_k and filters', 'embedding dimensions', 'rate limits'] },
  { id: 'faq', label: 'FAQ', cx: 110, cy: 220, color: 'var(--yellow)', text: ['is my data stored?', 'supported languages', 'refresh schedule', 'contacting support'] },
];

const QUERIES = [
  { label: 'How do I install it?', x: 96, y: 76 },
  { label: 'What does it cost?', x: 342, y: 96 },
  { label: 'Who won the 2022 World Cup?', x: 220, y: 152 },
];

function makeChunks() {
  const rand = rng(42);
  return TOPICS.flatMap((t, ti) => Array.from({ length: 8 }, (_, i) => ({
    id: ti * 8 + i + 1,
    topic: t.id,
    color: t.color,
    text: t.text[i % t.text.length],
    x: t.cx + gaussian(rand) * 24,
    y: t.cy + gaussian(rand) * 20,
  })));
}

export default function RetrievalViz() {
  const chunks = useMemo(makeChunks, []);
  const [query, setQuery] = useState(QUERIES[0]);
  const [k, setK] = useState(3);
  const [drag, setDrag] = useState(false);
  const svgRef = useRef(null);

  const hits = topK(chunks, query, k, SCALE);
  const grounded = isGrounded(hits, THRESHOLD);
  const hitIds = new Set(hits.map((h) => h.id));

  const onMove = (e) => {
    if (!drag) return;
    const r = svgRef.current.getBoundingClientRect();
    const x = Math.min(W - 8, Math.max(8, ((e.clientX - r.left) / r.width) * W));
    const y = Math.min(H - 8, Math.max(8, ((e.clientY - r.top) / r.height) * H));
    setQuery({ label: 'Your custom query', x, y });
  };

  return (
    <div className="viz viz--rag">
      <div className="viz__chips" role="group" aria-label="Example questions">
        {QUERIES.map((q) => (
          <button key={q.label} type="button" className={`viz__q ${query.label === q.label ? 'is-on' : ''}`} onClick={() => setQuery(q)}>
            {q.label}
          </button>
        ))}
      </div>

      <svg
        ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="viz__svg"
        role="img" aria-label={`Embedding space. The query retrieves ${k} nearest chunks. ${grounded ? 'Answer is grounded.' : 'No chunk is close enough, so the bot declines to answer.'}`}
        onPointerMove={onMove} onPointerUp={() => setDrag(false)} onPointerLeave={() => setDrag(false)}
      >
        <circle cx={query.x} cy={query.y} r={(1 - THRESHOLD) * SCALE} className="rag__radius" />
        <text x="214" y="292" textAnchor="middle" className="rag__hint">drag the ★ anywhere</text>
        {TOPICS.map((t) => (
          <text key={t.id} x={t.cx} y={t.cy - 48} textAnchor="middle" className="rag__topic" fill={t.color}>{t.label}</text>
        ))}
        {hits.map((h) => (
          <line key={`l${h.id}`} x1={query.x} y1={query.y} x2={h.x} y2={h.y} className={`rag__link ${grounded ? '' : 'is-weak'}`} />
        ))}
        {chunks.map((c) => (
          <circle
            key={c.id} cx={c.x} cy={c.y} r={hitIds.has(c.id) ? 7 : 4.5}
            fill={c.color} className={`rag__chunk ${hitIds.has(c.id) ? 'is-hit' : ''}`}
          />
        ))}
        <g
          transform={`translate(${query.x} ${query.y})`} className="rag__query"
          onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); setDrag(true); }}
        >
          <circle r="18" fill="transparent" />
          <path d="M0,-11 L3.2,-3.4 L11,-3.4 L4.8,1.6 L7,9.6 L0,5 L-7,9.6 L-4.8,1.6 L-11,-3.4 L-3.2,-3.4 Z" />
        </g>
      </svg>

      <div className="rag__panel">
        <div className="rag__k">
          <label htmlFor="rag-k" className="mono">top_k = {k}</label>
          <input id="rag-k" type="range" min="1" max="6" value={k} onChange={(e) => setK(Number(e.target.value))} />
        </div>
        <ol className="rag__hits">
          {hits.map((h) => (
            <li key={h.id}>
              <span className="rag__dot" style={{ background: h.color }} />
              <span className="rag__text">#{h.id} {h.text}</span>
              <span className="rag__bar"><i style={{ width: `${Math.round(h.score * 100)}%` }} /></span>
              <span className="mono rag__score">{h.score.toFixed(2)}</span>
            </li>
          ))}
        </ol>
        <p className={`rag__verdict ${grounded ? 'is-ok' : 'is-no'}`} aria-live="polite">
          {grounded
            ? <>✓ Answer drafted from chunks {hits.filter((h) => h.score >= THRESHOLD).map((h) => `#${h.id}`).join(', ')} — with citations.</>
            : <>✗ Nothing on this page is close enough. “I can’t find that on the page.” No guessing.</>}
        </p>
      </div>
    </div>
  );
}
