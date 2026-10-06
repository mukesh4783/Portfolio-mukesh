import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, portraitImg, portraitReveal } from './motion';

/* Large 4:5 portrait that rises into view before the playground lands over its lower third.
   Shows initials on a chart-paper grid until a real photo exists at `src`. */
export default function HeroPortrait({ src, alt, initials }) {
  const [failed, setFailed] = useState(false);
  const reduce = useReducedMotion();

  return (
    <motion.figure className="hero__portrait" variants={reduce ? undefined : portraitReveal}>
      {failed ? (
        <span className="hero__portrait-empty" role="img" aria-label={alt}>
          <span className="hero__portrait-initials" aria-hidden="true">{initials}</span>
        </span>
      ) : (
        <motion.img
          src={src}
          alt={alt}
          width="800"
          height="1000"
          decoding="async"
          fetchpriority="high"
          variants={reduce ? undefined : portraitImg}
          whileHover={reduce ? undefined : { scale: 1.04, transition: { duration: 0.6, ease: EASE } }}
          onError={() => setFailed(true)}
        />
      )}
    </motion.figure>
  );
}
