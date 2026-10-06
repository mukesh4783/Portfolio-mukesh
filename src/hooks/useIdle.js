import { useEffect, useState } from 'react';

/* Flips to true once the browser is idle after the first paint, for work that must
   not compete with it, such as fetching the other theme's images. */
export function useIdle(timeout = 2500) {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (window.requestIdleCallback) {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setIdle(true), Math.min(timeout, 1500));
    return () => window.clearTimeout(id);
  }, [timeout]);

  return idle;
}
