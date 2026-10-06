import React, { useMemo, useState } from 'react';
import useFrame from '../../../hooks/useFrame';
import useInView from '../../../hooks/useInView';
import useReducedMotion from '../../../hooks/useReducedMotion';
import { simulateStock } from '../../../lib/inventory';

const W = 300;
const H = 250;
const PAD = { l: 30, r: 10, t: 16, b: 26 };
const TICKS = 24;
const MAX = 32;
const REORDER = 10;
const PRICE = 45;
const DURATION = 12;

const sx = (t) => PAD.l + (t / TICKS) * (W - PAD.l - PAD.r);
const sy = (v) => PAD.t + (1 - v / MAX) * (H - PAD.t - PAD.b);

export default function StockViz() {
  const series = useMemo(
    () => simulateStock({ ticks: TICKS, start: 30, reorderAt: REORDER, restockTo: 30, sales: [3, 5, 2, 6, 4, 7, 3, 5] }),
    [],
  );
  const [ref, inView] = useInView({ threshold: 0.05 });
  const reduced = useReducedMotion();
  const [clock, setClock] = useState(reduced ? DURATION : 2.5);
  useFrame((dt) => setClock((c) => (c + dt) % (DURATION + 2)), inView && !reduced);

  const head = Math.min(TICKS, (clock / DURATION) * TICKS);
  const shown = series.filter((p) => p.t < head);

  /* Step path: stock holds flat within a tick, drops at the sale. */
  const d = shown.reduce((acc, p) => {
    const before = p.restock ? 30 : (series[p.t - 1]?.stock ?? 30);
    return `${acc}L${sx(p.t)},${sy(before)}L${sx(p.t)},${sy(p.stock)}L${sx(p.t + 1)},${sy(p.stock)}`;
  }, `M${sx(0)},${sy(30)}`);

  const lines = shown.flatMap((p) => [
    ...(p.restock ? [{ key: `r${p.t}`, kind: 'restock', text: 'RESTOCK → 30' }] : []),
    { key: `s${p.t}`, kind: 'sale', text: `A5 notebook ×${p.sold}`, amount: p.sold * PRICE },
  ]);
  const total = shown.reduce((s, p) => s + p.sold * PRICE, 0);
  const last = shown[shown.length - 1];

  return (
    <div className="viz viz--stock" ref={ref}>
      <div className="stock__chart">
        <p className="mono stock__title">stock · A5 notebook</p>
        <svg viewBox={`0 0 ${W} ${H}`} className="viz__svg" role="img" aria-label="Stock level stepping down with each sale and restocking below the reorder line.">
          {[0, 10, 20, 30].map((v) => (
            <g key={v}>
              <line x1={PAD.l} x2={W - PAD.r} y1={sy(v)} y2={sy(v)} className="stock__grid" />
              <text x={PAD.l - 6} y={sy(v) + 3} textAnchor="end" className="stock__tick">{v}</text>
            </g>
          ))}
          <line x1={PAD.l} x2={W - PAD.r} y1={sy(REORDER)} y2={sy(REORDER)} className="stock__reorder" />
          <text x={W - PAD.r} y={sy(REORDER) - 6} textAnchor="end" className="stock__rlabel">reorder level</text>
          <path d={`${d}L${sx(Math.min(head, shown.length))},${sy(0)}L${sx(0)},${sy(0)}Z`} className="stock__area" />
          <path d={d} className="stock__line" />
          {shown.filter((p) => p.restock).map((p) => (
            <g key={p.t} transform={`translate(${sx(p.t)} ${sy(30) - 8})`}>
              <path d="M0,-6 L5,2 L-5,2 Z" className="stock__up" />
            </g>
          ))}
          <line x1={sx(head)} x2={sx(head)} y1={PAD.t} y2={H - PAD.b} className="stock__head" />
          <text x={PAD.l} y={H - 6} className="stock__tick">day 1</text>
          <text x={W - PAD.r} y={H - 6} textAnchor="end" className="stock__tick">day {TICKS}</text>
        </svg>
        <p className="stock__now">on shelf: <b className="mono">{last ? last.stock : 30}</b></p>
      </div>

      <div className="stock__receipt" aria-label="Auto-generated bill">
        <p className="stock__rhead mono">BILL #{String(1000 + shown.length).padStart(5, '0')}</p>
        <ul>
          {lines.slice(-7).map((l) => (
            <li key={l.key} className={`mono is-${l.kind}`}>
              <span>{l.text}</span>
              {l.amount !== undefined && <span>₹{l.amount}</span>}
            </li>
          ))}
        </ul>
        <p className="stock__total mono"><span>TOTAL</span><span>₹{total.toLocaleString('en-IN')}</span></p>
      </div>
    </div>
  );
}
