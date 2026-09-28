import { useEffect, useState } from 'react';
import { prefersReducedMotion } from './useInView';

const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

/* Animates 0 → target once `start` flips true. Returns the current number. */
export default function useCountUp(target, { start = true, duration = 1600, delay = 0 } = {}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return undefined;
    if (prefersReducedMotion()) {
      setValue(target);
      return undefined;
    }
    let raf = 0;
    let t0 = 0;
    const tick = (now) => {
      if (!t0) t0 = now + delay;
      const p = Math.max(0, (now - t0) / duration);
      setValue(target * easeOutExpo(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration, delay]);

  return value;
}
