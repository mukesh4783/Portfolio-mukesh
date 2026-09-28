import React from 'react';
import './Marquee.css';

const ITEMS = [
  'Retrieval-augmented generation', 'exploratory analysis', 'Vector search', 'fine-tuning',
  'Dashboards', 'evaluation', 'Prompt engineering', 'feature engineering', 'Local LLMs', 'statistics',
];

/* Two copies of the row so the loop is seamless at translateX(-50%). */
export default function Marquee() {
  const row = ITEMS.map((t, i) => (
    <span key={t} className={`marquee__item${i % 2 ? ' marquee__item--mono' : ''}`}>
      {t}<span className="marquee__sep" aria-hidden="true">✳</span>
    </span>
  ));
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">{row}{row}</div>
    </div>
  );
}
