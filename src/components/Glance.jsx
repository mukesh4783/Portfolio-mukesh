import React from 'react';
import useInView from '../hooks/useInView';
import useCountUp from '../hooks/useCountUp';
import { GLANCE } from '../data/profile';
import './Glance.css';

/* Tiny drawn-on-scroll charts, one flavour per stat. */
function MiniViz({ kind, value, max }) {
  if (kind === 'gauge') {
    const frac = value / max;
    return (
      <svg viewBox="0 0 120 64" className="mini">
        <path d="M10 60a50 50 0 0 1 100 0" className="mini__track" />
        <path d="M10 60a50 50 0 0 1 100 0" className="mini__draw" pathLength="1"
          style={{ '--to': 1 - frac }} />
      </svg>
    );
  }
  if (kind === 'dots') {
    return (
      <svg viewBox="0 0 120 64" className="mini">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={24 + i * 36} cy="36" r="12" className="mini__dot" style={{ '--i': i }} />
        ))}
        <path d="M24 36h72" className="mini__track" />
      </svg>
    );
  }
  if (kind === 'rank') {
    const bars = [52, 44, 38, 30, 26, 20, 16, 12];
    return (
      <svg viewBox="0 0 120 64" className="mini">
        {bars.map((h, i) => (
          <rect key={h} x={6 + i * 14} y={60 - h} width="9" height={h}
            className={`mini__bar${i === 7 ? ' is-me' : ''}`} style={{ '--i': i }} />
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 64" className="mini">
      <rect x="18" y="8" width="30" height="52" className="mini__bar" style={{ '--i': 0 }} />
      <rect x="70" y="44" width="30" height="16" className="mini__bar is-me" style={{ '--i': 2 }} />
      <path d="M40 20C62 20 70 30 84 40" className="mini__draw mini__draw--thin" pathLength="1" style={{ '--to': 0 }} />
    </svg>
  );
}

function Stat({ stat, index, run }) {
  const n = useCountUp(stat.value, { start: run, delay: index * 120 });
  return (
    <li className="glance__cell reveal" style={{ '--d': `${index * 0.08}s` }}>
      <span className="glance__idx">0{index + 1}</span>
      <div className="glance__viz"><MiniViz kind={stat.viz} value={stat.value} max={stat.max} /></div>
      <p className="glance__num">
        {stat.prefix && <span className="glance__pre">{stat.prefix}</span>}
        {n.toFixed(stat.decimals)}
        {stat.suffix && <span className="glance__suf">{stat.suffix}</span>}
      </p>
      <p className="glance__label">{stat.label}</p>
      <p className="glance__note">{stat.note}</p>
    </li>
  );
}

export default function Glance() {
  const [ref, inView] = useInView({ once: true, threshold: 0.3 });
  return (
    <section className="glance" aria-label="At a glance">
      <div className="wrap">
        <ul ref={ref} className={`glance__grid${inView ? ' is-in' : ''}`}>
          {GLANCE.map((s, i) => <Stat key={s.label} stat={s} index={i} run={inView} />)}
        </ul>
      </div>
    </section>
  );
}
