import React from 'react';
import TechIcon from '../TechIcon';
import useInView from '../../hooks/useInView';
import useCountUp from '../../hooks/useCountUp';
import { CODING } from '../../data/record';
import './CodingCards.css';

const LEVELS = [
  { k: 'easy', label: 'Easy', color: 'var(--s2)' },
  { k: 'medium', label: 'Medium', color: 'var(--s3)' },
  { k: 'hard', label: 'Hard', color: 'var(--s1)' },
];

/* Deterministic pseudo-random activity so the heatmap is stable between renders.
   TODO: swap for real contribution data (e.g. github-contributions-api) later. */
const WEEKS = 30;
const HEAT = Array.from({ length: WEEKS * 7 }, (_, i) => {
  const v = Math.sin(i * 12.9898) * 43758.5453;
  const r = v - Math.floor(v);
  const trend = i / (WEEKS * 7);
  return r < 0.3 - trend * 0.15 ? 0 : Math.min(4, Math.floor(r * 3 + trend * 2.2));
});

const RING = 2 * Math.PI * 40;

function LeetCodeCard({ run }) {
  const { solved, total, handle, href } = CODING.leetcode;
  const sum = solved.easy + solved.medium + solved.hard;
  const n = useCountUp(sum, { start: run, duration: 1500 });
  const offsets = LEVELS.map((_, i) => LEVELS.slice(0, i).reduce((s, l) => s + solved[l.k] / sum, 0));

  return (
    <a className="code-card" href={href} target="_blank" rel="noopener noreferrer">
      <header className="code-card__head">
        <span className="code-card__logo"><TechIcon name="LeetCode" /></span>
        <span className="code-card__name">LeetCode<small>@{handle}</small></span>
        <TechIcon name="Arrow" className="code-card__go" />
      </header>
      <div className="lc">
        <div className="lc__dial">
          <svg viewBox="0 0 100 100" className="lc__ring" aria-hidden="true">
            <circle cx="50" cy="50" r="40" className="lc__track" />
            {LEVELS.map((l, i) => (
              <circle key={l.k} cx="50" cy="50" r="40" className="lc__arc" stroke={l.color}
                style={{
                  strokeDasharray: `${run ? (solved[l.k] / sum) * RING - 3 : 0} ${RING}`,
                  strokeDashoffset: -offsets[i] * RING,
                  transitionDelay: `${i * 0.2}s`,
                }} />
            ))}
          </svg>
          <div className="lc__center"><b>{Math.round(n)}</b><span>solved</span></div>
        </div>
        <ul className="lc__rows">
          {LEVELS.map((l, i) => (
            <li key={l.k}>
              <span className="lc__lbl" style={{ color: l.color }}>{l.label}</span>
              <span className="lc__n">{solved[l.k]}<small> / {total[l.k]}</small></span>
              <span className="lc__bar">
                <b style={{
                  width: run ? `${Math.min(100, (solved[l.k] / total[l.k]) * 400)}%` : 0,
                  background: l.color,
                  transitionDelay: `${0.3 + i * 0.15}s`,
                }} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </a>
  );
}

function GitHubCard({ run }) {
  const { handle, href, contributions, repos } = CODING.github;
  const n = useCountUp(contributions, { start: run, duration: 1600 });
  return (
    <a className="code-card" href={href} target="_blank" rel="noopener noreferrer">
      <header className="code-card__head">
        <span className="code-card__logo"><TechIcon name="GitHub" /></span>
        <span className="code-card__name">GitHub<small>@{handle}</small></span>
        <TechIcon name="Arrow" className="code-card__go" />
      </header>
      <div className={`gh${run ? ' is-in' : ''}`} style={{ '--weeks': WEEKS }} aria-hidden="true">
        {HEAT.map((v, i) => (
          <i key={i} className={`gh__c l${v}`} style={{ '--d': `${(Math.floor(i / 7) + (i % 7)) * 0.018}s` }} />
        ))}
      </div>
      <p className="gh__foot">
        <span><b>{Math.round(n)}</b> contributions · last year</span>
        <span><b>{repos}</b> public repos</span>
      </p>
    </a>
  );
}

export default function CodingCards() {
  const [ref, inView] = useInView({ once: true, threshold: 0.3 });
  return (
    <div ref={ref} className="code-cards">
      <LeetCodeCard run={inView} />
      <GitHubCard run={inView} />
    </div>
  );
}
