import { useCallback, useState } from 'react';
import { clamp, gaussian, rng } from '../../lib/random';

export const X_MAX = 10;
export const Y_MAX = 100;
export const MAX_POINTS = 30;
const MIN_POINTS = 3;

/* A noisy, positively correlated cloud: more cleaning → more trust. */
export function makePoints(seed, n = 13) {
  const rand = rng(seed);
  return Array.from({ length: n }, (_, i) => {
    const x = clamp(0.5 + (i * 9) / (n - 1) + (rand() - 0.5) * 0.7, 0.2, 9.8);
    const y = clamp(16 + 6.6 * x + gaussian(rand) * 9, 4, 96);
    return { id: `${seed}-${i}`, x, y };
  });
}

/* Point list state with immutable updates only. */
export default function usePoints(initialSeed = 7) {
  const [seed, setSeed] = useState(initialSeed);
  const [points, setPoints] = useState(() => makePoints(initialSeed));

  const move = useCallback((id, x, y) => {
    setPoints((pts) => pts.map((p) => (p.id === id ? { ...p, x: clamp(x, 0, X_MAX), y: clamp(y, 0, Y_MAX) } : p)));
  }, []);

  const add = useCallback((x, y) => {
    setPoints((pts) => (pts.length >= MAX_POINTS ? pts : [...pts, { id: `u-${Date.now()}-${pts.length}`, x, y }]));
  }, []);

  const remove = useCallback((id) => {
    setPoints((pts) => (pts.length <= MIN_POINTS ? pts : pts.filter((p) => p.id !== id)));
  }, []);

  const reshuffle = useCallback(() => {
    const next = seed + 1;
    setSeed(next);
    setPoints(makePoints(next));
  }, [seed]);

  const reset = useCallback(() => {
    setSeed(initialSeed);
    setPoints(makePoints(initialSeed));
  }, [initialSeed]);

  return { points, move, add, remove, reshuffle, reset };
}
