import React, { useEffect, useRef } from 'react';
import Frame from '../Frame';
import useInView, { prefersReducedMotion } from '../../../hooks/useInView';
import useTicker, { useLoopCount } from '../../../hooks/useTicker';
import useTyped from '../../../hooks/useTyped';
import './ManimVisual.css';

const STEPS = [1900, 1300, 1800, 2800, 2300, 1900, 1500];
const STATUS = ['prompt', 'llm planning', 'writing manim', 'rendering', 'rendering', 'ffmpeg mux', 'exported'];
const PROMPT = 'explain the derivative of sin(x)';
const CHAPTERS = ['Intro', 'Tangent', 'Derivative', 'Recap'];
const CHAPTER_AT = [-1, 0, 0, 1, 2, 3, 4];
const PROGRESS = [0, 4, 18, 46, 78, 100, 100];

/* plot space: x ∈ [0, 2π] → [14, 186], y amplitude 26 around 52 */
const X0 = 14;
const XW = 172;
const Y0 = 52;
const AMP = 26;
const toX = (t) => X0 + (t / (2 * Math.PI)) * XW;
const curve = (fn) => Array.from({ length: 97 }, (_, i) => {
  const t = (i / 96) * 2 * Math.PI;
  return `${i ? 'L' : 'M'}${toX(t).toFixed(2)} ${(Y0 - AMP * fn(t)).toFixed(2)}`;
}).join(' ');
const SIN = curve(Math.sin);
const COS = curve(Math.cos);
const WAVE = Array.from({ length: 36 }, (_, i) => 30 + ((i * 47) % 70));

/* Tangent line + point riding sin(x); updates the DOM directly each frame. */
function Tangent({ duration }) {
  const gRef = useRef(null);
  const readRef = useRef(null);
  useEffect(() => {
    const draw = (t) => {
      const x = toX(t);
      const y = Y0 - AMP * Math.sin(t);
      const slope = (-AMP * Math.cos(t)) / (XW / (2 * Math.PI));
      const deg = (Math.atan(slope) * 180) / Math.PI;
      gRef.current?.setAttribute('transform', `translate(${x} ${y}) rotate(${deg})`);
      if (readRef.current) readRef.current.textContent = `slope = cos(x) = ${Math.cos(t).toFixed(2)}`;
    };
    if (prefersReducedMotion()) { draw(Math.PI / 4); return undefined; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      draw(p * 2 * Math.PI);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);
  return (
    <>
      <g ref={gRef} className="mx__tangent">
        <line x1="-26" y1="0" x2="26" y2="0" />
        <circle r="2.4" />
      </g>
      <text ref={readRef} x="186" y="14" className="mx__slope" textAnchor="end" />
    </>
  );
}

function ManimScene({ step }) {
  const prompt = useTyped(PROMPT, true, { speed: 42 });
  const chapter = CHAPTER_AT[step];

  return (
    <div className="mx">
      <div className="mx__prompt">
        <span className="mx__chev">›</span>{prompt}<i className={step === 0 ? 'mx__caret' : ''} />
      </div>

      <ol className={`mx__chapters${step >= 1 ? ' is-on' : ''}`}>
        {CHAPTERS.map((c, i) => (
          <li key={c} className={i < chapter ? 'is-done' : i === chapter ? 'is-now' : ''} style={{ '--i': i }}>
            <b>{String(i + 1).padStart(2, '0')}</b>{c}
          </li>
        ))}
      </ol>

      <svg viewBox="0 0 200 100" className="mx__stage" aria-hidden="true">
        {step >= 2 && (
          <g className="mx__axes">
            <path d={`M${X0} ${Y0}H190`} pathLength="1" />
            <path d={`M${X0} 88V14`} pathLength="1" />
            {[1, 2, 3, 4].map((k) => (
              <text key={k} x={toX((k * Math.PI) / 2)} y={Y0 + 9} textAnchor="middle">
                {['π/2', 'π', '3π/2', '2π'][k - 1]}
              </text>
            ))}
          </g>
        )}
        {step >= 2 && <path d={SIN} className="mx__sin" pathLength="1" />}
        {step >= 2 && <text x={toX(Math.PI / 2) + 4} y={Y0 - AMP - 4} className="mx__lbl mx__lbl--sin">sin x</text>}
        {step === 3 && <Tangent duration={STEPS[3] - 200} />}
        {step >= 4 && <path d={COS} className="mx__cos" pathLength="1" />}
        {step >= 4 && <text x={X0 + 4} y={Y0 - AMP - 4} className="mx__lbl mx__lbl--cos">cos x</text>}
      </svg>

      <p className={`mx__eq${step >= 4 ? ' is-on' : ''}`}>
        <i>d</i>⁄<i>dx</i> sin <i>x</i> = <span>cos <i>x</i></span>
      </p>

      <div className="mx__foot">
        <div className={`mx__wave${step >= 2 && step < 6 ? ' is-on' : ''}`} aria-hidden="true">
          {WAVE.map((h, i) => <i key={i} style={{ '--h': `${h}%`, '--i': i }} />)}
        </div>
        <div className="mx__render">
          <span className="mx__render-k">
            {step >= 6 ? '✓ derivative_of_sin.mp4 · 2:14' : step >= 5 ? 'ffmpeg · muxing audio + video' : `render · 1080p60 · ch.${Math.max(1, chapter + 1)}`}
          </span>
          <span className="mx__bar">
            <b style={{ width: `${PROGRESS[step]}%`, transitionDuration: `${STEPS[step]}ms` }} />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ManimVisual() {
  const [ref, inView] = useInView({ threshold: 0.35 });
  const step = useTicker(STEPS, inView);
  const loop = useLoopCount(step);
  return (
    <div ref={ref} className="rv-host">
      <Frame title="manimax — ollama · local" status={STATUS[step]} tone={step >= 6 ? 'ok' : 'run'} dark>
        {inView || step > 0 ? <ManimScene key={loop} step={step} /> : null}
      </Frame>
    </div>
  );
}
