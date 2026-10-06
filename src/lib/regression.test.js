import { describe, expect, it } from 'vitest';
import { evalPoly, invert, polyfit, solve, tCritical } from './regression';

describe('solve', () => {
  it('solves a 2x2 system', () => {
    const x = solve([[2, 1], [1, 3]], [3, 5]);
    expect(x[0]).toBeCloseTo(0.8);
    expect(x[1]).toBeCloseTo(1.4);
  });

  it('returns null for a singular matrix', () => {
    expect(solve([[1, 2], [2, 4]], [1, 2])).toBeNull();
  });

  it('does not mutate its inputs', () => {
    const A = [[2, 1], [1, 3]];
    const b = [3, 5];
    solve(A, b);
    expect(A).toEqual([[2, 1], [1, 3]]);
    expect(b).toEqual([3, 5]);
  });
});

describe('invert', () => {
  it('produces A^-1 so that A·A^-1 = I', () => {
    const A = [[4, 7], [2, 6]];
    const inv = invert(A);
    const prod = A.map((row) => inv[0].map((_, j) => row.reduce((s, v, k) => s + v * inv[k][j], 0)));
    expect(prod[0][0]).toBeCloseTo(1);
    expect(prod[0][1]).toBeCloseTo(0);
    expect(prod[1][1]).toBeCloseTo(1);
  });
});

describe('polyfit', () => {
  it('recovers an exact line with R² = 1', () => {
    const pts = [-1, -0.5, 0, 0.5, 1].map((x) => ({ x, y: 2 * x + 1 }));
    const fit = polyfit(pts, 1);
    expect(fit.coef[0]).toBeCloseTo(1);
    expect(fit.coef[1]).toBeCloseTo(2);
    expect(fit.r2).toBeCloseTo(1);
    expect(fit.rmse).toBeCloseTo(0);
    expect(fit.band(0)).toBeCloseTo(0);
  });

  it('recovers a quadratic', () => {
    const pts = [-1, -0.6, -0.2, 0.2, 0.6, 1].map((x) => ({ x, y: 3 * x * x - x + 0.5 }));
    const fit = polyfit(pts, 2);
    expect(fit.coef[2]).toBeCloseTo(3);
    expect(fit.predict(0.3)).toBeCloseTo(evalPoly([0.5, -1, 3], 0.3));
  });

  it('returns null when there are fewer points than parameters', () => {
    expect(polyfit([{ x: 0, y: 0 }, { x: 1, y: 1 }], 2)).toBeNull();
  });

  it('gives a wider band at the edges than at the centre of the data', () => {
    const pts = [-1, -0.7, -0.3, 0, 0.2, 0.5, 0.9].map((x, i) => ({ x, y: x + (i % 2 ? 0.1 : -0.1) }));
    const fit = polyfit(pts, 1);
    expect(fit.band(1)).toBeGreaterThan(fit.band(0));
  });
});

describe('tCritical', () => {
  it('uses the table for small df and 1.96 beyond it', () => {
    expect(tCritical(1)).toBeCloseTo(12.706);
    expect(tCritical(100)).toBe(1.96);
    expect(tCritical(0)).toBe(Infinity);
  });
});
