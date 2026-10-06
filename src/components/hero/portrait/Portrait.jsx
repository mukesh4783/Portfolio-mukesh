import { useState } from 'react';
import { motion, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { profile } from '../../../data/profile.js';
import Patches from './Patches.jsx';
import ThemedImg from './ThemedImg.jsx';
import layout from './layout.json';
import './portrait.css';

const SPRING = { stiffness: 70, damping: 18, mass: 0.6 };
const enter = (delay, from) => ({
  initial: { opacity: 0, ...from },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay },
});

/* Hairlines from the back layer, carried on across the subject (viewBox is the
   1024x1280 render). They move with the back layer so the lines stay continuous. */
function Hairlines() {
  return (
    <svg className="pt__lines" viewBox="0 0 1024 1280" preserveAspectRatio="none" aria-hidden="true">
      <path d="M469 140V1060M763 230V1060" />
      <rect x="560" y="150" width="140" height="90" />
    </svg>
  );
}

/* The hero portrait, "Signal": a double exposure in the site's inks over a layer of
   data shapes, the two drifting apart with the pointer for depth. Rebuild it from a
   new photo with `npm run portrait -- path/to/photo.jpg`. */
export default function Portrait() {
  const reduce = useReducedMotion();
  const [assembled, setAssembled] = useState(false);
  const px = useSpring(0, SPRING);
  const py = useSpring(0, SPRING);
  const backX = useTransform(px, (v) => v * -14);
  const backY = useTransform(py, (v) => v * -10);
  const frontX = useTransform(px, (v) => v * 6);
  const frontY = useTransform(py, (v) => v * 4);

  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };
  // Mouse users assemble on hover; on touch a tap toggles it.
  const onTap = (e) => {
    if (e.pointerType !== 'mouse') setAssembled((a) => !a);
  };

  return (
    <figure className={`pt ${assembled ? 'is-assembled' : ''}`} role="img" aria-label={`Portrait of ${profile.name}`}>
      <div className="pt__stage" onPointerMove={onMove} onPointerLeave={onLeave} onPointerUp={onTap}>
        <motion.div className="pt__layer" {...enter(0.25, { scale: 0.96 })}>
          <motion.div className="pt__layer" style={{ x: backX, y: backY }}>
            <ThemedImg name="back" />
          </motion.div>
        </motion.div>
        <motion.div className="pt__layer" style={{ x: frontX, y: frontY }}>
          <Patches layout={layout} />
        </motion.div>
        <motion.div className="pt__layer" {...enter(0.6, {})}>
          <motion.div className="pt__layer" style={{ x: backX, y: backY }}>
            <Hairlines />
          </motion.div>
        </motion.div>
      </div>
      <figcaption className="pt__cap mono">
        Fig. 01 — Signal over noise · <span className="pt__hint--hover">hover</span>
        <span className="pt__hint--tap">tap</span> to assemble
      </figcaption>
    </figure>
  );
}
