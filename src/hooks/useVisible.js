import { useEffect, useRef, useState } from 'react';

/* Tracks visibility so loops and videos pause while off-screen. */
export function useVisible({ rootMargin = '0px', threshold = 0.05 } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin, threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold]);

  return [ref, visible];
}
