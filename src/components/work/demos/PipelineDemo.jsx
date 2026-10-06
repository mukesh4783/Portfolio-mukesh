import { useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Plus } from '@phosphor-icons/react';
import { useFrame } from '../../../hooks/useFrame.js';
import { useVisible } from '../../../hooks/useVisible.js';
import { countByStage, initialQueue, KINDS, raiseRequest, STAGES, stepQueue } from '../../../lib/queue.js';
import { rng } from '../../../lib/random.js';

const W = 640;
const H = 250;
const COL_W = 132;
const COL_X = STAGES.map((_, i) => 22 + COL_W / 2 + i * ((W - 44 - COL_W) / (STAGES.length - 1)));
const TOP = 62;
const ROW = 24;
const KIND_COLOR = Object.freeze({ certificate: 'var(--blue)', scheme: 'var(--over)', service: 'var(--mint)' });

/* Ease every token toward its slot in its stage column. Pure. */
function layout(state, dt) {
  const slots = STAGES.map(() => 0);
  const k = Math.min(1, dt * 8);
  const tokens = state.tokens.map((tk) => {
    const slot = slots[tk.stage];
    slots[tk.stage] += 1;
    const tx = COL_X[tk.stage] + ((slot % 4) - 1.5) * 26;
    const ty = TOP + 22 + Math.floor(slot / 4) * ROW;
    const x = tk.x ?? COL_X[0] - 110;
    const y = tk.y ?? ty;
    return { ...tk, x: x + (tx - x) * k, y: y + (ty - y) * k };
  });
  return { ...state, tokens };
}

const advance = (s, dt, rand) => layout(stepQueue(s, dt, rand), dt);

function warm() {
  const rand = rng(11);
  let s = initialQueue();
  for (let i = 0; i < 600; i += 1) s = advance(s, 1 / 60, rand);
  return { state: s, rand };
}

// Requests flowing Submitted -> Verified -> Approved -> Issued, the same
// view GramSetu's admin dashboard is built on. Visitors can file their own.
export default function PipelineDemo({ compact = false }) {
  const start = useMemo(warm, []);
  const randRef = useRef(start.rand);
  const [sim, setSim] = useState(start.state);
  const [ref, visible] = useVisible();
  const reduce = useReducedMotion();

  useFrame((dt) => setSim((s) => advance(s, dt, randRef.current)), visible && !reduce);

  const raise = (kind) => setSim((s) => layout(raiseRequest(s, kind, randRef.current), 0));
  const counts = countByStage(sim.tokens);
  const avg = sim.issued ? sim.turnaround / sim.issued : 0;

  const svg = (
    <svg viewBox={`0 0 ${W} ${H}`} className="plate__svg" role="img" aria-label="Citizen requests moving through Submitted, Verified, Approved and Issued.">
      {STAGES.map((s, i) => (
        <g key={s}>
          <rect x={COL_X[i] - COL_W / 2} y={TOP} width={COL_W} height={H - TOP - 12} rx="10" className="flow__lane" />
          <text x={COL_X[i] - COL_W / 2 + 2} y={28} className="flow__stage">{s}</text>
          <text x={COL_X[i] - COL_W / 2 + 2} y={48} className="flow__count">{counts[i]} open</text>
          {i < STAGES.length - 1 && <path d={`M${COL_X[i] + COL_W / 2 + 3},${TOP + 40} l8,0 m-4,-4 l4,4 l-4,4`} className="flow__arrow" />}
        </g>
      ))}
      {sim.tokens.map((t) => (
        <rect key={t.id} x={t.x - 9} y={t.y - 8} width="18" height="16" rx="4" style={{ fill: KIND_COLOR[t.kind] }} className="flow__tok" />
      ))}
    </svg>
  );

  if (compact) return <div ref={ref} className="flow--compact">{svg}</div>;

  return (
    <div className="plate flow" ref={ref}>
      <div className="plate__bar">
        <span className="mono">
          <strong>Request tracker</strong> {sim.issued} issued, avg turnaround {avg.toFixed(1)}s
        </span>
        <div className="flow__raise" role="group" aria-label="Raise a request">
          {KINDS.map((k) => (
            <button key={k} type="button" className="pill-btn" onClick={() => raise(k)}>
              <i style={{ background: KIND_COLOR[k] }} aria-hidden="true" />
              <Plus size={11} weight="bold" /> {k}
            </button>
          ))}
        </div>
      </div>
      {svg}
      <p className="plate__foot mono">File a request and watch it move through verification and approval.</p>
    </div>
  );
}
