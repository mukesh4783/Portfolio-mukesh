import React from 'react';
import { ABOUT } from '../../data/profile';
import SectionHead from '../common/SectionHead';
import './About.css';

/* Grades on one comparable scale (CGPA ×10) — a tiny, honest dot plot. */
const GRADES = [
  { label: 'Class 10', value: 92.6, show: '92.6%' },
  { label: 'Class 12', value: 86, show: '86%' },
  { label: 'B.Tech', value: 88.9, show: '8.89 CGPA' },
];
const G_MIN = 80;
const G_MAX = 100;
const gx = (v) => ((v - G_MIN) / (G_MAX - G_MIN)) * 100;

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="wrap">
        <SectionHead index="5" code="mukesh.info()" title={ABOUT.lead} />

        <div className="about__grid">
          <div className="about__text reveal">
            {ABOUT.paragraphs.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
            <ul className="about__soft">
              {ABOUT.softSkills.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>

          <div className="about__side reveal">
            <dl className="about__facts">
              {ABOUT.facts.map((f) => (
                <div key={f.k}><dt className="mono">{f.k}</dt><dd>{f.v}</dd></div>
              ))}
            </dl>

            <figure className="grades">
              <figcaption className="mono">academic scores · on a common % scale</figcaption>
              {GRADES.map((g) => (
                <div key={g.label} className="grades__row">
                  <span className="grades__lbl">{g.label}</span>
                  <span className="grades__track">
                    <span className="grades__stem" style={{ width: `${gx(g.value)}%` }} />
                    <span className="grades__dot" style={{ left: `${gx(g.value)}%` }} />
                  </span>
                  <span className="grades__val mono">{g.show}</span>
                </div>
              ))}
              <div className="grades__row grades__axis" aria-hidden="true">
                <span />
                <span className="grades__track">
                  {[80, 85, 90, 95, 100].map((t) => (
                    <span key={t} className="grades__tick mono" style={{ left: `${gx(t)}%` }}>{t}</span>
                  ))}
                </span>
                <span />
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
