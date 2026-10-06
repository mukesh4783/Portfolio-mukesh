import { motion, useReducedMotion } from 'motion/react';
import './drafted.css';

const EASE = [0.65, 0, 0.35, 1];
const SHOWN = 'inset(0% 0% 0% 0%)';

// Display type that develops like a cyanotype: the outline is drafted in
// first, then the ink floods up from the bottom, then a mint highlighter
// sweeps behind it. The hairline outline stays as an offset echo.
export default function Drafted({ as = 'h2', children, className = '', delay = 0, id, mark = true }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const label = typeof children === 'string' ? children : undefined;

  const line = {
    hidden: { clipPath: 'inset(0% 100% 0% 0%)' },
    shown: { clipPath: SHOWN, transition: { duration: 0.8, ease: EASE, delay } },
  };
  const fill = {
    hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
    shown: { clipPath: SHOWN, transition: { duration: 0.9, ease: EASE, delay: delay + 0.45 } },
  };
  const bar = {
    hidden: { scaleX: 0 },
    shown: { scaleX: 1, transition: { duration: 0.6, ease: EASE, delay: delay + 1 } },
  };

  return (
    <Tag
      className={`dr ${className}`}
      aria-label={label}
      id={id}
      initial={reduce ? 'shown' : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, amount: 0.5 }}
    >
      {mark && <motion.span className="dr__mark" aria-hidden="true" variants={bar} />}
      <motion.span className="dr__layer dr__line" aria-hidden="true" variants={line}>
        {children}
      </motion.span>
      <motion.span className="dr__layer dr__fill" aria-hidden="true" variants={fill}>
        {children}
      </motion.span>
    </Tag>
  );
}
