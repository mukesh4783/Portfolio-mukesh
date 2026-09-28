import React, { useState } from 'react';
import TechIcon from './TechIcon';
import ProjectVisual from './work/ProjectVisual';
import FlowDiagram from './work/FlowDiagram';
import useInView from '../hooks/useInView';
import useCountUp from '../hooks/useCountUp';
import { PROJECTS, FILTER_TECHS, projectCountByTech } from '../data/projects';
import './Work.css';

const COUNTS = projectCountByTech();

function FilterBar({ filter, onFilter }) {
  const all = [null, ...FILTER_TECHS];
  return (
    <div className="wfilter" role="toolbar" aria-label="Filter projects by technology">
      <span className="wfilter__k">Filter</span>
      {all.map((t) => (
        <button
          key={t ?? 'all'}
          type="button"
          className={`wfilter__btn${filter === t ? ' is-on' : ''}`}
          onClick={() => onFilter(filter === t ? null : t)}
          aria-pressed={filter === t}
        >
          {t && <TechIcon name={t} className="wfilter__icon" />}
          {t ?? 'All'}
          <sup>{t ? COUNTS[t] ?? 0 : PROJECTS.length}</sup>
        </button>
      ))}
    </div>
  );
}

function Highlight({ h, run, i }) {
  const n = useCountUp(h.value ?? 0, { start: run, delay: 200 + i * 150, duration: 1400 });
  return (
    <div className="proj__hl">
      <dt className="proj__hl-v">
        {h.text ?? (<>{h.prefix}{Math.round(n)}<small>{h.suffix}</small></>)}
      </dt>
      <dd className="proj__hl-k">{h.label}</dd>
    </div>
  );
}

function ProjectCard({ project: p, index, highlight }) {
  const [open, setOpen] = useState(false);
  const [ref, seen] = useInView({ once: true, threshold: 0.12 });
  const flip = index % 2 === 1;

  return (
    <article ref={ref} className={`proj${flip ? ' proj--flip' : ''}${seen ? ' is-in' : ''}`} aria-labelledby={`proj-${p.id}`}>
      <div className="proj__visual">
        <span className="proj__bignum" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <ProjectVisual kind={p.visual} />
        <span className="proj__kind">{p.kind}</span>
      </div>

      <div className="proj__body">
        <p className="proj__meta"><span>{p.no}</span><span>{p.year}</span></p>
        <h3 className="proj__name" id={`proj-${p.id}`}>
          {p.name}
          <span className="proj__sub">{p.subtitle}</span>
        </h3>
        <p className="proj__tagline">{p.tagline}</p>
        <p className="proj__role"><span>Role</span>{p.role}</p>

        <dl className="proj__hls">
          {p.highlights.map((h, i) => <Highlight key={h.label} h={h} run={seen} i={i} />)}
        </dl>

        <FlowDiagram title={p.flowTitle} nodes={p.flow} />

        <ul className="proj__stack" aria-label="Tech stack">
          {p.stack.map((t) => (
            <li key={t} className={highlight === t ? 'is-match' : ''}>
              <span><TechIcon name={t} /></span>{t}
            </li>
          ))}
        </ul>

        <div className={`proj__detail${open ? ' is-open' : ''}`} id={`proj-detail-${p.id}`}>
          <div className="proj__detail-in">
            {p.detail.map((d) => <p key={d.slice(0, 32)}>{d}</p>)}
          </div>
        </div>

        <div className="proj__actions">
          <a href={p.href} target="_blank" rel="noopener noreferrer" className="pbtn pbtn--solid">
            <TechIcon name="GitHub" mono className="pbtn__icon" /> View code
          </a>
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noopener noreferrer" className="pbtn">
              Live demo <TechIcon name="Arrow" className="pbtn__icon" />
            </a>
          )}
          <button type="button" className="pbtn pbtn--ghost" onClick={() => setOpen((o) => !o)}
            aria-expanded={open} aria-controls={`proj-detail-${p.id}`}>
            {open ? 'Hide breakdown' : 'Full breakdown'} <span className={`pbtn__plus${open ? ' is-open' : ''}`}>+</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Work({ filter, onFilter }) {
  const visible = filter ? PROJECTS.filter((p) => p.stack.includes(filter)) : PROJECTS;

  return (
    <section className="work" id="work" aria-labelledby="work-h">
      <div className="work__bg" aria-hidden="true" />
      <div className="wrap work__inner">
        <header className="work__head">
          <div className="reveal">
            <span className="eyebrow work__eyebrow">§ 02 — Selected work</span>
            <h2 className="heading work__heading" id="work-h">Figures from <em>the lab.</em></h2>
          </div>
          <p className="work__intro reveal" style={{ '--d': '0.1s' }}>
            Each figure below is a live simulation of how the system actually runs —
            scroll slowly and watch the data move.
          </p>
        </header>

        <FilterBar filter={filter} onFilter={onFilter} />
        <p className="work__result" aria-live="polite">
          {filter
            ? <>Showing <b>{visible.length}</b> of {PROJECTS.length} projects built with <b>{filter}</b>.</>
            : <>{PROJECTS.length} projects · {Object.keys(COUNTS).length} technologies · every one on GitHub.</>}
        </p>

        <div className="work__list">
          {visible.map((p) => (
            <ProjectCard key={p.id} project={p} index={PROJECTS.indexOf(p)} highlight={filter} />
          ))}
        </div>
      </div>
    </section>
  );
}
