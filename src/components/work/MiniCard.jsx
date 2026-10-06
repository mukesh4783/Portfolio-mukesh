import { motion } from 'motion/react';
import { GithubLogo } from '@phosphor-icons/react';
import Chips from '../ui/Chips.jsx';
import StockDemo from './demos/StockDemo.jsx';
import MemeDemo from './demos/MemeDemo.jsx';
import WaffleDemo from './demos/WaffleDemo.jsx';

const DEMOS = Object.freeze({ stock: StockDemo, meme: MemeDemo, waffle: WaffleDemo });

export default function MiniCard({ project, i }) {
  const Demo = DEMOS[project.demo];
  return (
    <motion.article
      className={`mini mini--${i}`}
      id={project.id}
      aria-labelledby={`${project.id}-title`}
      initial={{ opacity: 0, y: 40, rotate: i % 2 ? 1.5 : -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
    >
      <div className="mini__demo">
        <Demo />
      </div>
      <p className="mini__meta mono">
        <span>{project.kicker}</span>
        <span>{project.date}</span>
      </p>
      <h4 className="mini__name" id={`${project.id}-title`}>{project.name}</h4>
      <p className="mini__text">{project.summary}</p>
      <div className="mini__foot">
        <Chips items={project.stack} />
        {project.github && (
          <a className="link" href={project.github} target="_blank" rel="noreferrer">
            <GithubLogo size={16} weight="bold" /> Source
          </a>
        )}
      </div>
    </motion.article>
  );
}
