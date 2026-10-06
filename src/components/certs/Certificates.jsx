import { forwardRef, useState } from 'react';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, SealCheck } from '@phosphor-icons/react';
import { CATEGORIES, credentials } from '../../data/credentials.js';
import Drafted from '../ui/Drafted.jsx';
import BrandMark from '../ui/BrandMark.jsx';
import './certs.css';

const COUNTS = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.id === 'all' ? credentials.length : credentials.filter((x) => x.cat === c.id).length]));

function Stamp({ cert }) {
  const tilt = ([...cert.id].reduce((a, ch) => a + ch.charCodeAt(0), 0) % 15) - 7;
  return (
    <span className="cstamp" style={{ '--tilt': `${tilt}deg` }} aria-hidden="true">
      {cert.mark ? <BrandMark name={cert.mark} className="cstamp__logo" /> : <span className="cstamp__mono">{cert.mono}</span>}
    </span>
  );
}

// A credential plate that tilts toward the pointer, with a mint glare
// that follows it across the surface.
const CertCard = forwardRef(function CertCard({ cert, featured }, ref) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 20 });
  const sy = useSpring(py, { stiffness: 200, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-9, 9]);
  const rotateX = useTransform(sy, [0, 1], [7, -7]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, color-mix(in oklab, var(--mint) 30%, transparent), transparent 55%)`;

  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.li
      ref={ref}
      layout
      className={`cert ${featured ? 'cert--feature' : ''}`}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.a
        href={cert.link}
        target="_blank"
        rel="noreferrer"
        className="cert__plate"
        style={{ rotateX, rotateY }}
        onPointerMove={onMove}
        onPointerLeave={reset}
      >
        <motion.span className="cert__glare" style={{ background: glare }} aria-hidden="true" />
        <span className="cert__corner cert__corner--tl" aria-hidden="true" />
        <span className="cert__corner cert__corner--br" aria-hidden="true" />
        <span className="cert__top">
          <Stamp cert={cert} />
          <span className="cert__date mono">{cert.date}</span>
        </span>
        <span className="cert__title">{cert.title}</span>
        <span className="cert__issuer">{cert.issuer}</span>
        <span className="cert__verify">
          <SealCheck size={16} weight="bold" /> Verify credential <ArrowUpRight size={14} weight="bold" />
        </span>
      </motion.a>
    </motion.li>
  );
});

export default function Certificates() {
  const [cat, setCat] = useState('all');
  const list = cat === 'all' ? credentials : credentials.filter((c) => c.cat === cat);

  return (
    <section className="crt" id="certificates" aria-labelledby="certs-title">
      <div className="wrap">
        <div className="crt__head">
          <div>
            <Drafted id="certs-title">Certificates</Drafted>
            <p className="crt__sum mono">{credentials.length} credentials, every one verifiable online</p>
          </div>
          <div className="tk__filters" role="group" aria-label="Filter certificates">
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button" className="tk__filter" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
                {cat === c.id && <motion.span layoutId="crt-pill" className="tk__pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span>{c.label}</span>
                <span className="tk__count mono">{COUNTS[c.id]}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.ul layout className="crt__grid">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((c, i) => (
              <CertCard key={c.id} cert={c} featured={cat === 'all' && i === 0} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
