import { useEffect, useRef } from 'react';

/* Calls `tick(dtSeconds)` every animation frame while `active` is true.
   The latest callback is always used without restarting the loop. */
export function useFrame(tick, active) {
  const saved = useRef(tick);
  saved.current = tick;

  useEffect(() => {
    if (!active) return undefined;
    let raf = 0;
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      saved.current(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}
