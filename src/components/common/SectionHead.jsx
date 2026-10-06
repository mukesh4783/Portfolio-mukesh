import React from 'react';
import './SectionHead.css';

/* Section title with a pandas-flavoured index label and an optional
   handwritten margin note. */
export default function SectionHead({ index, code, title, lede, note }) {
  return (
    <header className="shead reveal">
      <p className="shead__code mono">
        <span className="shead__idx">[{index}]</span> {code}
      </p>
      <h2 className="shead__title">{title}</h2>
      {lede && <p className="shead__lede">{lede}</p>}
      {note && <p className="shead__note hand" aria-hidden="true">{note}</p>}
    </header>
  );
}
