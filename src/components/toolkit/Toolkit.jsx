import { useState } from 'react';
import { motion } from 'motion/react';
import { GROUPS, tools } from '../../data/skills.js';
import Drafted from '../ui/Drafted.jsx';
import BrandMark from '../ui/BrandMark.jsx';
import './toolkit.css';

const DEPTH = Object.freeze(['', 'Getting started', 'Working knowledge', 'Daily driver']);
const COUNTS = Object.fromEntries(GROUPS.map((g) => [g.id, g.id === 'all' ? tools.length : tools.filter((t) => t.group === g.id).length]));

function Watermark({ marks }) {
  if (!marks?.length) return null;
  return (
    <span className={`tk__wm tk__wm--${marks.length}`} aria-hidden="true">
      {marks.map((m) => (
        <BrandMark key={m} name={m} className="tk__logo" />
      ))}
    </span>
  );
}

export default function Toolkit() {
  const [group, setGroup] = useState('all');

  return (
    <section className="tk" id="toolkit" aria-labelledby="toolkit-title">
      <div className="wrap">
        <div className="tk__head">
          <Drafted id="toolkit-title">Toolkit</Drafted>
          <p className="tk__intro">
            Printed like a cyanotype: the longer the exposure, the deeper the blue. Deep tiles are tools I use every day.
          </p>
          <div className="tk__bar">
            <div className="tk__filters" role="group" aria-label="Filter tools">
              {GROUPS.map((g) => (
                <button key={g.id} type="button" className="tk__filter" aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>
                  {group === g.id && <motion.span layoutId="tk-pill" className="tk__pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  <span>{g.label}</span>
                  <span className="tk__count mono">{COUNTS[g.id]}</span>
                </button>
              ))}
            </div>
            <ul className="tk__legend mono" aria-label="Exposure scale">
              {[1, 2, 3].map((d) => (
                <li key={d}>
                  <i className={`d${d}`} aria-hidden="true" /> {DEPTH[d]}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="tk__sheet">
          {tools.map((t, i) => {
            const dim = group !== 'all' && group !== t.group;
            return (
              <motion.div
                key={t.name}
                className={`tk__cell tk__cell--${t.size} d${t.exposure} ${dim ? 'is-dim' : ''}`}
                initial={{ opacity: 0, y: 24, rotate: (i % 5) - 2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20, delay: (i % 8) * 0.04 }}
                tabIndex={0}
                aria-label={`${t.name}${t.note ? ` (${t.note})` : ''}: ${DEPTH[t.exposure]}. Used in ${t.used.join(', ')}.`}
              >
                <Watermark marks={t.marks} />
                <span className="tk__top">
                  <span className="tk__name">{t.name}</span>
                  {t.note && <span className="tk__note mono">{t.note}</span>}
                </span>
                <span className="tk__used mono" aria-hidden="true">
                  {t.used.join(' + ')}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
