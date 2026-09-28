import React, { useEffect, useRef } from 'react';
import { makeBlobs, initCentroids, assign, update, inertia, maxShift } from './kmeans';
import { drawFrame, mixColor, colorOf, lerp, ease, PAD } from './drawCluster';
import { prefersReducedMotion } from '../../hooks/useInView';

const N = 240;
const K = 4;
const MAX_ITER = 14;
const DUR = { seed: 1200, init: 700, assign: 750, update: 900, done: 3400 };
const NONE = Array(N).fill(-1);

/* ── simulation: each transition returns a NEW state object ── */

function seedState(prev) {
  const to = makeBlobs(N, K);
  return {
    phase: 'seed',
    from: prev ? prev.to : to.map(() => ({ x: 0.5, y: 0.5 })),
    to,
    prevLabels: prev ? prev.labels : NONE,
    labels: NONE,
    centroids: prev ? prev.centroids : [],
    target: null,
    trails: prev ? prev.trails : [],
    iter: 0,
    inertia: null,
    shift: 1,
  };
}

function nextState(s) {
  switch (s.phase) {
    case 'seed': {
      const centroids = initCentroids(s.to, K);
      return { ...s, phase: 'init', from: s.to, centroids, trails: centroids.map((c) => [c]), prevLabels: NONE };
    }
    case 'init':
    case 'update-done': {
      const labels = assign(s.to, s.centroids);
      return {
        ...s,
        phase: 'assign',
        prevLabels: s.labels,
        labels,
        iter: s.iter + 1,
        inertia: inertia(s.to, labels, s.centroids),
      };
    }
    case 'assign': {
      const target = update(s.to, s.labels, s.centroids);
      return { ...s, phase: 'update', prevLabels: s.labels, target, shift: maxShift(s.centroids, target) };
    }
    case 'update': {
      const centroids = s.target;
      const trails = s.trails.map((t, i) => [...t, centroids[i]]);
      const converged = s.shift < 0.002 || s.iter >= MAX_ITER;
      const next = { ...s, centroids, trails, target: null, inertia: inertia(s.to, s.labels, centroids) };
      return converged ? { ...next, phase: 'done' } : nextState({ ...next, phase: 'update-done' });
    }
    default:
      return seedState(s);
  }
}

/* Run to convergence instantly (reduced motion). */
function settle() {
  let s = nextState(seedState(null));
  while (s.phase !== 'done') s = nextState(s);
  return s;
}

/* ── frame description from state + phase progress ── */
function frameOf(s, p, hover) {
  const e = ease(Math.min(1, p));
  const points = s.to.map((pt, i) => {
    const at = s.phase === 'seed'
      ? { x: lerp(s.from[i].x, pt.x, e), y: lerp(s.from[i].y, pt.y, e) }
      : pt;
    const from = colorOf(s.prevLabels[i]);
    const to = colorOf(s.labels[i]);
    const color = from === to ? to : mixColor(from, to, e);
    return { ...at, color, label: s.labels[i] };
  });

  const centroids = s.centroids.map((c, i) => {
    const pos = s.phase === 'update' && s.target
      ? { x: lerp(c.x, s.target[i].x, e), y: lerp(c.y, s.target[i].y, e) }
      : c;
    return {
      ...pos,
      color: colorOf(i),
      scale: s.phase === 'init' ? ease(Math.min(1, p * 1.4)) : 1,
      alpha: s.phase === 'seed' ? 1 - e : 1,
    };
  });

  const trails = s.phase === 'update' && s.target
    ? s.trails.map((t, i) => [...t, centroids[i]])
    : s.trails;

  const links = { assign: e, update: 1, done: Math.max(0, 1 - p * 2.5) }[s.phase] ?? 0;
  return { points, centroids: s.phase === 'seed' && e >= 1 ? [] : centroids, trails, links, hover };
}

const PHASE_TEXT = {
  seed: 'sampling', init: 'initialising', assign: 'assigning', update: 'updating', done: 'converged',
};

/**
 * Live k-means figure. Reports { iter, inertia, status } to onStats on
 * each phase change, so the caption can update without per-frame renders.
 */
export default function ClusterField({ onStats }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const reseedRef = useRef(() => {});

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduced = prefersReducedMotion();
    const env = { w: 0, h: 0, hover: null, visible: true, raf: 0, t0: performance.now(), paused: 0 };
    let state = reduced ? settle() : seedState(null);

    const report = () => onStats?.({ iter: state.iter, inertia: state.inertia, status: PHASE_TEXT[state.phase] });
    const paint = (p) => drawFrame(ctx, env.w, env.h, frameOf(state, p, env.hover));

    const loop = (now) => {
      const p = (now - env.t0) / DUR[state.phase];
      if (p >= 1) {
        state = nextState(state);
        env.t0 = now;
        report();
      }
      paint(Math.min(1, p));
      env.raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduced || env.raf) return;
      env.t0 = performance.now() - env.paused;
      env.raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!env.raf) return;
      cancelAnimationFrame(env.raf);
      env.paused = performance.now() - env.t0;
      env.raf = 0;
    };

    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      env.w = width;
      env.h = height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(1);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const inside = x > PAD.l && x < env.w - PAD.r && y > PAD.t && y < env.h - PAD.b;
      env.hover = inside ? { x, y } : null;
      if (reduced) paint(1);
    };
    const onLeave = () => { env.hover = null; if (reduced) paint(1); };

    reseedRef.current = () => {
      state = reduced ? settle() : seedState(state);
      env.t0 = performance.now();
      env.paused = 0;
      report();
      if (reduced) paint(1);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(wrap);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    report();

    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(env.raf);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, [onStats]);

  return (
    <div ref={wrapRef} className="cluster">
      <canvas
        ref={canvasRef}
        className="cluster__canvas"
        role="img"
        aria-label="Animated k-means clustering: 240 points grouped into four coloured clusters as centroids converge."
        onClick={() => reseedRef.current()}
      />
    </div>
  );
}
