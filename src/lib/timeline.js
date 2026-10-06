/* Layout helpers for the swimlane timeline. */

export const startOf = (ev) => ev.at ?? ev.from;
export const endOf = (ev) => ev.at ?? ev.to;

/* Greedy interval packing within one lane: an event goes on the first
   level whose previous event ended at least `gap` years before it starts.
   Returns a new array of events, each with a `level`. */
export function stackLevels(events, gap = 0.1) {
  const sorted = [...events].sort((a, b) => startOf(a) - startOf(b));
  return sorted.reduce(
    (acc, ev) => {
      const free = acc.ends.findIndex((end) => startOf(ev) - end >= gap);
      const level = free === -1 ? acc.ends.length : free;
      const ends = acc.ends.map((e, i) => (i === level ? endOf(ev) : e));
      return {
        out: [...acc.out, { ...ev, level }],
        ends: level === acc.ends.length ? [...ends, endOf(ev)] : ends,
      };
    },
    { out: [], ends: [] },
  ).out;
}

export const newestFirst = (events) => [...events].sort((a, b) => startOf(b) - startOf(a));
