/* Geometry and asset paths for the hero portrait. The images and layout.json are
   generated from a photo by `npm run portrait` (tools/portrait). */

/**
 * @param {'back' | 'subject'} name
 * @param {'light' | 'dark'} theme
 * @returns {string}
 */
export const portraitSrc = (name, theme) => `/portrait/${name}-${theme}.webp`;

/**
 * background-position for tile (row i, col j) of a cols x rows sprite, in percent.
 * @returns {{ x: number, y: number }}
 */
export function tilePosition(i, j, cols, rows) {
  return {
    x: cols > 1 ? (j / (cols - 1)) * 100 : 0,
    y: rows > 1 ? (i / (rows - 1)) * 100 : 0,
  };
}

/**
 * A CSS mask showing only the given [row, col] cells, as one vector path so the
 * cells butt together with no seams at any size.
 * @param {Array<[number, number]>} cells
 * @returns {string}
 */
export function coreMask(cells, cols, rows) {
  const d = cells.map(([i, j]) => `M${j} ${i}h1v1h-1z`).join('');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${cols} ${rows}' preserveAspectRatio='none' shape-rendering='crispEdges'><path d='${d}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
