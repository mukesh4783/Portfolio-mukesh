import React from 'react';
import TechIcon from './TechIcon';
import { SKILL_GROUPS, METHODS } from '../data/skills';
import { projectCountByTech } from '../data/projects';
import './Toolkit.css';

const COUNTS = projectCountByTech();

function Tool({ name, onPick }) {
  const n = COUNTS[name] ?? 0;
  const inner = (
    <>
      <span className="tool__chip"><TechIcon name={name} /></span>
      <span className="tool__name">{name}</span>
      {n > 0 && <span className="tool__n" title={`Used in ${n} project${n > 1 ? 's' : ''}`}>{n}</span>}
    </>
  );
  if (!n) return <li className="tool">{inner}</li>;
  return (
    <li>
      <button type="button" className="tool tool--link" onClick={() => onPick(name)}
        aria-label={`${name} — show ${n} project${n > 1 ? 's' : ''}`}>
        {inner}
      </button>
    </li>
  );
}

export default function Toolkit({ onPickTech }) {
  return (
    <section className="section toolkit" id="toolkit" aria-labelledby="toolkit-h">
      <div className="wrap">
        <header className="toolkit__head">
          <div className="reveal">
            <span className="eyebrow">§ 01 — Toolkit</span>
            <h2 className="heading" id="toolkit-h">The instruments <em>I reach for.</em></h2>
          </div>
          <p className="toolkit__intro reveal" style={{ '--d': '0.1s' }}>
            Five families of tools, from notebooks to deployment. Anything with a
            <span className="toolkit__badge">n</span> is used in shipped work — click it to filter the projects below.
          </p>
        </header>

        <ol className="toolkit__rows">
          {SKILL_GROUPS.map((g, i) => (
            <li key={g.id} className="toolkit__row reveal" style={{ '--d': `${i * 0.06}s` }}>
              <div className="toolkit__meta">
                <span className="toolkit__idx">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="toolkit__title">{g.title}</h3>
                <p className="toolkit__blurb">{g.blurb}</p>
              </div>
              <ul className="toolkit__tools">
                {g.items.map((t) => <Tool key={t} name={t} onPick={onPickTech} />)}
              </ul>
            </li>
          ))}
        </ol>

        <div className="toolkit__methods reveal">
          <span className="toolkit__methods-k">Methods &amp; techniques</span>
          <ul>
            {METHODS.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
