import { useEffect, useState } from 'react';
import { prefersReducedMotion } from './useInView';

/**
 * Steps through a scripted timeline while `active`.
 * steps: array of durations (ms) — returns the current step index, looping.
 * With reduced motion it parks on `restStep` (defaults to the last step).
 */
export default function useTicker(steps, active, restStep = steps.length - 1) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    if (prefersReducedMotion()) {
      setStep(restStep);
      return undefined;
    }
    const t = setTimeout(() => setStep((s) => (s + 1) % steps.length), steps[step]);
    return () => clearTimeout(t);
  }, [active, step, steps, restStep]);

  return step;
}

/** Counts how many times `step` has wrapped back to 0 — use as a React key to replay a scene. */
export function useLoopCount(step) {
  const [loop, setLoop] = useState(0);
  const [prev, setPrev] = useState(step);
  if (step !== prev) {
    setPrev(step);
    if (step === 0) setLoop((n) => n + 1);
  }
  return loop;
}
