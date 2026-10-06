import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { ArrowDownRight } from '@phosphor-icons/react';
import { useMedia } from '../../hooks/useMedia.js';
import { simulateStock } from '../../lib/inventory.js';
import PipelineDemo from './demos/PipelineDemo.jsx';

function StockSpark() {
  const series = useMemo(() => simulateStock({ ticks: 26, start: 24, reorderAt: 8, restockTo: 24, sales: [3, 5, 2, 4, 6, 3] }), []);
  const d = series.map((p, i) => `${i ? 'L' : 'M'}${(8 + i * 11.4).toFixed(1)},${(150 - p.stock * 5).toFixed(1)}`).join('');
  return (
    <svg viewBox="0 0 300 170" className="wi__spark" aria-hidden="true">
      <line x1="8" x2="292" y1={150 - 8 * 5} y2={150 - 8 * 5} />
      <path d={d} />
    </svg>
  );
}

function WaffleMini() {
  return (
    <span className="wi__waffle" aria-hidden="true">
      {Array.from({ length: 100 }, (_, i) => (
        <i key={i} className={i < 72 ? 'on' : ''} />
      ))}
    </span>
  );
}

const PREVIEW = Object.freeze({
  webrag: () => <img src="/media/rag-answer.jpg" alt="" />,
  manimax: () => <video src="/media/manimax-lens.mp4" poster="/media/manimax-lens.jpg" muted loop playsInline autoPlay />,
  gramsetu: () => <PipelineDemo compact />,
  billing: () => <StockSpark />,
  meme: () => <img src="/media/meme-cat.jpg" alt="" className="wi__meme" />,
  ncrb: () => <WaffleMini />,
});

// The table of contents for the work. On a mouse, a live preview of the
// project trails the cursor; on touch, each row simply jumps to its project.
export default function WorkIndex({ rows }) {
  const reduce = useReducedMotion();
  const fine = useMedia('(hover: hover) and (pointer: fine)');
  const [hot, setHot] = useState(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.5 });
  const y = useSpring(my, { stiffness: 260, damping: 28, mass: 0.5 });
  const showPreview = fine && !reduce;

  const onMove = (e) => {
    mx.set(e.clientX);
    my.set(e.clientY);
  };

  const Preview = hot ? PREVIEW[hot] : null;

  return (
    <div className="wi" onPointerMove={showPreview ? onMove : undefined} onPointerLeave={() => setHot(null)}>
      <ol className="wi__list">
        {rows.map((r, i) => (
          <li key={r.id}>
            <a href={`#${r.id}`} className={`wi__row ${hot === r.id ? 'is-hot' : ''}`} onPointerEnter={() => setHot(r.id)} onFocus={() => setHot(null)}>
              <span className="wi__n mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="wi__name">{r.name}</span>
              <span className="wi__kicker">{r.kicker}</span>
              <span className="wi__date mono">{r.date}</span>
              <ArrowDownRight className="wi__arrow" size={22} weight="bold" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>

      {showPreview && (
        <motion.div className="wi__float" style={{ x, y }} aria-hidden="true">
          <AnimatePresence mode="popLayout">
            {Preview && (
              <motion.div
                key={hot}
                className="wi__card"
                initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                exit={{ opacity: 0, scale: 0.9, rotate: 4 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              >
                <Preview />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
