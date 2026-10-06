import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MagnifyingGlassPlus } from '@phosphor-icons/react';
import { useVisible } from '../../hooks/useVisible.js';

const FRAMES = Object.freeze([
  { id: 'index', step: 'Index', src: '/media/rag-index.jpg', caption: 'Paste a URL. The page is chunked, embedded and indexed.' },
  { id: 'answer', step: 'Answer', src: '/media/rag-answer.jpg', caption: 'Ask a question. The answer comes back with its sources.' },
  { id: 'refuse', step: 'Refuse', src: '/media/rag-refuse.jpg', caption: 'Ask something off the page. It says it cannot find it.' },
  { id: 'diff', step: 'Diff', src: '/media/rag-diff.jpg', caption: 'The page changes. The hash catches it and shows the diff.' },
]);
const HOLD = 3800;

// Real screenshots of the running app, played as a reel with a slow push-in.
export default function RagReel({ onOpen }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const [ref, visible] = useVisible({ threshold: 0.3 });
  const frame = FRAMES[i];

  useEffect(() => {
    if (reduce || hold || !visible) return undefined;
    const id = window.setTimeout(() => setI((n) => (n + 1) % FRAMES.length), HOLD);
    return () => window.clearTimeout(id);
  }, [i, reduce, hold, visible]);

  return (
    <figure className="reel" ref={ref} onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}>
      <button type="button" className="reel__screen" onClick={() => onOpen({ type: 'image', src: frame.src, title: `WebRAG: ${frame.step}`, caption: frame.caption })} aria-label={`Enlarge screenshot: ${frame.caption}`}>
        <AnimatePresence initial={false}>
          <motion.img
            key={frame.id}
            src={frame.src}
            alt={`WebRAG app screenshot. ${frame.caption}`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: reduce ? 1 : 1.08, transition: { opacity: { duration: 0.6 }, scale: { duration: HOLD / 1000 + 1, ease: 'linear' } } }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
          />
        </AnimatePresence>
        <span className="reel__zoom mono">
          <MagnifyingGlassPlus size={14} weight="bold" /> Enlarge
        </span>
      </button>
      <ol className="reel__steps" aria-label="Screenshots">
        {FRAMES.map((f, n) => (
          <li key={f.id}>
            <button type="button" className={n === i ? 'is-on' : ''} aria-current={n === i} onClick={() => setI(n)}>
              <span className="mono">{String(n + 1).padStart(2, '0')}</span> {f.step}
              {n === i && !reduce && !hold && visible && (
                <motion.i key={`${f.id}-${i}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: HOLD / 1000, ease: 'linear' }} />
              )}
            </button>
          </li>
        ))}
      </ol>
      <figcaption className="reel__cap">{frame.caption}</figcaption>
    </figure>
  );
}
