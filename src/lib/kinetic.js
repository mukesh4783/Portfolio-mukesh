/* Maths for the kinetic type: how strongly a glyph reacts to the pointer,
   and the font-variation string that reaction produces. Pure functions. */

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* 1 at the pointer, easing smoothly to 0 at `radius` and beyond. */
export function falloff(dist, radius) {
  if (radius <= 0) return 0;
  const t = clamp(1 - dist / radius, 0, 1);
  return t * t * (3 - 2 * t);
}

/* Interpolate each variable-font axis between its [rest, peak] values. */
export function axes(t, ranges) {
  const k = clamp(t, 0, 1);
  return Object.fromEntries(Object.entries(ranges).map(([axis, [rest, peak]]) => [axis, rest + (peak - rest) * k]));
}

export function variation(values) {
  return Object.entries(values)
    .map(([axis, v]) => `'${axis}' ${Math.round(v)}`)
    .join(', ');
}
