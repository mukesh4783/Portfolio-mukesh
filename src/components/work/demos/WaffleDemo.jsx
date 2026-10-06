import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

// Figures are from the project README (NCRB, 2018 to 2022).
const VIEWS = Object.freeze([
  { id: 'gender', label: 'By gender', cells: 100, filled: 72, text: 'Men account for roughly 70 to 73% of recorded cases.' },
  { id: 'states', label: 'Top 5 states', cells: 100, filled: 65, text: 'Five states account for about 65% of all cases.' },
  { id: 'growth', label: '2018 to 2022', cells: 127, filled: 100, extra: true, text: 'Recorded cases rose about 27.3% across five years.' },
]);

export default function WaffleDemo() {
  const reduce = useReducedMotion();
  const [view, setView] = useState(VIEWS[0]);

  return (
    <div className="mini-demo waffle">
      <div className="waffle__tabs" role="group" aria-label="Insight">
        {VIEWS.map((v) => (
          <button key={v.id} type="button" className="pill-btn" aria-pressed={view.id === v.id} onClick={() => setView(v)}>
            {v.label}
          </button>
        ))}
      </div>
      <div className="waffle__grid" role="img" aria-label={view.text}>
        {Array.from({ length: 130 }, (_, i) => {
          const present = i < view.cells;
          const tone = !present ? 'off' : i < view.filled ? 'on' : view.extra ? 'extra' : 'base';
          return (
            <motion.i
              key={i}
              className={`waffle__cell is-${tone}`}
              initial={false}
              animate={{ scale: present ? 1 : 0, opacity: present ? 1 : 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.3, delay: (i % 10) * 0.012 + Math.floor(i / 10) * 0.02 }}
            />
          );
        })}
      </div>
      <p className="waffle__text">{view.text}</p>
    </div>
  );
}
