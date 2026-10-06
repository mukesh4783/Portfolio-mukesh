import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Play } from '@phosphor-icons/react';

const COOLDOWN = 3000;
const ERRORS = Object.freeze([
  "TypeError: Cannot read properties of undefined (reading 'map')",
  'npm ERR! code ELIFECYCLE, exit status 1',
  "SyntaxError: Unexpected token '}'",
]);

// What the extension does, in miniature: a failing command trips the
// watcher, the meme panel pops, and a cooldown stops it from spamming.
export default function MemeDemo() {
  const [runs, setRuns] = useState(0);
  const [cooling, setCooling] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const run = () => {
    if (cooling) return;
    setRuns((r) => r + 1);
    setCooling(true);
    timer.current = window.setTimeout(() => setCooling(false), COOLDOWN);
  };

  return (
    <div className="mini-demo meme">
      <div className="meme__term mono" aria-live="polite">
        <p>
          <span className="meme__prompt">$</span> npm run build
        </p>
        {runs > 0 && <p className="meme__err">{ERRORS[(runs - 1) % ERRORS.length]}</p>}
        {runs === 0 && <p className="meme__dim">Waiting for something to break.</p>}
      </div>
      <AnimatePresence>
        {cooling && (
          <motion.figure
            key={runs}
            className="meme__pop"
            initial={{ scale: 0.4, rotate: -14, opacity: 0 }}
            animate={{ scale: 1, rotate: 4, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 380, damping: 16 }}
          >
            <img src="/media/meme-cat.jpg" alt="Laughing cat meme the extension shows on errors" width="120" height="120" />
            <motion.span className="meme__cool" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: COOLDOWN / 1000, ease: 'linear' }} />
          </motion.figure>
        )}
      </AnimatePresence>
      <button type="button" className="pill-btn meme__run" onClick={run} disabled={cooling}>
        <Play size={12} weight="fill" /> {cooling ? 'Cooling down' : 'Run build'}
      </button>
    </div>
  );
}
