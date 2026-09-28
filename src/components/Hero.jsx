import React, { useCallback, useEffect, useState } from 'react';
import ClusterField from './hero/ClusterField';
import TechIcon from './TechIcon';
import { PROFILE } from '../data/profile';
import './Hero.css';

/* Each word slides up out of its own mask, staggered. */
function SplitWords({ text, start = 0, className = '' }) {
  return text.split(' ').map((w, i) => (
    <span className={`split ${className}`} key={`${w}-${i}`}>
      <span className="split__in" style={{ '--d': `${start + i * 0.08}s` }}>{w}</span>
    </span>
  ));
}

function LocalTime() {
  const fmt = useCallback(() => new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', timeZone: PROFILE.timezone,
  }), []);
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const t = setInterval(() => setTime(fmt()), 30000);
    return () => clearInterval(t);
  }, [fmt]);
  return <>{time} IST</>;
}

const FACTS = [
  { k: 'Focus', v: 'RAG · LLM pipelines · Analytics' },
  { k: 'Studying', v: 'B.Tech CSE — LPU, 8.89 CGPA' },
  { k: 'Based in', v: PROFILE.location },
  { k: 'Local time', v: <LocalTime /> },
];

export default function Hero() {
  const [stats, setStats] = useState({ iter: 0, inertia: null, status: 'sampling' });
  const onStats = useCallback((s) => setStats(s), []);

  return (
    <section className="hero" id="top" aria-label="Introduction">
      <div className="hero__inner wrap">
        <div className="hero__text">
          <p className="hero__kicker">
            <span className="hero__kicker-rule" />
            {PROFILE.role}
          </p>

          <h1 className="hero__name">
            <span className="hero__line"><SplitWords text={`${PROFILE.firstName} ${PROFILE.middleName}`} start={0.15} /></span>
            <span className="hero__line hero__line--em">
              <SplitWords text={PROFILE.lastName} start={0.35} className="split--em" />
              <span className="split split--dot"><span className="split__in hero__dot" style={{ '--d': '0.5s' }}>.</span></span>
            </span>
          </h1>

          <p className="hero__thesis">{PROFILE.thesis}</p>

          <div className="hero__ctas">
            <a href="#work" className="btn btn--solid">
              See the work <TechIcon name="Arrow" className="btn__arrow" size={16} />
            </a>
            <a href={PROFILE.resume} className="btn" target="_blank" rel="noopener noreferrer">
              <TechIcon name="Download" size={16} /> Download CV
            </a>
          </div>
        </div>

        <figure className="hero__figure">
          <div className="hero__fig-head">
            <span>Fig. 0 — Cluster analysis</span>
            <span className="hero__live"><i />live</span>
          </div>
          <ClusterField onStats={onStats} />
          <figcaption className="hero__caption">
            <span>
              <b>k-means</b> (Lloyd’s algorithm) on <i>n</i> = 240 synthetic samples, <i>k</i> = 4.
            </span>
            <span className="hero__readout" aria-live="off">
              <span>iter <b>{String(stats.iter).padStart(2, '0')}</b></span>
              <span>inertia <b>{stats.inertia == null ? '—' : stats.inertia.toFixed(2)}</b></span>
              <span className={`hero__state hero__state--${stats.status}`}>{stats.status}</span>
            </span>
            <span className="hero__hint">Hover to inspect · click to resample</span>
          </figcaption>
        </figure>
      </div>

      <dl className="hero__facts wrap">
        {FACTS.map((f, i) => (
          <div key={f.k} className="hero__fact" style={{ '--d': `${0.8 + i * 0.08}s` }}>
            <dt>{f.k}</dt>
            <dd>{f.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
