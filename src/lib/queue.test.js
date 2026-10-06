import { describe, expect, it } from 'vitest';
import { countByStage, initialQueue, stepQueue } from './queue';
import { rng } from './random';

describe('stepQueue', () => {
  it('spawns a token immediately from the initial state', () => {
    const s = stepQueue(initialQueue(), 0.016, rng(1));
    expect(s.tokens).toHaveLength(1);
    expect(s.tokens[0].stage).toBe(0);
  });

  it('does not mutate the previous state', () => {
    const s0 = stepQueue(initialQueue(), 0.016, rng(1));
    const snapshot = JSON.stringify(s0);
    stepQueue(s0, 5, rng(2));
    expect(JSON.stringify(s0)).toBe(snapshot);
  });

  it('eventually issues requests and tracks turnaround', () => {
    const rand = rng(3);
    let s = initialQueue();
    for (let i = 0; i < 1200; i += 1) s = stepQueue(s, 1 / 60, rand);
    expect(s.issued).toBeGreaterThan(0);
    expect(s.turnaround / s.issued).toBeGreaterThan(3);
    expect(countByStage(s.tokens).reduce((a, b) => a + b, 0)).toBe(s.tokens.length);
  });
});
