import { describe, expect, it } from 'vitest';
import { validate } from './contact.js';
import { axes, clamp, falloff, variation } from './kinetic.js';

describe('contact validation', () => {
  it('accepts a complete message', () => {
    expect(validate({ name: 'Riya', email: 'riya@company.in', message: 'We have an ML internship open.' })).toEqual({});
  });

  it('flags every bad field at once', () => {
    const e = validate({ name: ' ', email: 'nope', message: 'hi' });
    expect(Object.keys(e).sort()).toEqual(['email', 'message', 'name']);
  });

  it('enforces length limits', () => {
    const e = validate({ name: 'x'.repeat(81), email: 'a@b.co', message: 'y'.repeat(2001) });
    expect(Object.keys(e).sort()).toEqual(['message', 'name']);
  });
});

describe('kinetic type', () => {
  it('falloff is 1 at the pointer, 0 past the radius, monotonic between', () => {
    expect(falloff(0, 100)).toBe(1);
    expect(falloff(100, 100)).toBe(0);
    expect(falloff(250, 100)).toBe(0);
    expect(falloff(25, 100)).toBeGreaterThan(falloff(60, 100));
    expect(falloff(10, 0)).toBe(0);
  });

  it('interpolates axes and clamps t', () => {
    expect(axes(0.5, { wght: [400, 800] })).toEqual({ wght: 600 });
    expect(axes(2, { wdth: [80, 120] })).toEqual({ wdth: 120 });
    expect(axes(-1, { wdth: [80, 120] })).toEqual({ wdth: 80 });
  });

  it('formats a font-variation-settings string', () => {
    expect(variation({ wght: 712.4, wdth: 98.6 })).toBe("'wght' 712, 'wdth' 99");
    expect(clamp(5, 0, 3)).toBe(3);
  });
});
