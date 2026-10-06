import { describe, expect, it } from 'vitest';
import { newestFirst, stackLevels } from './timeline';

describe('stackLevels', () => {
  it('keeps well-separated events on level 0', () => {
    const out = stackLevels([{ id: 'a', at: 2020 }, { id: 'b', at: 2021 }]);
    expect(out.map((e) => e.level)).toEqual([0, 0]);
  });

  it('bumps close events to a new level and reuses freed levels', () => {
    const out = stackLevels([{ id: 'a', at: 2026.5 }, { id: 'b', at: 2026.53 }, { id: 'c', at: 2026.56 }, { id: 'd', at: 2027 }]);
    expect(out.map((e) => e.level)).toEqual([0, 1, 2, 0]);
  });

  it('treats spans by their end', () => {
    const out = stackLevels([{ id: 'span', from: 2026.35, to: 2026.5 }, { id: 'dot', at: 2026.53 }]);
    expect(out[1].level).toBe(1);
  });

  it('does not mutate input', () => {
    const input = [{ id: 'a', at: 1 }];
    stackLevels(input);
    expect(input[0]).toEqual({ id: 'a', at: 1 });
  });
});

describe('newestFirst', () => {
  it('sorts by start date descending', () => {
    const out = newestFirst([{ id: 'a', at: 2020 }, { id: 'b', from: 2022, to: 2023 }, { id: 'c', at: 2021 }]);
    expect(out.map((e) => e.id)).toEqual(['b', 'c', 'a']);
  });
});
