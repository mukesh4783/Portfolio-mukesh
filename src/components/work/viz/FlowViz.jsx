import React, { useEffect, useMemo, useRef, useState } from 'react';
import useFrame from '../../../hooks/useFrame';
import useInView from '../../../hooks/useInView';
import useReducedMotion from '../../../hooks/useReducedMotion';
import { countByStage, initialQueue, STAGES, stepQueue } from '../../../lib/queue';
import { rng } from '../../../lib/random';

const W = 440;
const H = 214;
const COL_X = [62, 168, 274, 380];
const TOP = 70;
const GAP = 19;
const KIND_COLOR = { certificate: 'var(--green)', scheme: 'var(--blue)', service: 'var(--red)' };

const GREETINGS = [
  { lang: 'Hindi', text: 'नमस्ते! आपका प्रमाणपत्र "Approved" चरण में है।' },
  { lang: 'Punjabi', text: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਤੁਹਾਡੀ ਅਰਜ਼ੀ ਜਾਂਚ ਅਧੀਨ ਹੈ।' },
  { lang: 'English', text: 'Hi! Your scheme application was verified today.' },
];

/* Ease every token toward its slot in its stage column. Pure. */
function layout(state, dt) {
  const slots = STAGES.map(() => 0);
  const k = Math.min(1, dt * 9);
  const tokens = state.tokens.map((tk) => {
    const slot = slots[tk.stage];
    slots[tk.stage] += 1;
    const tx = COL_X[tk.stage] + (slot % 2 ? 9 : -9);
    const ty = TOP + Math.floor(slot / 2) * GAP + 10;
    const x = tk.x ?? COL_X[0] - 50;
    const y = tk.y ?? ty;
    return { ...tk, x: x + (tx - x) * k, y: y + (ty - y) * k };
  });
  return { ...state, tokens };
}

const advance = (s, dt, rand) => layout(stepQueue(s, dt, rand), dt);

/* Warm the simulation up so the figure never starts empty. */
function warmState() {
  const rand = rng(11);
  let s = initialQueue();
  for (let i = 0; i < 600; i += 1) s = advance(s, 1 / 60, rand);
  return { state: s, rand };
}

export default function FlowViz() {
  const warm = useMemo(warmState, []);
  const randRef = useRef(warm.rand);
  const [sim, setSim] = useState(warm.state);
  const [ref, inView] = useInView({ threshold: 0.05 });
  const reduced = useReducedMotion();
  const [bubble, setBubble] = useState(0);

  useFrame((dt) => setSim((s) => advance(s, dt, randRef.current)), inView && !reduced);

  useEffect(() => {
    if (!inView || reduced) return undefined;
    const id = setInterval(() => setBubble((b) => (b + 1) % GREETINGS.length), 3200);
    return () => clearInterval(id);
  }, [inView, reduced]);

  const counts = countByStage(sim.tokens);

  const avg = sim.issued ? sim.turnaround / sim.issued : 0;
  const g = GREETINGS[bubble];

  return (
    <div className="viz viz--flow" ref={ref}>
      <div className="flow__kpis">
        <div><span className="mono">issued</span><b>{sim.issued}</b></div>
        <div><span className="mono">in progress</span><b>{sim.tokens.length}</b></div>
        <div><span className="mono">avg turnaround</span><b>{avg.toFixed(1)}s</b></div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="viz__svg" role="img" aria-label="Citizen requests flowing through Submitted, Verified, Approved and Issued stages.">
        {STAGES.map((s, i) => (
          <g key={s}>
            <rect x={COL_X[i] - 44} y={TOP - 8} width="88" height={H - TOP - 4} rx="12" className="flow__lane" />
            <text x={COL_X[i]} y={24} textAnchor="middle" className="flow__stage">{s}</text>
            <rect x={COL_X[i] - 30} y={36} width="60" height="6" rx="3" className="flow__track" />
            <rect x={COL_X[i] - 30} y={36} width={Math.min(60, counts[i] * 6)} height="6" rx="3" className="flow__fill" />
            {i < STAGES.length - 1 && <path d={`M${COL_X[i] + 46},${TOP + 60} l10,0 m-4,-4 l4,4 l-4,4`} className="flow__arrow" />}
          </g>
        ))}
        {sim.tokens.map((t) => (
          <circle key={t.id} cx={t.x} cy={t.y} r="7.5" fill={KIND_COLOR[t.kind]} className="flow__tok" />
        ))}
      </svg>

      <div className="flow__foot">
        <ul className="flow__legend">
          {Object.entries(KIND_COLOR).map(([k, c]) => <li key={k}><i style={{ background: c }} />{k}</li>)}
        </ul>
        <div className="flow__bot" aria-live="off">
          <span className="mono flow__lang">Gemini bot · {g.lang}</span>
          <p key={bubble} className="flow__bubble">{g.text}</p>
        </div>
      </div>
    </div>
  );
}
