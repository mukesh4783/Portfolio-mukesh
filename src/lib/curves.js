/* Sampled curves for the Manim-style morph: every curve is sampled on the
   same x grid, so a morph is just a per-sample interpolation. */

export const CURVES = [
  { id: 'sin', label: 'y = sin(x)', f: (x) => Math.sin(x) },
  { id: 'gauss', label: 'y = e^(−x²/2)', f: (x) => 1.6 * Math.exp(-(x * x) / 2) - 0.4 },
  { id: 'cubic', label: 'y = x³ / 20', f: (x) => (x ** 3) / 20 },
  { id: 'sigmoid', label: 'y = σ(2x)', f: (x) => 2 / (1 + Math.exp(-2 * x)) - 1 },
];

export function sample(f, from, to, n) {
  return Array.from({ length: n }, (_, i) => {
    const x = from + ((to - from) * i) / (n - 1);
    return { x, y: f(x) };
  });
}

export function morph(a, b, t) {
  return a.map((p, i) => ({ x: p.x, y: p.y + (b[i].y - p.y) * t }));
}

/* Map data-space samples to an SVG path string. */
export function toPath(samples, sx, sy) {
  return samples
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`)
    .join('');
}
