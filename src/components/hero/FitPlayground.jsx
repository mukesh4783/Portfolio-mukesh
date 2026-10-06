import React, { useMemo, useRef, useState } from 'react';
import { polyfit } from '../../lib/regression';
import Icon from '../common/Icon';
import usePoints, { MAX_POINTS, X_MAX, Y_MAX } from './usePoints';
import './FitPlayground.css';

/* Chart geometry (SVG user units). */
const W = 520;
const H = 380;
const PAD = { l: 46, r: 16, t: 18, b: 44 };
const PW = W - PAD.l - PAD.r;
const PH = H - PAD.t - PAD.b;

const sx = (x) => PAD.l + (x / X_MAX) * PW;
const sy = (y) => PAD.t + PH - (y / Y_MAX) * PH;
/* Fit in a normalised space so higher degrees stay well-conditioned. */
const toU = (x) => (x - X_MAX / 2) / (X_MAX / 2);
const toV = (y) => (y - Y_MAX / 2) / (Y_MAX / 2);
const fromV = (v) => v * (Y_MAX / 2) + Y_MAX / 2;

const DEGREES = [
  { d: 1, label: 'Linear' },
  { d: 2, label: 'Quadratic' },
  { d: 3, label: 'Cubic' },
];
const SAMPLES = Array.from({ length: 81 }, (_, i) => (i / 80) * X_MAX);

function useFit(points, degree) {
  return useMemo(() => {
    const fit = polyfit(points.map((p) => ({ x: toU(p.x), y: toV(p.y) })), degree);
    if (!fit) return null;
    const curve = SAMPLES.map((x) => ({ x, y: fromV(fit.predict(toU(x))), b: fit.band(toU(x)) * (Y_MAX / 2) }));
    const line = curve.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join('');
    const upper = curve.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y + p.b).toFixed(1)}`).join('');
    const lower = [...curve].reverse().map((p) => `L${sx(p.x).toFixed(1)},${sy(p.y - p.b).toFixed(1)}`).join('');
    /* Degree-1 coefficients back in original units for the readout. */
    const [c0, c1 = 0] = fit.coef;
    const slope = (c1 * (Y_MAX / 2)) / (X_MAX / 2);
    const intercept = Y_MAX / 2 + c0 * (Y_MAX / 2) - c1 * (Y_MAX / 2);
    return {
      line, band: `${upper}${lower}Z`, r2: fit.r2, rmse: fit.rmse * (Y_MAX / 2),
      slope, intercept, yhat: (x) => fromV(fit.predict(toU(x))),
    };
  }, [points, degree]);
}

export default function FitPlayground() {
  const { points, move, add, remove, reshuffle, reset } = usePoints();
  const [degree, setDegree] = useState(1);
  const [showResiduals, setShowResiduals] = useState(true);
  const [showBand, setShowBand] = useState(true);
  const [dragging, setDragging] = useState(null);
  const [touched, setTouched] = useState(false);
  const svgRef = useRef(null);
  const fit = useFit(points, degree);

  const toData = (e) => {
    const r = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const py = ((e.clientY - r.top) / r.height) * H;
    return { x: ((px - PAD.l) / PW) * X_MAX, y: ((PAD.t + PH - py) / PH) * Y_MAX };
  };

  const onPointDown = (e, id) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDragging(id);
    setTouched(true);
  };
  const onPointMove = (e, id) => {
    if (dragging !== id) return;
    const { x, y } = toData(e);
    move(id, x, y);
  };
  const onPlotClick = (e) => {
    const { x, y } = toData(e);
    if (x < 0 || x > X_MAX || y < 0 || y > Y_MAX) return;
    add(x, y);
    setTouched(true);
  };
  const onKey = (e, p) => {
    const step = e.shiftKey ? 1 : 0.25;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step * 10], ArrowDown: [0, -step * 10] };
    if (moves[e.key]) {
      e.preventDefault();
      move(p.id, p.x + moves[e.key][0], p.y + moves[e.key][1]);
      setTouched(true);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      remove(p.id);
    }
  };

  const hint = points[Math.floor(points.length * 0.3)];

  return (
    <figure className="fit" aria-labelledby="fit-cap">
      <div className="fit__bar">
        <span className="fit__dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="mono fit__file">regression_playground.py</span>
        <span className="mono fit__n">n = {points.length}/{MAX_POINTS}</span>
      </div>

      <div className="fit__controls" role="group" aria-label="Model degree">
        {DEGREES.map((o) => (
          <button
            key={o.d} type="button" className={`fit__seg ${degree === o.d ? 'is-on' : ''}`}
            aria-pressed={degree === o.d} onClick={() => setDegree(o.d)}
          >
            {o.label}
          </button>
        ))}
        <span className="fit__spacer" />
        <button type="button" className={`fit__tog ${showBand ? 'is-on' : ''}`} aria-pressed={showBand} onClick={() => setShowBand((v) => !v)}>
          <i className="fit__sw fit__sw--band" /> 95% CI
        </button>
        <button type="button" className={`fit__tog ${showResiduals ? 'is-on' : ''}`} aria-pressed={showResiduals} onClick={() => setShowResiduals((v) => !v)}>
          <i className="fit__sw fit__sw--res" /> Residuals
        </button>
      </div>

      <div className="fit__plot">
        <svg
          ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="fit__svg"
          role="img" aria-label="Scatter plot with a live least-squares fit. Drag points or click to add one."
        >
          <defs>
            <clipPath id="fit-clip"><rect x={PAD.l} y={PAD.t} width={PW} height={PH} /></clipPath>
          </defs>

          {[0, 20, 40, 60, 80, 100].map((v) => (
            <g key={`y${v}`}>
              <line x1={PAD.l} x2={W - PAD.r} y1={sy(v)} y2={sy(v)} className="fit__grid" />
              <text x={PAD.l - 10} y={sy(v) + 4} className="fit__tick" textAnchor="end">{v}</text>
            </g>
          ))}
          {[0, 2, 4, 6, 8, 10].map((v) => (
            <text key={`x${v}`} x={sx(v)} y={H - PAD.b + 20} className="fit__tick" textAnchor="middle">{v}</text>
          ))}
          <text x={PAD.l + PW / 2} y={H - 6} className="fit__axis" textAnchor="middle">hours spent cleaning the data →</text>
          <text transform={`translate(13 ${PAD.t + PH / 2}) rotate(-90)`} className="fit__axis" textAnchor="middle">trust in the result (%) →</text>

          <rect x={PAD.l} y={PAD.t} width={PW} height={PH} className="fit__hit" onClick={onPlotClick} />

          <g clipPath="url(#fit-clip)" pointerEvents="none">
            {fit && showBand && <path d={fit.band} className="fit__band" />}
            {fit && showResiduals && points.map((p) => (
              <line key={`r${p.id}`} x1={sx(p.x)} x2={sx(p.x)} y1={sy(p.y)} y2={sy(fit.yhat(p.x))} className="fit__res" />
            ))}
            {fit && <path d={fit.line} className="fit__line" />}
          </g>

          {points.map((p, i) => (
            <g
              key={p.id} className={`fit__pt ${dragging === p.id ? 'is-drag' : ''}`}
              transform={`translate(${sx(p.x)} ${sy(p.y)})`}
              tabIndex={0} role="button"
              aria-label={`Point ${i + 1}: x ${p.x.toFixed(1)}, y ${p.y.toFixed(0)}. Arrow keys move it, Delete removes it.`}
              onPointerDown={(e) => onPointDown(e, p.id)}
              onPointerMove={(e) => onPointMove(e, p.id)}
              onPointerUp={() => setDragging(null)}
              onPointerCancel={() => setDragging(null)}
              onDoubleClick={() => remove(p.id)}
              onKeyDown={(e) => onKey(e, p)}
            >
              <circle r="17" className="fit__pt-hit" />
              <circle r="7" className="fit__pt-dot" />
            </g>
          ))}

          {!touched && hint && (
            <g className="fit__hint" transform={`translate(${sx(hint.x)} ${sy(hint.y)})`} aria-hidden="true">
              <circle r="15" className="fit__pulse" />
              <path d="M-40,-78 C-50,-56 -36,-30 -14,-16" className="fit__arrow" />
              <path d="M-14,-16 l-9,-2 M-14,-16 l-1,-9" className="fit__arrow" />
              <text x="-44" y="-88" className="fit__hint-text" textAnchor="middle">drag me!</text>
            </g>
          )}
        </svg>
      </div>

      <figcaption id="fit-cap" className="fit__read">
        <div className="fit__eq mono">
          {fit && degree === 1 && (
            <>ŷ = <b>{fit.intercept.toFixed(1)}</b> {fit.slope < 0 ? '−' : '+'} <b>{Math.abs(fit.slope).toFixed(2)}</b>·x</>
          )}
          {fit && degree > 1 && <>ŷ = polynomial, degree <b>{degree}</b></>}
          {!fit && <>need more points to fit</>}
        </div>
        <dl className="fit__stats">
          <div><dt>R²</dt><dd className="mono">{fit ? fit.r2.toFixed(3) : '—'}</dd></div>
          <div><dt>RMSE</dt><dd className="mono">{fit ? fit.rmse.toFixed(1) : '—'}</dd></div>
          <div className="fit__actions">
            <button type="button" onClick={reshuffle} aria-label="New random sample"><Icon name="refresh" size={15} /> Resample</button>
            <button type="button" onClick={reset}>Reset</button>
          </div>
        </dl>
        <p className="fit__help">Drag a point · click empty space to add · double-click to remove. The line refits on every move.</p>
      </figcaption>
    </figure>
  );
}
