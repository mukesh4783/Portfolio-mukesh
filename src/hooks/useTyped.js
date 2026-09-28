import { useEffect, useState } from 'react';
import { prefersReducedMotion } from './useInView';

/** Types `text` out character by character while `active`; resets when inactive. */
export default function useTyped(text, active, { speed = 26, delay = 0 } = {}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) {
      setN(0);
      return undefined;
    }
    if (prefersReducedMotion()) {
      setN(text.length);
      return undefined;
    }
    let i = 0;
    let timer = 0;
    const tick = () => {
      i += 1;
      setN(i);
      if (i < text.length) timer = setTimeout(tick, speed);
    };
    timer = setTimeout(tick, delay);
    return () => clearTimeout(timer);
  }, [text, active, speed, delay]);

  return text.slice(0, n);
}
