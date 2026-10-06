import { motion } from 'motion/react';
import { ArrowDown, ArrowUpRight } from '@phosphor-icons/react';
import { profile } from '../../data/profile.js';
import KineticName from './KineticName.jsx';
import Portrait from './portrait/Portrait.jsx';
import './hero.css';

const rise = (delay) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
});

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__grid wrap">
        <div className="hero__copy">
          <motion.p className="hero__eyebrow mono" {...rise(0.05)}>
            {profile.role}
          </motion.p>
          <KineticName first={profile.first} last={profile.last} />
          <motion.p className="hero__lede" {...rise(1)}>
            {profile.lede}
          </motion.p>
          <motion.div className="hero__ctas" {...rise(1.12)}>
            <a className="btn" href="#work">
              See the work <ArrowDown size={16} weight="bold" />
            </a>
            <a className="btn btn--ghost" href="#contact">
              Say hello <ArrowUpRight size={16} weight="bold" />
            </a>
          </motion.div>
        </div>

        <motion.div
          className="hero__portrait"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <Portrait />
          <motion.span
            className="hero__stamp mono"
            initial={{ scale: 1.8, opacity: 0, rotate: -24 }}
            animate={{ scale: 1, opacity: 1, rotate: 7 }}
            transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 1.5 }}
          >
            {profile.status}
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
