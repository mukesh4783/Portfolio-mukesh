import React, { useRef } from 'react';
import { PROFILE, ABOUT } from '../data/profile';
import './About.css';

const PRINCIPLES = [
  { k: 'Frame the question', v: 'Before a single model: what decision will this answer change, and how will we know it worked?' },
  { k: 'Let the data argue', v: 'EDA first, baselines second. The simplest model that survives honest validation wins.' },
  { k: 'Ship, then measure', v: 'Latency, grounding and cost are features. If it isn’t measured in production, it isn’t done.' },
];

/* Halftone monogram shown until a real photo is added in data/profile.js */
function PortraitPlaceholder() {
  const dots = [];
  for (let y = 0; y < 26; y += 1) {
    for (let x = 0; x < 20; x += 1) {
      const dx = (x - 9.5) / 10;
      const dy = (y - 11) / 13;
      const r = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy)) * 2.4;
      if (r > 0.25) dots.push(<circle key={`${x}-${y}`} cx={x * 10 + 5} cy={y * 10 + 5} r={r} />);
    }
  }
  return (
    <svg viewBox="0 0 200 260" className="plate__svg" aria-hidden="true">
      <g className="plate__dots">{dots}</g>
      <text x="100" y="150" textAnchor="middle" className="plate__mono">{PROFILE.initials}</text>
    </svg>
  );
}

/* Gentle 3D tilt that follows the pointer. */
function useTilt() {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty('--rx', '0deg');
    ref.current?.style.setProperty('--ry', '0deg');
  };
  return { ref, onPointerMove: onMove, onPointerLeave: onLeave };
}

export default function About() {
  const tilt = useTilt();
  const name = `${PROFILE.firstName} ${PROFILE.middleName} ${PROFILE.lastName}`;

  return (
    <section className="section about" id="about" aria-labelledby="about-h">
      <div className="wrap about__grid">
        <figure className="plate reveal">
          <div className="plate__frame" {...tilt}>
            {PROFILE.photo
              ? <img src={PROFILE.photo} alt={`Portrait of ${name}`} className="plate__img" />
              : <PortraitPlaceholder />}
            <span className="plate__glare" aria-hidden="true" />
          </div>
          <figcaption className="plate__cap">
            <span>Plate I.</span> {name}, {PROFILE.location}.
          </figcaption>
        </figure>

        <div className="about__text">
          <div className="reveal">
            <span className="eyebrow">§ 04 — About</span>
            <h2 className="heading" id="about-h">A scientist’s habits, <em>an engineer’s hands.</em></h2>
          </div>

          {ABOUT.paragraphs.map((p, i) => (
            <p key={p.slice(0, 24)} className={`about__p reveal${i === 0 ? ' about__p--lead' : ''}`}>{p}</p>
          ))}

          <dl className="about__facts reveal">
            {ABOUT.facts.map((f) => (
              <div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>
            ))}
          </dl>
        </div>
      </div>

      <div className="wrap">
        <ol className="principles">
          {PRINCIPLES.map((p, i) => (
            <li key={p.k} className="principle reveal" style={{ '--d': `${i * 0.1}s` }}>
              <span className="principle__n">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="principle__k">{p.k}</h3>
              <p className="principle__v">{p.v}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
