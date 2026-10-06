import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from '@phosphor-icons/react';
import { useVisible } from '../../hooks/useVisible.js';

const PRINTS = Object.freeze([
  {
    id: 'manimax',
    href: '#manimax',
    title: 'Manimax',
    caption: 'A real render: one prompt in, Pythagoras chapter out.',
    video: '/media/manimax-pythagoras.mp4',
    poster: '/media/manimax-pythagoras.jpg',
  },
  {
    id: 'webrag',
    href: '#webrag',
    title: 'WebRAG',
    caption: 'Answering from a live Wikipedia page, with sources.',
    image: '/media/rag-answer.jpg',
  },
  {
    id: 'webrag-refuse',
    href: '#webrag',
    title: 'WebRAG',
    caption: 'Asked something off the page. It refuses instead of guessing.',
    image: '/media/rag-refuse.jpg',
  },
]);

const SLOTS = Object.freeze([
  { x: 0, y: 0, rotate: -2, scale: 1 },
  { x: 26, y: -22, rotate: 4, scale: 0.95 },
  { x: -22, y: -40, rotate: -6.5, scale: 0.9 },
]);
const INTERVAL = 4800;

function Media({ print, active, playing }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);

  if (print.video) {
    return (
      <video
        ref={ref}
        src={print.video}
        poster={print.poster}
        muted
        loop
        playsInline
        preload={active ? 'auto' : 'metadata'}
        aria-label={`${print.title} preview`}
      />
    );
  }
  return <img src={print.image} alt={`${print.title}: ${print.caption}`} loading="eager" />;
}

// A stack of proof prints of real project output. Every few seconds the top
// print is pulled off and slid to the back, like flipping through a portfolio.
export default function PreviewDeck() {
  const reduce = useReducedMotion();
  const [order, setOrder] = useState(() => PRINTS.map((p) => p.id));
  const [pulled, setPulled] = useState(null);
  const [hold, setHold] = useState(false);
  const [ref, visible] = useVisible({ threshold: 0.3 });

  const orderRef = useRef(order);
  orderRef.current = order;

  const next = useCallback(() => {
    const o = orderRef.current;
    setPulled(o[0]);
    setOrder([...o.slice(1), o[0]]);
  }, []);

  useEffect(() => {
    if (reduce || hold || !visible) return undefined;
    const id = window.setInterval(next, INTERVAL);
    return () => window.clearInterval(id);
  }, [reduce, hold, visible, next]);

  const top = PRINTS.find((p) => p.id === order[0]);

  return (
    <div className="deck" ref={ref} onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}>
      <div className="deck__stack">
        {PRINTS.map((p) => {
          const pos = order.indexOf(p.id);
          const slot = SLOTS[pos];
          const flying = p.id === pulled && pos === SLOTS.length - 1 && !reduce;
          return (
            <motion.a
              key={p.id}
              href={p.href}
              className={`print ${pos === 0 ? 'is-top' : ''}`}
              tabIndex={pos === 0 ? 0 : -1}
              aria-hidden={pos !== 0}
              initial={false}
              animate={
                flying
                  ? {
                      x: [0, 300, slot.x],
                      y: [0, -30, slot.y],
                      rotate: [-2, 14, slot.rotate],
                      scale: [1, 0.96, slot.scale],
                      zIndex: [10, 10, 1],
                    }
                  : { ...slot, zIndex: SLOTS.length - pos }
              }
              transition={flying ? { duration: 0.9, times: [0, 0.45, 1], ease: [0.65, 0, 0.35, 1] } : { type: 'spring', stiffness: 220, damping: 24 }}
            >
              <span className="print__frame">
                <Media print={p} active={pos === 0} playing={pos === 0 && visible && !reduce} />
                <span className="print__tone" aria-hidden="true" />
              </span>
              <span className="print__cap">
                <strong>{p.title}</strong>
                <span>{p.caption}</span>
              </span>
            </motion.a>
          );
        })}
      </div>

      <div className="deck__bar">
        <span className="deck__count mono" aria-live="polite">
          {String(PRINTS.indexOf(top) + 1).padStart(2, '0')} / {String(PRINTS.length).padStart(2, '0')}
        </span>
        <button type="button" className="deck__next mono" onClick={next}>
          Next print <ArrowRight size={14} weight="bold" />
        </button>
      </div>
    </div>
  );
}
