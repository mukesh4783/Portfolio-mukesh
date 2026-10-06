import { describe, expect, it } from 'vitest';
import { morph, sample, toPath } from './curves';

describe('curves', () => {
  const a = sample((x) => x, 0, 1, 3);
  const b = sample((x) => 2 * x, 0, 1, 3);

  it('samples evenly including both ends', () => {
    expect(a.map((p) => p.x)).toEqual([0, 0.5, 1]);
  });

  it('morph is a at t=0, b at t=1 and halfway in between', () => {
    expect(morph(a, b, 0)).toEqual(a);
    expect(morph(a, b, 1)).toEqual(b);
    expect(morph(a, b, 0.5)[2].y).toBeCloseTo(1.5);
  });

  it('builds an SVG path', () => {
    expect(toPath(a, (x) => x * 10, (y) => -y)).toBe('M0.00,0.00L5.00,-0.50L10.00,-1.00');
  });
});
