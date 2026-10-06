import { describe, expect, it } from 'vitest';
import { simulateStock } from './inventory';

describe('simulateStock', () => {
  const opts = { ticks: 6, start: 10, reorderAt: 4, restockTo: 10, sales: [3] };

  it('draws stock down by each sale', () => {
    const s = simulateStock(opts);
    expect(s[0]).toEqual({ t: 0, stock: 7, sold: 3, restock: false });
    expect(s[1].stock).toBe(4);
  });

  it('restocks after crossing the reorder line', () => {
    const s = simulateStock(opts);
    expect(s[2].restock).toBe(true);
    expect(s[2].stock).toBe(7);
  });

  it('never sells more than is on the shelf', () => {
    const s = simulateStock({ ...opts, start: 2, reorderAt: 0, sales: [5] });
    expect(s[0].sold).toBe(2);
    expect(s[0].stock).toBe(0);
  });
});
