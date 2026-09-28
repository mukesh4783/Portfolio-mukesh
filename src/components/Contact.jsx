import React, { useEffect, useState } from 'react';
import TechIcon from './TechIcon';
import useInView from '../hooks/useInView';
import { PROFILE } from '../data/profile';
import './Contact.css';

/* Scatter + least-squares fit that draws in behind the heading. */
const PTS = Array.from({ length: 28 }, (_, i) => {
  const x = 4 + i * 3.4;
  const noise = Math.sin(i * 7.31) * 9 + Math.cos(i * 3.17) * 5;
  return { x, y: 52 - x * 0.42 + noise };
});
const N = PTS.length;
const MX = PTS.reduce((s, p) => s + p.x, 0) / N;
const MY = PTS.reduce((s, p) => s + p.y, 0) / N;
const SLOPE = PTS.reduce((s, p) => s + (p.x - MX) * (p.y - MY), 0) / PTS.reduce((s, p) => s + (p.x - MX) ** 2, 0);
const fit = (x) => MY + SLOPE * (x - MX);

function FitPlot({ run }) {
  return (
    <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice" className={`fit${run ? ' is-in' : ''}`} aria-hidden="true">
      <path d={`M0 ${fit(0) - 7} L100 ${fit(100) - 7} L100 ${fit(100) + 7} L0 ${fit(0) + 7}Z`} className="fit__band" />
      {PTS.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="0.32" className="fit__pt" style={{ '--i': i }} />
      ))}
      <line x1="0" y1={fit(0)} x2="100" y2={fit(100)} className="fit__line" />
    </svg>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <div className="contact__mail">
      <a href={`mailto:${PROFILE.email}`} className="contact__addr">{PROFILE.email}</a>
      <button type="button" className={`contact__copy${copied ? ' is-done' : ''}`} onClick={copy}
        aria-label="Copy email address">
        <TechIcon name={copied ? 'Check' : 'Copy'} size={16} />
        <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
}

export default function Contact() {
  const [ref, inView] = useInView({ once: true, threshold: 0.25 });
  const year = new Date().getFullYear();

  return (
    <section className="contact" id="contact" aria-labelledby="contact-h" ref={ref}>
      <FitPlot run={inView} />
      <div className="wrap contact__inner">
        <span className="eyebrow contact__eyebrow reveal">§ 05 — Contact</span>
        <h2 className="contact__h reveal" id="contact-h">
          Have a dataset that <br />needs <em>a story?</em>
        </h2>
        <p className="contact__lead reveal">
          I’m looking for data science and ML internships for 2026 — and I’m always happy to talk
          about retrieval, evaluation, or a chart that isn’t working yet.
        </p>

        <div className="reveal"><CopyEmail /></div>

        <ul className="contact__links">
          {PROFILE.socials.map((s, i) => (
            <li key={s.label} className="reveal" style={{ '--d': `${i * 0.06}s` }}>
              <a href={s.href} target={s.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer">
                <span className="contact__ico"><TechIcon name={s.icon} mono /></span>
                <span className="contact__lbl">{s.label}</span>
                <span className="contact__handle">{s.handle}</span>
                <TechIcon name="Arrow" className="contact__arrow" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="foot wrap">
        <span>© {year} {PROFILE.firstName} {PROFILE.lastName}</span>
        <span>Set in Newsreader &amp; IBM Plex · Built with React</span>
        <a href="#top" className="foot__top">Back to top ↑</a>
      </footer>
    </section>
  );
}
