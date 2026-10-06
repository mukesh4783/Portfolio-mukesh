import { describe, expect, it } from 'vitest';
import { coreMask, portraitSrc, tilePosition } from './portrait.js';
import layout from '../components/hero/portrait/layout.json';

describe('portrait assets', () => {
  it('builds a themed path under /portrait', () => {
    expect(portraitSrc('subject', 'dark')).toBe('/portrait/subject-dark.webp');
    expect(portraitSrc('back', 'light')).toBe('/portrait/back-light.webp');
  });
});

describe('patch geometry', () => {
  it('positions tiles edge to edge in background-position percentages', () => {
    expect(tilePosition(0, 0, 16, 20)).toEqual({ x: 0, y: 0 });
    expect(tilePosition(19, 15, 16, 20)).toEqual({ x: 100, y: 100 });
    expect(tilePosition(1, 1, 3, 3)).toEqual({ x: 50, y: 50 });
  });

  it('turns core cells into a crisp SVG mask, one unit square per cell', () => {
    const url = coreMask([[0, 0], [2, 3]], 16, 20);
    expect(url.startsWith('url("data:image/svg+xml,')).toBe(true);
    const svg = decodeURIComponent(url.slice('url("data:image/svg+xml,'.length, -2));
    expect(svg).toContain("viewBox='0 0 16 20'");
    expect(svg).toContain('M0 0h1v1h-1z');
    expect(svg).toContain('M3 2h1v1h-1z');
  });

  it('gives an empty mask when nothing is core', () => {
    expect(decodeURIComponent(coreMask([], 4, 5))).toContain("d=''");
  });
});

describe('generated layout', () => {
  const cells = [...layout.core, ...layout.ghost, ...layout.loose.map(([i, j]) => [i, j])];

  it('uses every cell at most once, inside the grid', () => {
    const keys = cells.map(([i, j]) => `${i},${j}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(cells.every(([i, j]) => i >= 0 && i < layout.rows && j >= 0 && j < layout.cols)).toBe(true);
  });

  it('has a core to hold the face and loose patches to animate', () => {
    expect(layout.core.length).toBeGreaterThan(20);
    expect(layout.loose.length).toBeGreaterThan(0);
    expect(layout.attn.every((k) => k >= 0 && k < layout.loose.length)).toBe(true);
  });
});
