/* Deterministic stock simulation for the billing card: sales draw stock
   down, and crossing the reorder line triggers a restock the next tick. */

export function simulateStock({ ticks, start, reorderAt, restockTo, sales }) {
  return Array.from({ length: ticks }).reduce(
    (acc, _, t) => {
      const prev = acc.series.length ? acc.series[acc.series.length - 1].stock : start;
      const restock = prev <= reorderAt;
      const base = restock ? restockTo : prev;
      const sold = Math.min(base, sales[t % sales.length]);
      const point = { t, stock: base - sold, sold, restock };
      return { series: [...acc.series, point] };
    },
    { series: [] },
  ).series;
}
