import React, { useMemo, useState } from 'react';
import useFrame from '../../../hooks/useFrame';
import useInView from '../../../hooks/useInView';
import useReducedMotion from '../../../hooks/useReducedMotion';
import { CURVES, morph, sample, toPath } from '../../../lib/curves';
import { clamp, easeInOut } from '../../../lib/random';

const W = 440;
const H = 230;
const X0 = -4;
const X1 = 4;
const sx = (x) => 20 + ((x - X0) / (X1 - X0)) * (W - 40);
const sy = (y) => H / 2 - y * 70;

const PROMPTS = [
  'explain what a sine wave is',
  'why is the bell curve everywhere?',
  'show me how x³ grows',
  'how does a sigmoid squash numbers?',
];
const NARRATION = [
  'The sine wave repeats every 2π — a perfect cycle.',
  'Most values cluster near the mean; the tails fade fast.',
  'Negative inputs flip sign, and growth accelerates.',
  'Any input, however large, lands between −1 and 1.',
];
const STEPS = ['Plan', 'Script', 'Narrate', 'Render'];
const CYCLE = 6.4;

/* One cycle: type prompt → light up pipeline → morph → hold with narration. */
function phase(t) {
  return {
    typed: clamp(t / 1.3, 0, 1),
    step: clamp(Math.floor((t - 1.3) / 0.3), -1, STEPS.length),
    morph: easeInOut(clamp((t - 2.5) / 1.2, 0, 1)),
    narrate: clamp((t - 3.4) / 1.4, 0, 1),
  };
}

export default function MorphViz() {
  const samples = useMemo(() => CURVES.map((c) => sample(c.f, X0, X1, 120)), []);
  const [ref, inView] = useInView({ threshold: 0.05 });
  const reduced = useReducedMotion();
  const [clock, setClock] = useState(reduced ? CYCLE - 0.01 : 0);

  useFrame((dt) => setClock((c) => (c + dt) % (CYCLE * CURVES.length)), inView && !reduced);

  const idx = Math.floor(clock / CYCLE) % CURVES.length;
  const prev = (idx + CURVES.length - 1) % CURVES.length;
  const p = phase(clock % CYCLE);
  const path = toPath(morph(samples[prev], samples[idx], p.morph), sx, sy);
  const prompt = PROMPTS[idx].slice(0, Math.round(PROMPTS[idx].length * p.typed));
  const narration = NARRATION[idx].slice(0, Math.round(NARRATION[idx].length * p.narrate));

  return (
    <div className="viz viz--morph" ref={ref}>
      <div className="morph__prompt">
        <span className="mono morph__caret">prompt ›</span>
        <span className="morph__typed">{prompt}<i className="morph__cursor" /></span>
      </div>

      <ol className="morph__steps">
        {STEPS.map((s, i) => (
          <li key={s} className={p.step >= i ? 'is-on' : ''}><span className="mono">{String(i + 1).padStart(2, '0')}</span>{s}</li>
        ))}
      </ol>

      <svg viewBox={`0 0 ${W} ${H}`} className="viz__svg" role="img" aria-label={`Animated maths explainer morphing into ${CURVES[idx].label}`}>
        {Array.from({ length: 9 }, (_, i) => X0 + i).map((x) => (
          <line key={`v${x}`} x1={sx(x)} x2={sx(x)} y1="8" y2={H - 8} className={x === 0 ? 'morph__axis' : 'morph__grid'} />
        ))}
        {[-1.5, -1, -0.5, 0, 0.5, 1, 1.5].map((y) => (
          <line key={`h${y}`} x1="20" x2={W - 20} y1={sy(y)} y2={sy(y)} className={y === 0 ? 'morph__axis' : 'morph__grid'} />
        ))}
        <path d={path} className="morph__curve" />
        <text x={W - 24} y="28" textAnchor="end" className="morph__label" style={{ opacity: p.morph }}>{CURVES[idx].label}</text>
        <text x={W - 24} y="28" textAnchor="end" className="morph__label" style={{ opacity: 1 - p.morph }}>{CURVES[prev].label}</text>
      </svg>

      <p className="morph__sub">{narration || ' '}</p>
      <code className="morph__code mono">self.play(Transform({CURVES[prev].id}_graph, {CURVES[idx].id}_graph))</code>
    </div>
  );
}
