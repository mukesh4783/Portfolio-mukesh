import React, { useEffect, useState } from 'react';
import useInView from '../../hooks/useInView';
import useReducedMotion from '../../hooks/useReducedMotion';

/* Counts from 0 to `value` the first time it scrolls into view. */
export default function CountUp({ value, decimals = 0, prefix = '', suffix = '', duration = 1100 }) {
  const [ref, inView] = useInView({ once: true, threshold: 0.4 });
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView || reduced) {
      if (reduced) setShown(value);
      return undefined;
    }
    let raf = 0;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setShown(value * (1 - (1 - t) ** 3));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, duration]);

  return (
    <span ref={ref} aria-label={`${prefix}${value.toFixed(decimals)}${suffix}`}>
      <span aria-hidden="true">{prefix}{shown.toFixed(decimals)}{suffix}</span>
    </span>
  );
}
