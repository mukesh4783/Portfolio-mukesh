import { describe, expect, it } from 'vitest';
import { countByStage, initialQueue, raiseRequest, stepQueue } from './queue';
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

describe('raiseRequest', () => {
  it('adds a token of the chosen kind at the first stage without mutating', () => {
    const s0 = initialQueue();
    const s1 = raiseRequest(s0, 'scheme', rng(4));
    expect(s0.tokens).toHaveLength(0);
    expect(s1.tokens).toHaveLength(1);
    expect(s1.tokens[0]).toMatchObject({ kind: 'scheme', stage: 0, age: 0 });
    expect(s1.nextId).toBe(1);
  });

  it('ignores unknown kinds and respects the token cap', () => {
    expect(raiseRequest(initialQueue(), 'nope', rng(1)).tokens).toHaveLength(0);
    let s = initialQueue();
    for (let i = 0; i < 50; i += 1) s = raiseRequest(s, 'service', rng(i));
    expect(s.tokens.length).toBeLessThanOrEqual(30);
  });
});
