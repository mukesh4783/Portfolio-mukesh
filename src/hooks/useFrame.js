import { useEffect, useRef } from 'react';

/* Calls `tick(dtSeconds, elapsedSeconds)` every animation frame while
   `active` is true. The latest callback is always used without restarting. */
export default function useFrame(tick, active) {
  const saved = useRef(tick);
  saved.current = tick;

  useEffect(() => {
    if (!active) return undefined;
    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;
      saved.current(dt, elapsed);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}
