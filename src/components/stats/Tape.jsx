import { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import { tape } from '../../data/profile.js';
import './tape.css';

const wrap = (min, max, v) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

// A measuring tape printed with the toolkit. Scrolling faster feeds the tape
// faster, and scrolling back up runs it in reverse.
export default function Tape() {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(vel, [-2000, 0, 2000], [-4, 0, 4], { clamp: false });
  const dir = useRef(1);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const b = boost.get();
    if (b < -0.05) dir.current = -1;
    else if (b > 0.05) dir.current = 1;
    base.set(base.get() - dir.current * (delta / 1000) * (1.4 + Math.abs(b)));
  });

  const run = [...tape, ...tape];
  return (
    <div className="tape" aria-label={`Toolkit: ${tape.join(', ')}`}>
      <motion.div className="tape__track" style={{ x }} aria-hidden="true">
        {run.map((t, i) => (
          <span key={`${t}-${i}`} className="tape__item">
            <span className="tape__cm">{String((i % tape.length) + 1).padStart(2, '0')}</span>
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
