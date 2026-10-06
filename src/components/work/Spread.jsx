import { ArrowUpRight, GithubLogo } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import Drafted from '../ui/Drafted.jsx';
import Chips from '../ui/Chips.jsx';
import RetrievalDemo from './demos/RetrievalDemo.jsx';
import ManimPlayer from './demos/ManimPlayer.jsx';
import PipelineDemo from './demos/PipelineDemo.jsx';
import RagReel from './RagReel.jsx';

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
};

function Plate({ project, onOpen }) {
  if (project.demo === 'retrieval') return <RetrievalDemo />;
  if (project.demo === 'manim') {
    return <ManimPlayer onWatch={(c) => onOpen({ type: 'video', src: c.full, poster: c.poster, title: `Manimax: ${c.label}`, caption: `Full render with narration, ${c.length}` })} />;
  }
  return <PipelineDemo />;
}

export default function Spread({ project, layout, onOpen }) {
  const hasProof = project.proof === 'rag';
  return (
    <article className={`spread spread--${layout} ${hasProof ? '' : 'spread--noproof'}`} id={project.id} aria-labelledby={`${project.id}-title`}>
      <motion.header className="spread__head" {...reveal}>
        <p className="spread__meta mono">
          <span>{project.kicker}</span>
          <span>{project.date}</span>
        </p>
        <Drafted as="h3" className="spread__title" id={`${project.id}-title`}>
          {project.name}
        </Drafted>
      </motion.header>

      <motion.div className="spread__plate" {...reveal}>
        <Plate project={project} onOpen={onOpen} />
      </motion.div>

      <motion.div className="spread__copy" {...reveal}>
        <p className="spread__summary">{project.summary}</p>
        <ul className="spread__points">
          {project.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <dl className="spread__metrics">
          {project.metrics.map((m) => (
            <div key={m.v}>
              <dt>{m.v}</dt>
              <dd>{m.k}</dd>
            </div>
          ))}
        </dl>
        <Chips items={project.stack} className="spread__stack" />
        <div className="spread__links">
          {project.live && (
            <a className="btn btn--sm" href={project.live} target="_blank" rel="noreferrer">
              Live site <ArrowUpRight size={14} weight="bold" />
            </a>
          )}
          <a className="link" href={project.github} target="_blank" rel="noreferrer">
            <GithubLogo size={16} weight="bold" /> Source
          </a>
        </div>
      </motion.div>

      {hasProof && (
        <motion.div className="spread__proof" {...reveal}>
          <RagReel onOpen={onOpen} />
        </motion.div>
      )}
    </article>
  );
}
