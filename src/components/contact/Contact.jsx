import React, { useState } from 'react';
import { PROFILE } from '../../data/profile';
import Icon from '../common/Icon';
import './Contact.css';

/* A sigmoid "decision boundary" — the joke is the point sits well past 0.5. */
function Sigmoid() {
  const pts = Array.from({ length: 61 }, (_, i) => {
    const x = -6 + i * 0.2;
    return `${i ? 'L' : 'M'}${(20 + (i / 60) * 360).toFixed(1)},${(150 - 120 / (1 + Math.exp(-x))).toFixed(1)}`;
  }).join('');
  return (
    <svg viewBox="0 0 400 170" className="ct__sig" aria-hidden="true">
      <line x1="20" x2="380" y1="150" y2="150" className="ct__sig-axis" />
      <line x1="20" x2="380" y1="90" y2="90" className="ct__sig-half" />
      <text x="384" y="94" className="ct__sig-lbl">0.5</text>
      <path d={pts} className="ct__sig-curve" />
      <circle cx="318" cy="37" r="9" className="ct__sig-dot" />
      <text x="300" y="20" textAnchor="end" className="ct__sig-you">you, reading this far</text>
    </svg>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <section className="section ct" id="contact">
      <div className="wrap">
        <div className="ct__card reveal">
          <div className="ct__copy">
            <p className="mono ct__code"><span>[6]</span> model.predict(you) → <b>p(let’s talk) = 0.97</b></p>
            <h2 className="ct__title">Have a dataset, a question, or an internship? <span>Let’s talk.</span></h2>
            <p className="ct__lede">I’m looking for data science and ML internships where I can learn from people who ship. The fastest way to reach me is email.</p>

            <div className="ct__actions">
              <a className="btn" href={`mailto:${PROFILE.email}`}><Icon name="mail" /> {PROFILE.email}</a>
              <button type="button" className="btn btn--ghost ct__copybtn" onClick={copy} aria-live="polite">
                <Icon name={copied ? 'check' : 'copy'} /> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <ul className="ct__links">
              <li><a href={PROFILE.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin" /> LinkedIn <Icon name="arrowUpRight" size={15} /></a></li>
              <li><a href={PROFILE.github} target="_blank" rel="noreferrer"><Icon name="github" /> GitHub <Icon name="arrowUpRight" size={15} /></a></li>
              <li><a href={PROFILE.resume} download><Icon name="arrowDown" /> Résumé (PDF)</a></li>
            </ul>
          </div>
          <Sigmoid />
        </div>
      </div>

      <footer className="wrap ct__footer">
        <span>© {new Date().getFullYear()} Mukesh Kumar Pandey</span>
        <span className="mono">hand-built with React + SVG · every chart is real code</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </section>
  );
}
