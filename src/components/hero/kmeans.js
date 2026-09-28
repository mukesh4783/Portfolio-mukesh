/* Pure helpers for the hero's k-means animation. Points and centroids are
   {x, y} in the unit square; every function returns fresh data. */

/* Box–Muller normal sample. */
function gauss(rng) {
  const u = 1 - rng();
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const clamp01 = (v) => Math.min(0.97, Math.max(0.03, v));

/** n points drawn from k anisotropic Gaussian blobs. */
export function makeBlobs(n, k, rng = Math.random) {
  const blobs = Array.from({ length: k }, (_, i) => {
    const angle = (i / k) * Math.PI * 2 + rng() * 0.9;
    const r = 0.2 + rng() * 0.12;
    return {
      cx: 0.5 + Math.cos(angle) * r,
      cy: 0.5 + Math.sin(angle) * r,
      sx: 0.05 + rng() * 0.05,
      sy: 0.05 + rng() * 0.05,
      rot: rng() * Math.PI,
    };
  });
  return Array.from({ length: n }, (_, i) => {
    const b = blobs[i % k];
    const gx = gauss(rng) * b.sx;
    const gy = gauss(rng) * b.sy;
    const c = Math.cos(b.rot);
    const s = Math.sin(b.rot);
    return { x: clamp01(b.cx + gx * c - gy * s), y: clamp01(b.cy + gx * s + gy * c) };
  });
}

const dist2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

/** Pick k distinct random points as starting centroids (Forgy init). */
export function initCentroids(points, k, rng = Math.random) {
  const picked = new Set();
  while (picked.size < k) picked.add(Math.floor(rng() * points.length));
  return [...picked].map((i) => ({ ...points[i] }));
}

/** Index of the nearest centroid for each point. */
export function assign(points, centroids) {
  return points.map((p) => centroids.reduce(
    (best, c, i) => (dist2(p, c) < dist2(p, centroids[best]) ? i : best),
    0,
  ));
}

/** Mean of each cluster; an empty cluster keeps its old centroid. */
export function update(points, labels, centroids) {
  return centroids.map((c, i) => {
    const members = points.filter((_, j) => labels[j] === i);
    if (!members.length) return { ...c };
    return {
      x: members.reduce((s, p) => s + p.x, 0) / members.length,
      y: members.reduce((s, p) => s + p.y, 0) / members.length,
    };
  });
}

/** Within-cluster sum of squares (scaled ×100 for readable numbers). */
export function inertia(points, labels, centroids) {
  return points.reduce((s, p, j) => s + dist2(p, centroids[labels[j]]), 0) * 100;
}

/** Largest distance any centroid moved between two iterations. */
export function maxShift(a, b) {
  return a.reduce((m, c, i) => Math.max(m, Math.sqrt(dist2(c, b[i]))), 0);
}
