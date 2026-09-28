/* Canvas renderer for the k-means figure. Pure drawing: reads a frame
   description, writes pixels — no simulation state is changed here. */

export const PALETTE = ['#E2553A', '#2F8C83', '#D39B2A', '#4C63B6'];
const GREY = '#A3A39C';
const INK = '21, 23, 26';
export const PAD = { l: 38, r: 14, t: 14, b: 32 };
const CLUSTER_NAMES = ['A', 'B', 'C', 'D'];

const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const RGB = [...PALETTE, GREY].reduce((m, h) => ({ ...m, [h]: hexToRgb(h) }), {});

export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function mixColor(a, b, t) {
  const [r1, g1, b1] = RGB[a];
  const [r2, g2, b2] = RGB[b];
  return `rgb(${Math.round(lerp(r1, r2, t))},${Math.round(lerp(g1, g2, t))},${Math.round(lerp(b1, b2, t))})`;
}

export const colorOf = (label) => (label >= 0 ? PALETTE[label] : GREY);

/* unit square → canvas px (y axis points up, like a real plot) */
export function makeScale(w, h) {
  const iw = w - PAD.l - PAD.r;
  const ih = h - PAD.t - PAD.b;
  return {
    sx: (x) => PAD.l + x * iw,
    sy: (y) => PAD.t + (1 - y) * ih,
    ix: (px) => (px - PAD.l) / iw,
    iy: (py) => 1 - (py - PAD.t) / ih,
  };
}

function drawGrid(ctx, w, h, s) {
  ctx.lineWidth = 1;
  for (let i = 0; i <= 20; i += 1) {
    const v = i / 20;
    const major = i % 5 === 0;
    ctx.strokeStyle = `rgba(${INK}, ${major ? 0.1 : 0.04})`;
    ctx.beginPath();
    ctx.moveTo(Math.round(s.sx(v)) + 0.5, PAD.t);
    ctx.lineTo(Math.round(s.sx(v)) + 0.5, h - PAD.b);
    ctx.moveTo(PAD.l, Math.round(s.sy(v)) + 0.5);
    ctx.lineTo(w - PAD.r, Math.round(s.sy(v)) + 0.5);
    ctx.stroke();
  }
  ctx.strokeStyle = `rgba(${INK}, 0.55)`;
  ctx.beginPath();
  ctx.moveTo(PAD.l + 0.5, PAD.t);
  ctx.lineTo(PAD.l + 0.5, h - PAD.b + 0.5);
  ctx.lineTo(w - PAD.r, h - PAD.b + 0.5);
  ctx.stroke();

  ctx.fillStyle = `rgba(${INK}, 0.5)`;
  ctx.font = '10px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  [0, 0.25, 0.5, 0.75, 1].forEach((v) => ctx.fillText(v.toFixed(2), s.sx(v), h - PAD.b + 15));
  ctx.textAlign = 'right';
  [0.25, 0.5, 0.75, 1].forEach((v) => ctx.fillText(v.toFixed(2), PAD.l - 6, s.sy(v) + 3));
  ctx.textAlign = 'left';
  ctx.fillText('feature₁ →', w - PAD.r - 64, h - 4);
  ctx.save();
  ctx.translate(10, PAD.t + 58);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('feature₂ →', 0, 0);
  ctx.restore();
}

function drawCentroid(ctx, x, y, color, scale, alpha) {
  if (scale <= 0 || alpha <= 0) return;
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.fillStyle = '#EEEDE6';
  ctx.beginPath();
  ctx.arc(x, y, 9 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  const r = 4 * scale;
  ctx.beginPath();
  ctx.moveTo(x - r, y - r); ctx.lineTo(x + r, y + r);
  ctx.moveTo(x + r, y - r); ctx.lineTo(x - r, y + r);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawHover(ctx, w, h, s, hover, nearest) {
  ctx.strokeStyle = `rgba(${INK}, 0.35)`;
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.moveTo(hover.x, PAD.t); ctx.lineTo(hover.x, h - PAD.b);
  ctx.moveTo(PAD.l, hover.y); ctx.lineTo(w - PAD.r, hover.y);
  ctx.stroke();
  ctx.setLineDash([]);

  if (nearest) {
    ctx.strokeStyle = nearest.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(nearest.px, nearest.py, 8, 0, Math.PI * 2);
    ctx.stroke();
  }

  const label = `x ${s.ix(hover.x).toFixed(2)}  y ${s.iy(hover.y).toFixed(2)}${
    nearest && nearest.label >= 0 ? `  ∈ ${CLUSTER_NAMES[nearest.label]}` : ''}`;
  ctx.font = '11px "IBM Plex Mono", monospace';
  const tw = ctx.measureText(label).width + 14;
  const bx = Math.min(hover.x + 12, w - PAD.r - tw);
  const by = Math.max(hover.y - 30, PAD.t);
  ctx.fillStyle = 'rgba(21, 23, 26, 0.92)';
  ctx.fillRect(bx, by, tw, 20);
  ctx.fillStyle = '#EEEDE6';
  ctx.textAlign = 'left';
  ctx.fillText(label, bx + 7, by + 14);
}

/**
 * frame: { points:[{x,y,color,label}], centroids:[{x,y,color,scale,alpha}],
 *          trails:[[{x,y}]], links: 0..1, hover:{x,y}|null }
 */
export function drawFrame(ctx, w, h, frame) {
  const s = makeScale(w, h);
  ctx.clearRect(0, 0, w, h);
  drawGrid(ctx, w, h, s);

  if (frame.links > 0) {
    ctx.lineWidth = 1;
    frame.points.forEach((p) => {
      const c = frame.centroids[p.label];
      if (!c) return;
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = 0.14 * frame.links;
      ctx.beginPath();
      ctx.moveTo(s.sx(p.x), s.sy(p.y));
      ctx.lineTo(s.sx(c.x), s.sy(c.y));
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }

  frame.trails.forEach((trail, i) => {
    if (trail.length < 2) return;
    ctx.strokeStyle = PALETTE[i];
    ctx.lineWidth = 1.25;
    ctx.setLineDash([2, 3]);
    ctx.globalAlpha = frame.centroids[i]?.alpha ?? 1;
    ctx.beginPath();
    trail.forEach((pt, j) => (j ? ctx.lineTo(s.sx(pt.x), s.sy(pt.y)) : ctx.moveTo(s.sx(pt.x), s.sy(pt.y))));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  });

  let nearest = null;
  let best = 22 * 22;
  frame.points.forEach((p) => {
    const px = s.sx(p.x);
    const py = s.sy(p.y);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(px, py, 3.1, 0, Math.PI * 2);
    ctx.fill();
    if (frame.hover) {
      const d = (px - frame.hover.x) ** 2 + (py - frame.hover.y) ** 2;
      if (d < best) { best = d; nearest = { px, py, color: p.color, label: p.label }; }
    }
  });

  frame.centroids.forEach((c) => drawCentroid(ctx, s.sx(c.x), s.sy(c.y), c.color, c.scale, c.alpha));

  if (frame.hover) drawHover(ctx, w, h, s, frame.hover, nearest);
}
