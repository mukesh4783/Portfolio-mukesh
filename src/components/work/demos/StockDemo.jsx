import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Receipt } from '@phosphor-icons/react';

const W = 300;
const H = 96;
const FULL = 24;
const REORDER = 8;
const CATALOGUE = Object.freeze([
  { item: 'A4 notebook', price: 60, qty: 3 },
  { item: 'Gel pens, 5 pack', price: 45, qty: 5 },
  { item: 'Geometry box', price: 120, qty: 2 },
  { item: 'Sticky notes', price: 30, qty: 4 },
  { item: 'Highlighters', price: 55, qty: 6 },
]);

const START = Object.freeze({ stock: 18, history: [24, 21, 18], restocks: [], bill: [], n: 0, flash: false });
const WINDOW = 16;

/* One sale: stock drops, a bill line is written, and crossing the reorder
   line triggers an automatic restock. Pure. */
function sell(s) {
  const line = CATALOGUE[s.n % CATALOGUE.length];
  const after = Math.max(0, s.stock - line.qty);
  const restock = after <= REORDER;
  const history = restock ? [...s.history, after, FULL] : [...s.history, after];
  return {
    stock: restock ? FULL : after,
    history,
    restocks: restock ? [...s.restocks, history.length - 1] : s.restocks,
    bill: [{ ...line, id: s.n }, ...s.bill].slice(0, 3),
    n: s.n + 1,
    flash: restock,
  };
}

/* Pre-run a few sales so the line has history, then hand over a clean bill. */
const WARM = (() => {
  const s = Array.from({ length: 6 }).reduce((acc) => sell(acc), START);
  return { ...s, bill: [], flash: false };
})();

export default function StockDemo() {
  const [s, setS] = useState(WARM);
  const shown = s.history.slice(-WINDOW);
  const offset = s.history.length - shown.length;
  const marks = s.restocks.filter((r) => r >= offset).map((r) => r - offset);
  const x = (i) => 6 + (i / Math.max(1, shown.length - 1)) * (W - 12);
  const y = (v) => H - 8 - (v / FULL) * (H - 16);
  const d = shown.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
  const total = s.bill.reduce((a, b) => a + b.price * b.qty, 0);

  return (
    <div className="mini-demo stock">
      <svg viewBox={`0 0 ${W} ${H}`} className="plate__svg" role="img" aria-label={`Stock level ${s.stock} units. Restocks automatically at ${REORDER}.`}>
        <line x1="6" x2={W - 6} y1={y(REORDER)} y2={y(REORDER)} className="stock__reorder" />
        <text x={W - 6} y={y(REORDER) - 5} textAnchor="end" className="stock__label">reorder at {REORDER}</text>
        <path d={d} className="stock__line" />
        {marks.map((i) => (
          <circle key={i + offset} cx={x(i)} cy={y(FULL)} r="4" className="stock__dot" />
        ))}
      </svg>
      <div className="stock__row">
        <button type="button" className="pill-btn" onClick={() => setS(sell)}>
          <Receipt size={13} weight="bold" /> Ring up a sale
        </button>
        <span className="mono">
          stock <b>{s.stock}</b>
          <AnimatePresence>
            {s.flash && (
              <motion.span key={s.n} className="stock__flash" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {' '}restocked
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </div>
      <ul className="stock__bill mono" aria-live="polite">
        {s.bill.length === 0 && <li className="stock__empty">Bill is empty. Ring up a sale.</li>}
        {s.bill.map((b) => (
          <motion.li key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <span>{b.qty} x {b.item}</span>
            <span>Rs {b.price * b.qty}</span>
          </motion.li>
        ))}
        {s.bill.length > 0 && (
          <li className="stock__total">
            <span>Total</span>
            <span>Rs {total}</span>
          </li>
        )}
      </ul>
    </div>
  );
}
