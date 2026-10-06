import { describe, expect, it } from 'vitest';
import { isGrounded, similarity, topK } from './retrieval';

const chunks = [
  { id: 'a', x: 0, y: 0 },
  { id: 'b', x: 1, y: 0 },
  { id: 'c', x: 5, y: 5 },
];

describe('topK', () => {
  it('returns the k nearest chunks, nearest first', () => {
    const hits = topK(chunks, { x: 0.9, y: 0 }, 2, 10);
    expect(hits.map((h) => h.id)).toEqual(['b', 'a']);
    expect(hits[0].score).toBeGreaterThan(hits[1].score);
  });

  it('never mutates the source chunks', () => {
    topK(chunks, { x: 0, y: 0 }, 3, 10);
    expect(chunks[0]).toEqual({ id: 'a', x: 0, y: 0 });
  });

  it('handles k larger than the corpus and k = 0', () => {
    expect(topK(chunks, { x: 0, y: 0 }, 10, 10)).toHaveLength(3);
    expect(topK(chunks, { x: 0, y: 0 }, 0, 10)).toHaveLength(0);
  });
});

describe('similarity / isGrounded', () => {
  it('clamps similarity to [0, 1]', () => {
    expect(similarity(0, 4)).toBe(1);
    expect(similarity(8, 4)).toBe(0);
  });

  it('refuses when the best hit is below threshold', () => {
    const far = topK(chunks, { x: 20, y: 20 }, 3, 10);
    expect(isGrounded(far, 0.5)).toBe(false);
    const near = topK(chunks, { x: 0.1, y: 0 }, 3, 10);
    expect(isGrounded(near, 0.5)).toBe(true);
    expect(isGrounded([], 0.5)).toBe(false);
  });
});
