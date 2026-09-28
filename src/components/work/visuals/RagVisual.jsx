import React from 'react';
import Frame from '../Frame';
import useInView from '../../../hooks/useInView';
import useTicker, { useLoopCount } from '../../../hooks/useTicker';
import useTyped from '../../../hooks/useTyped';
import './RagVisual.css';

/* fetch → chunk → embed → retrieve → generate → hold */
const STEPS = [1500, 1500, 1700, 2400, 3400, 1200];
const STATUS = ['fetching page', 'chunking', 'embedding', 'retrieving', 'generating', 'grounded'];

const URL = 'docs.example.org/api/pricing';
const QUESTION = 'How are free-tier rate limits enforced?';
const ANSWER = 'Free-tier keys are capped at 60 requests/min using a sliding window; bursts over the cap return HTTP 429 with a Retry-After header.';

/* page lines: width %, which chunk(s) they belong to (overlap = two) */
const LINES = [
  { w: 62, c: [0], h: true }, { w: 94, c: [0] }, { w: 88, c: [0, 1] },
  { w: 72, c: [1] }, { w: 90, c: [1, 2] }, { w: 55, c: [2], h: true },
  { w: 84, c: [2] }, { w: 92, c: [2, 3] }, { w: 78, c: [3] }, { w: 66, c: [3, 4] }, { w: 86, c: [4] },
];
const CHUNKS = [
  { id: 'c1', x: 18, y: 16 }, { id: 'c2', x: 60, y: 24 }, { id: 'c3', x: 70, y: 46 },
  { id: 'c4', x: 50, y: 38 }, { id: 'c5', x: 28, y: 50 },
];
const CITED = [1, 3]; // c2, c4
const NEIGHBOURS = [{ i: 1, s: '0.91' }, { i: 3, s: '0.88' }, { i: 2, s: '0.79' }];
const QUERY = { x: 58, y: 34 };
/* other indexed chunks, fixed pseudo-random scatter */
const NOISE = Array.from({ length: 34 }, (_, i) => ({
  x: 6 + ((i * 37) % 88), y: 6 + ((i * 53 + 11) % 56),
}));

function RagScene({ step }) {
  const url = useTyped(URL, true, { speed: 30 });
  const q = useTyped(QUESTION, step >= 3, { speed: 28 });
  const a = useTyped(ANSWER, step >= 4, { speed: 16, delay: 300 });

  const chunked = step >= 1;
  const embedded = step >= 2;
  const retrieving = step >= 3;
  const answering = step >= 4;
  const y = (v) => `${(v / 64) * 100}%`;

  return (
    <div className={`rag s-${step}`}>
      {/* ── source page ── */}
      <div className="rag__src">
        <div className="rag__url"><span className="rag__lock">⌁</span>{url}<i className="rag__caret" /></div>
        <div className="rag__lines">
          {LINES.map((l, i) => {
            const cited = answering && l.c.some((c) => CITED.includes(c));
            const cls = [
              'rag__line', l.h && 'is-h', chunked && `ch-${l.c[0] % 2}`,
              chunked && l.c.length > 1 && 'is-overlap', cited && 'is-cited',
            ].filter(Boolean).join(' ');
            const firstOfChunk = l.c.length === 1 && LINES.findIndex((x) => x.c[0] === l.c[0]) === i;
            return (
              <span key={i} className={cls} style={{ '--w': `${l.w}%`, '--i': i }}>
                {chunked && firstOfChunk && <b className="rag__tag">{CHUNKS[l.c[0]].id}</b>}
              </span>
            );
          })}
        </div>
        <div className="rag__meta">
          <span>{chunked ? '5 chunks · 1000 / 200 overlap' : 'WebBaseLoader'}</span>
          <span className={`rag__hash${embedded ? ' is-on' : ''}`}>sha256 a3f9…e21 ✓ fresh</span>
        </div>
      </div>

      {/* ── vector space ── */}
      <div className="rag__vec">
        <span className="rag__vec-k">chroma · text-embedding-3-small</span>
        {NOISE.map((p, i) => (
          <span key={i} className="rag__noise" style={{ left: `${p.x}%`, top: y(p.y) }} />
        ))}
        {retrieving && (
          <>
            <span className="rag__radius" style={{ left: `${QUERY.x}%`, top: y(QUERY.y) }} />
            <svg viewBox="0 0 100 64" className="rag__svg" preserveAspectRatio="none" aria-hidden="true">
              {NEIGHBOURS.map((n) => (
                <line key={n.i} x1={QUERY.x} y1={QUERY.y} x2={CHUNKS[n.i].x} y2={CHUNKS[n.i].y}
                  className="rag__link" pathLength="1" />
              ))}
            </svg>
            {NEIGHBOURS.map((n) => (
              <span key={n.i} className="rag__sim"
                style={{ left: `${(QUERY.x + CHUNKS[n.i].x) / 2}%`, top: y((QUERY.y + CHUNKS[n.i].y) / 2) }}>
                {n.s}
              </span>
            ))}
          </>
        )}
        {CHUNKS.map((c, i) => (
          <span key={c.id}
            className={`rag__pt pt-${i % 2}${embedded ? ' is-on' : ''}${answering && CITED.includes(i) ? ' is-cited' : ''}`}
            style={{ left: `${c.x}%`, top: y(c.y), '--i': i }}>
            <i />{c.id}
          </span>
        ))}
        <span className={`rag__q${retrieving ? ' is-on' : ''}`} style={{ left: `${QUERY.x}%`, top: y(QUERY.y) }}>★</span>
      </div>

      {/* ── chat ── */}
      <div className="rag__chat">
        <p className="rag__ask"><span>Q</span>{q || <em>Ask about this page…</em>}</p>
        <p className={`rag__ans${answering ? ' is-on' : ''}`}>
          <span>A</span>
          <span className="rag__ans-text">
            {a}
            {a.length === ANSWER.length && <><sup>[c2]</sup><sup>[c4]</sup></>}
          </span>
        </p>
      </div>
    </div>
  );
}

export default function RagVisual() {
  const [ref, inView] = useInView({ threshold: 0.35 });
  const step = useTicker(STEPS, inView);
  const loop = useLoopCount(step);
  return (
    <div ref={ref} className="rv-host">
      <Frame title="webrag — streamlit" status={STATUS[step]} tone={step === 5 ? 'ok' : 'run'}>
        {inView || step > 0 ? <RagScene key={loop} step={step} /> : null}
      </Frame>
    </div>
  );
}
