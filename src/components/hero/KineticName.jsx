import { useEffect, useLayoutEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { axes, falloff, variation } from '../../lib/kinetic.js';
import { useMedia } from '../../hooks/useMedia.js';

const RADIUS = 220;
const RANGE = Object.freeze({ wght: [640, 900], wdth: [76, 118] });
const REST = variation(axes(0, RANGE));
const EASE = [0.16, 1, 0.3, 1];

// One glyph. Its weight and width swell as the pointer gets close, measured
// against a page-space centre so scrolling does not throw the maths off.
function Glyph({ ch, index, px, py, centres, live }) {
  const ref = useRef(null);
  const settings = useTransform([px, py], ([x, y]) => {
    const c = centres.current[index];
    if (!live || !c) return REST;
    return variation(axes(falloff(Math.hypot(x - c.x, y - c.y), RADIUS), RANGE));
  });

  return (
    <span className="kn__mask" data-i={index} ref={ref}>
      <motion.span
        className="kn__ch"
        style={{ fontVariationSettings: settings }}
        variants={{ hidden: { y: '105%' }, shown: { y: '0%', transition: { duration: 0.9, ease: EASE, delay: 0.15 + index * 0.035 } } }}
      >
        {ch === ' ' ? ' ' : ch}
      </motion.span>
    </span>
  );
}

export default function KineticName({ first, last }) {
  const reduce = useReducedMotion();
  const fine = useMedia('(hover: hover) and (pointer: fine)');
  const live = fine && !reduce;
  const root = useRef(null);
  const centres = useRef([]);
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const px = useSpring(mx, { stiffness: 160, damping: 22, mass: 0.6 });
  const py = useSpring(my, { stiffness: 160, damping: 22, mass: 0.6 });

  // Measure glyph centres in page space; re-measure on resize and font load.
  useLayoutEffect(() => {
    const measure = () => {
      const els = root.current?.querySelectorAll('.kn__mask') ?? [];
      centres.current = [...els].map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + window.scrollX + r.width / 2, y: r.top + window.scrollY + r.height / 2 };
      });
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (!live) return undefined;
    const on = (e) => {
      mx.set(e.pageX);
      my.set(e.pageY);
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, [live, mx, my]);

  const lines = [first, last];
  let n = 0;
  return (
    <motion.h1
      ref={root}
      className="kn"
      aria-label={`${first} ${last}`}
      initial={reduce ? 'shown' : 'hidden'}
      animate="shown"
    >
      {lines.map((word) => (
        <span className="kn__line" aria-hidden="true" key={word}>
          {[...word].map((ch) => {
            const i = n;
            n += 1;
            return <Glyph key={i} ch={ch} index={i} px={px} py={py} centres={centres} live={live} />;
          })}
        </span>
      ))}
      <svg className="kn__under" viewBox="0 0 600 20" preserveAspectRatio="none" aria-hidden="true">
        <motion.path
          d="M4 13 C 90 6, 190 16, 300 10 S 500 6, 596 11"
          variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1, transition: { duration: 0.9, ease: EASE, delay: 1 } } }}
        />
      </svg>
    </motion.h1>
  );
}
