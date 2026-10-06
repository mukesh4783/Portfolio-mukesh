import { useEffect, useLayoutEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { ArrowUp } from '@phosphor-icons/react';
import { profile } from '../../data/profile.js';
import { axes, falloff, variation } from '../../lib/kinetic.js';
import { useVisible } from '../../hooks/useVisible.js';
import './footer.css';

const WORD = profile.first.toUpperCase();
const RANGE = Object.freeze({ wght: [300, 900], wdth: [60, 130] });

// One outlined letter that inks in and swells as the pointer passes over it.
function Letter({ ch, index, px, centres, radius }) {
  const t = useTransform(px, (x) => {
    const c = centres.current[index];
    return c == null ? 0 : falloff(Math.abs(x - c), radius.current);
  });
  const settings = useTransform(t, (v) => variation(axes(v, RANGE)));
  const fill = useTransform(t, (v) => `color-mix(in oklab, var(--blue) ${Math.round(v * 100)}%, transparent)`);
  return (
    <motion.span className="ft__ch" style={{ fontVariationSettings: settings, color: fill }}>
      {ch}
    </motion.span>
  );
}

export default function Footer() {
  const reduce = useReducedMotion();
  const word = useRef(null);
  const centres = useRef([]);
  const radius = useRef(200);
  const mx = useMotionValue(-9999);
  const px = useSpring(mx, { stiffness: 140, damping: 20 });
  const [shell, visible] = useVisible();

  useLayoutEffect(() => {
    const measure = () => {
      const els = word.current?.querySelectorAll('.ft__ch') ?? [];
      centres.current = [...els].map((el) => {
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2;
      });
      radius.current = Math.max(160, (word.current?.getBoundingClientRect().width ?? 800) / 4);
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Without a pointer, a slow wave rolls across the word instead.
  useEffect(() => {
    if (reduce || !visible || window.matchMedia('(hover: hover)').matches) return undefined;
    let raf = 0;
    const tick = (now) => {
      const xs = centres.current;
      if (xs.length) {
        const span = xs[xs.length - 1] - xs[0];
        mx.set(xs[0] + ((Math.sin(now / 1400) + 1) / 2) * span);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, visible, mx]);

  return (
    <footer className="ft" ref={shell}>
      <div
        className="ft__word wrap"
        ref={word}
        aria-hidden="true"
        onPointerMove={reduce ? undefined : (e) => mx.set(e.clientX)}
        onPointerLeave={() => mx.set(-9999)}
      >
        {[...WORD].map((ch, i) => (
          <Letter key={`${ch}-${i}`} ch={ch} index={i} px={px} centres={centres} radius={radius} />
        ))}
      </div>
      <div className="ft__bar wrap">
        <span>&copy; {new Date().getFullYear()} {profile.name}</span>
        <span className="mono ft__colophon">Set in Anybody and Archivo. Developed in Prussian blue.</span>
        <a href="#top" className="ft__top">
          Back to top <ArrowUp size={14} weight="bold" />
        </a>
      </div>
    </footer>
  );
}
