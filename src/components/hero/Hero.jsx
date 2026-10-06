import React from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { PROFILE } from '../../data/profile';
import Icon from '../common/Icon';
import FitPlayground from './FitPlayground';
import HeroName from './HeroName';
import HeroPortrait from './HeroPortrait';
import { panel, rise } from './motion';
import './Hero.css';

export default function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.section className="hero" id="top" initial="hidden" animate="shown">
        <div className="wrap hero__grid">
          <div className="hero__copy">
            <motion.p className="hero__status" variants={rise} custom={-5}>
              <span className="hero__live" aria-hidden="true" />
              {PROFILE.status}
            </motion.p>

            <HeroName first={PROFILE.first} last={PROFILE.last} />

            <motion.p className="hero__tagline" variants={rise} custom={0}>
              I turn <span className="hero__messy">messy data<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M2 14 C 30 4, 50 18, 80 10 S 130 4, 160 12 S 190 8, 198 6" /></svg></span> into answers you can <mark className="hero__mark">trust.</mark>
            </motion.p>

            <motion.p className="hero__lede" variants={rise} custom={1}>
              Data science & ML student at LPU. I build retrieval systems, LLM pipelines and
              analytics dashboards, and I measure whether they actually work.
            </motion.p>

            <motion.div className="hero__cta" variants={rise} custom={2}>
              <a className="btn" href="#work">See my work <Icon name="arrow" /></a>
              <a className="btn btn--ghost" href={PROFILE.resume} download>Résumé <Icon name="arrowDown" /></a>
            </motion.div>

            <motion.ul className="hero__meta" variants={rise} custom={3}>
              <li><Icon name="pin" size={16} /> {PROFILE.location}</li>
              <li><a href={PROFILE.github} target="_blank" rel="noreferrer"><Icon name="github" size={16} /> GitHub</a></li>
              <li><a href={PROFILE.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin" size={16} /> LinkedIn</a></li>
            </motion.ul>
          </div>

          <div className="hero__stage">
            <HeroPortrait
              src={PROFILE.photo}
              alt={`Portrait of ${PROFILE.first} ${PROFILE.last}`}
              initials={PROFILE.initials}
            />
            <motion.div className="hero__play" variants={panel}>
              <p className="hero__note hand" aria-hidden="true">go on, break my model ↓</p>
              <FitPlayground />
            </motion.div>
          </div>
        </div>
      </motion.section>
    </MotionConfig>
  );
}
