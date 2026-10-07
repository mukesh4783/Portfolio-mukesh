import { forwardRef, useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, ArrowLeft, ArrowRight, SealCheck, FilePdf, LinkSimple } from '@phosphor-icons/react';
import { CATEGORIES, credentials } from '../../data/credentials.js';
import Drafted from '../ui/Drafted.jsx';
import BrandMark from '../ui/BrandMark.jsx';
import './certs.css';

const COUNTS = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.id === 'all' ? credentials.length : credentials.filter((x) => x.cat === c.id).length]));

/* Status icon for the right end of each row */
function StatusIcon({ status }) {
  if (status === 'preview') return <FilePdf size={16} weight="bold" aria-label="Preview available" />;
  if (status === 'verify') return <SealCheck size={16} weight="bold" aria-label="Verifiable online" />;
  return <LinkSimple size={16} weight="bold" aria-label="On file" />;
}

function Stamp({ cert }) {
  const tilt = ([...cert.id].reduce((a, ch) => a + ch.charCodeAt(0), 0) % 15) - 7;
  return (
    <span className="cstamp" style={{ '--tilt': `${tilt}deg` }} aria-hidden="true">
      {cert.mark ? <BrandMark name={cert.mark} className="cstamp__logo" /> : <span className="cstamp__mono">{cert.mono}</span>}
    </span>
  );
}

/* ── Individual certificate row ─────────────────────────────── */
const CertRow = forwardRef(function CertRow({ cert, isActive, onSelect }, ref) {
  return (
    <motion.li
      ref={ref}
      layout
      className={`crow ${isActive ? 'crow--active' : ''}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <button
        type="button"
        className="crow__btn"
        onMouseEnter={() => onSelect(cert)}
        onFocus={() => onSelect(cert)}
        onClick={() => onSelect(cert)}
        aria-pressed={isActive}
        aria-label={`${cert.title} — ${cert.issuer}`}
      >
        <Stamp cert={cert} />
        <span className="crow__body">
          <span className="crow__title">{cert.title}</span>
          <span className="crow__issuer mono">{cert.issuer}</span>
        </span>
        <span className="crow__meta">
          <span className="crow__date mono">{cert.date}</span>
          <StatusIcon status={cert.status} />
        </span>
      </button>
    </motion.li>
  );
});

/* ── Sticky preview panel ───────────────────────────────────── */
function PreviewPanel({ cert, onPrev, onNext, canPrev, canNext }) {
  const reduce = useReducedMotion();

  /* The tilting card for preview images */
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 20 });
  const sy = useSpring(py, { stiffness: 200, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-6, 6]);
  const rotateX = useTransform(sy, [0, 1], [4, -4]);

  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => { px.set(0.5); py.set(0.5); };

  const isImage = cert.preview && /\.(jpg|jpeg|png|webp|gif)$/i.test(cert.preview);
  const isPdf = cert.preview && /\.pdf$/i.test(cert.preview);

  const domain = cert.link ? (() => { try { return new URL(cert.link).hostname; } catch { return ''; } })() : '';

  return (
    <div className="cprev">
      <AnimatePresence mode="wait">
        <motion.div
          key={cert.id}
          className="cprev__inner"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Preview image card */}
          {cert.preview && (
            <motion.div
              className="cprev__card"
              style={{ rotateX, rotateY }}
              onPointerMove={onMove}
              onPointerLeave={reset}
            >
              {isImage && (
                <img
                  src={cert.preview}
                  alt={`${cert.title} certificate`}
                  className="cprev__img"
                  loading="lazy"
                />
              )}
              {isPdf && (
                <iframe
                  src={`${encodeURI(cert.preview)}#toolbar=0&navpanes=0&view=Fit`}
                  title={`${cert.title} certificate`}
                  className="cprev__frame"
                  loading="lazy"
                />
              )}
            </motion.div>
          )}

          {/* Fallback when no preview is available */}
          {!cert.preview && (
            <div className="cprev__card cprev__card--empty">
              <SealCheck size={48} weight="thin" />
              <span className="mono">Verifiable credential</span>
            </div>
          )}

          {/* Title & info */}
          <h3 className="cprev__title">{cert.title}</h3>
          <p className="cprev__meta mono">{cert.issuer}, {cert.date}</p>

          {/* Nav arrows */}
          <div className="cprev__nav">
            <button
              type="button"
              className="cprev__arrow"
              onClick={onPrev}
              disabled={!canPrev}
              aria-label="Previous certificate"
            >
              <ArrowLeft size={18} weight="bold" />
            </button>
            <button
              type="button"
              className="cprev__arrow"
              onClick={onNext}
              disabled={!canNext}
              aria-label="Next certificate"
            >
              <ArrowRight size={18} weight="bold" />
            </button>
          </div>

          {/* Action row */}
          <div className="cprev__actions">
            {cert.link && (
              <a href={cert.link} target="_blank" rel="noreferrer" className="btn btn--sm cprev__verify">
                Verify credential <ArrowUpRight size={14} weight="bold" />
              </a>
            )}
            {cert.link && domain && (
              <span className="cprev__domain mono">{domain}</span>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Main section ───────────────────────────────────────────── */
export default function Certificates() {
  const [cat, setCat] = useState('all');
  const list = cat === 'all' ? credentials : credentials.filter((c) => c.cat === cat);
  const [active, setActive] = useState(list[0]);

  // When filter changes, reset to first in list
  useEffect(() => {
    setActive(list[0]);
  }, [cat]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeIdx = list.findIndex((c) => c.id === active?.id);

  const goPrev = useCallback(() => {
    if (activeIdx > 0) setActive(list[activeIdx - 1]);
  }, [activeIdx, list]);

  const goNext = useCallback(() => {
    if (activeIdx < list.length - 1) setActive(list[activeIdx + 1]);
  }, [activeIdx, list]);

  const previewCount = credentials.filter((c) => c.preview).length;
  const verifyCount = credentials.filter((c) => c.link).length;

  return (
    <section className="crt" id="certificates" aria-labelledby="certs-title">
      <div className="wrap">
        <div className="crt__head">
          <div>
            <Drafted id="certs-title">Certificates</Drafted>
            <p className="crt__sum mono">{credentials.length} certificates, {previewCount} with a preview, {verifyCount} verifiable online</p>
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

        <div className="crt__layout">
          {/* Certificate list */}
          <motion.ul layout className="crt__list">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((c) => (
                <CertRow
                  key={c.id}
                  cert={c}
                  isActive={active?.id === c.id}
                  onSelect={setActive}
                />
              ))}
            </AnimatePresence>
          </motion.ul>

          {/* Sticky preview */}
          {active && (
            <PreviewPanel
              cert={active}
              onPrev={goPrev}
              onNext={goNext}
              canPrev={activeIdx > 0}
              canNext={activeIdx < list.length - 1}
            />
          )}
        </div>
      </div>
    </section>
  );
}
