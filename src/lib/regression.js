/* Polynomial least squares + a 95% band for the fitted mean.
   Pure functions — the hero playground re-runs these on every drag. */

/* Solve A·x = b with Gauss–Jordan elimination (partial pivoting).
   Returns null when the system is singular. */
export function solve(A, b) {
  const n = A.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let r = col + 1; r < n; r += 1) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
    }
    if (Math.abs(M[pivot][col]) < 1e-12) return null;
    [M[col], M[pivot]] = [M[pivot], M[col]];
    const p = M[col][col];
    M[col] = M[col].map((v) => v / p);
    for (let r = 0; r < n; r += 1) {
      if (r === col) continue;
      const f = M[r][col];
      M[r] = M[r].map((v, j) => v - f * M[col][j]);
    }
  }
  return M.map((row) => row[n]);
}

/* Inverse via n solves against the identity columns. */
export function invert(A) {
  const n = A.length;
  const cols = [];
  for (let c = 0; c < n; c += 1) {
    const e = Array.from({ length: n }, (_, i) => (i === c ? 1 : 0));
    const x = solve(A, e);
    if (!x) return null;
    cols.push(x);
  }
  return A.map((_, r) => cols.map((col) => col[r]));
}

const powers = (x, degree) => Array.from({ length: degree + 1 }, (_, k) => x ** k);

export const evalPoly = (coef, x) => coef.reduce((acc, c, k) => acc + c * x ** k, 0);

/* Two-sided 97.5% t quantile — exact-enough table, normal beyond 30 df. */
const T975 = [0, 12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228,
  2.201, 2.179, 2.16, 2.145, 2.131, 2.12, 2.11, 2.101, 2.093, 2.086,
  2.08, 2.074, 2.069, 2.064, 2.06, 2.056, 2.052, 2.048, 2.045, 2.042];
export const tCritical = (df) => (df < 1 ? Infinity : T975[df] ?? 1.96);

/* Fit y = Σ c_k x^k. Returns null when there are too few distinct points.
   x values should be pre-scaled to roughly [-1, 1] for numerical sanity. */
export function polyfit(points, degree) {
  const n = points.length;
  const p = degree + 1;
  if (n < p) return null;

  const XtX = Array.from({ length: p }, () => Array(p).fill(0));
  const Xty = Array(p).fill(0);
  points.forEach(({ x, y }) => {
    const row = powers(x, degree);
    for (let i = 0; i < p; i += 1) {
      Xty[i] += row[i] * y;
      for (let j = 0; j < p; j += 1) XtX[i][j] += row[i] * row[j];
    }
  });

  const coef = solve(XtX, Xty);
  const cov = invert(XtX);
  if (!coef || !cov) return null;

  const meanY = points.reduce((s, pt) => s + pt.y, 0) / n;
  const sse = points.reduce((s, pt) => s + (pt.y - evalPoly(coef, pt.x)) ** 2, 0);
  const sst = points.reduce((s, pt) => s + (pt.y - meanY) ** 2, 0);
  const df = n - p;
  const sigma2 = df > 0 ? sse / df : 0;

  return {
    coef,
    degree,
    r2: sst > 0 ? 1 - sse / sst : 1,
    rmse: Math.sqrt(sse / n),
    predict: (x) => evalPoly(coef, x),
    /* Half-width of the 95% confidence band for the mean at x. */
    band: (x) => {
      if (df <= 0) return 0;
      const v = powers(x, degree);
      const q = v.reduce((acc, vi, i) => acc + vi * cov[i].reduce((a, cij, j) => a + cij * v[j], 0), 0);
      return tCritical(df) * Math.sqrt(Math.max(0, sigma2 * q));
    },
  };
}
