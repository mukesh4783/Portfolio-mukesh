import { useEffect } from 'react';
import Lenis from 'lenis';

let instance = null;
export const getLenis = () => instance;

/* Smooth wheel scrolling; anchor links land just under the sticky nav. */
export function useLenis(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: { offset: -64 } });
    instance = lenis;
    let raf = 0;
    const tick = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      instance = null;
    };
  }, [enabled]);
}
