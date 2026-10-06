import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { ArrowUpRight } from '@phosphor-icons/react';
import { education, log, training } from '../../data/record.js';
import Drafted from '../ui/Drafted.jsx';
import './record.css';

const TYPES = Object.freeze({ ship: 'shipped', learn: 'learned', win: 'won', edu: 'school' });

/* A stable short hash per commit message, so the log reads like git. */
function shortHash(text) {
  const h = [...text].reduce((a, ch) => (Math.imul(a, 31) + ch.charCodeAt(0)) >>> 0, 2166136261);
  return h.toString(16).padStart(8, '0').slice(0, 7);
}

// The commit log is sticky; its branch line draws in as the section scrolls past.
function CommitLog({ section }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ['start 70%', 'end 80%'] });
  const grow = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  return (
    <div className="cl">
      <div className="cl__head mono">
        <strong>git log</strong>
        <span>main, {log.length} commits</span>
      </div>
      <div className="cl__body">
        <motion.span className="cl__branch" style={reduce ? undefined : { scaleY: grow }} aria-hidden="true" />
        <ol className="cl__list">
          {log.map((c, i) => (
            <motion.li
              key={c.msg}
              className={`cl__commit is-${c.type}`}
              initial={{ opacity: 0, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.03 }}
            >
              <span className="cl__node" aria-hidden="true" />
              <span className="cl__hash mono">{shortHash(c.msg)}</span>
              <span className="cl__msg">{c.msg}</span>
              <span className="cl__meta mono">
                {c.when}
                <span className="cl__type">{TYPES[c.type]}</span>
              </span>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function Record() {
  const section = useRef(null);
  return (
    <section className="rec" id="record" aria-labelledby="record-title" ref={section}>
      <div className="rec__grid wrap">
        <div className="rec__left">
          <Drafted id="record-title">The record</Drafted>

          <ol className="edu">
            {education.map((e, i) => (
              <motion.li
                key={e.what}
                className="edu__card"
                initial={{ opacity: 0, x: -30, rotate: -2 }}
                whileInView={{ opacity: 1, x: 0, rotate: i % 2 ? 0.5 : -0.5 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
              >
                <p className="edu__score">
                  <span className="edu__num">{e.score}</span>
                  <span className="edu__unit mono">{e.unit}</span>
                </p>
                <div>
                  <h3 className="edu__school">{e.school}</h3>
                  <p className="edu__what">{e.what}</p>
                  <p className="edu__when mono">
                    {e.when}, {e.where}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>

          <motion.div
            className="train"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="train__tag mono">Training</p>
            <h3 className="train__title">{training.title}</h3>
            <p className="train__when mono">{training.when}</p>
            <ul className="train__lines">
              {training.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <a className="link train__link" href={training.link} target="_blank" rel="noreferrer">
              View certificate <ArrowUpRight size={14} weight="bold" />
            </a>
          </motion.div>
        </div>

        <CommitLog section={section} />
      </div>
    </section>
  );
}
