import React from 'react';
import Icon from '../common/Icon';
import ToolIcon from '../common/ToolIcon';
import FlowViz from './viz/FlowViz';
import MorphViz from './viz/MorphViz';
import RetrievalViz from './viz/RetrievalViz';
import StockViz from './viz/StockViz';

const VIZ = { retrieval: RetrievalViz, flow: FlowViz, morph: MorphViz, stock: StockViz };

export default function ProjectCard({ project, index, total }) {
  const Viz = VIZ[project.viz];
  return (
    <article className={`proj reveal ${index % 2 ? 'proj--flip' : ''}`} data-c={project.color} aria-labelledby={`p-${project.id}`}>
      <div className="proj__figure">
        <div className="proj__figtag mono">
          <span className="proj__swatch" /> fig.{index + 1} — live, not a screenshot
        </div>
        <Viz />
      </div>

      <div className="proj__body">
        <p className="proj__meta mono">
          <span>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          <span>{project.kicker}</span>
          <span>{project.date}</span>
        </p>
        <h3 className="proj__name" id={`p-${project.id}`}>{project.name}</h3>
        <p className="proj__title">{project.title}</p>
        <p className="proj__summary">{project.summary}</p>

        <dl className="proj__metrics">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>

        <details className="proj__how">
          <summary>How it’s built</summary>
          <ul>{project.how.map((h) => <li key={h}>{h}</li>)}</ul>
        </details>

        <div className="proj__foot">
          <ul className="proj__stack" aria-label="Tech stack">
            {project.stack.map((t) => <li key={t} className="chip"><ToolIcon name={t} />{t}</li>)}
          </ul>
          <a className="proj__link" href={project.repo} target="_blank" rel="noreferrer">
            <Icon name="github" size={16} /> Code <Icon name="arrowUpRight" size={15} />
          </a>
        </div>
      </div>
    </article>
  );
}
