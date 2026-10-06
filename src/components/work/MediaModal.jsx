import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { X } from '@phosphor-icons/react';
import { getLenis } from '../../hooks/useLenis.js';

// Full-size view for a screenshot or a narrated render.
export default function MediaModal({ media, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const prev = document.activeElement;
    const root = document.getElementById('root');
    const html = document.documentElement;
    const overflow = html.style.overflow;
    root?.setAttribute('inert', '');
    html.style.overflow = 'hidden';
    getLenis()?.stop();
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      root?.removeAttribute('inert');
      html.style.overflow = overflow;
      getLenis()?.start();
      prev?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      className="mm"
      role="dialog"
      aria-modal="true"
      aria-label={media.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.figure
        className="mm__fig"
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 10 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      >
        {media.type === 'video' ? (
          <video src={media.src} poster={media.poster} controls autoPlay playsInline />
        ) : (
          <img src={media.src} alt={media.caption} />
        )}
        <figcaption>
          <span>
            <strong>{media.title}</strong>
            <span className="mono">{media.caption}</span>
          </span>
          <button type="button" ref={closeRef} className="mm__close" onClick={onClose} aria-label="Close">
            <X size={18} weight="bold" />
          </button>
        </figcaption>
      </motion.figure>
    </motion.div>,
    document.body,
  );
}
