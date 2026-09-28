import { useEffect, useRef } from 'react';

/**
 * Writes how far the viewport's reading line (60% down) has travelled
 * through the element into a CSS variable (--progress, 0 → 1).
 * Writes to the DOM directly so scrolling never re-renders React.
 */
export default function useScrollProgress(varName = '--progress') {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const line = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      el.style.setProperty(varName, p.toFixed(4));
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [varName]);
  return ref;
}
