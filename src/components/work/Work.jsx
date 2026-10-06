import { useCallback, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { featured, more } from '../../data/projects.js';
import Drafted from '../ui/Drafted.jsx';
import WorkIndex from './WorkIndex.jsx';
import Spread from './Spread.jsx';
import MiniCard from './MiniCard.jsx';
import MediaModal from './MediaModal.jsx';
import './work.css';
import './demos/demos.css';

const LAYOUTS = Object.freeze(['stack', 'split', 'split-rev']);

export default function Work() {
  const [media, setMedia] = useState(null);
  const close = useCallback(() => setMedia(null), []);

  return (
    <section className="work" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <header className="work__head">
          <Drafted id="work-title" className="work__title">Selected work</Drafted>
          <p className="work__intro">
            Six things I have built, three of them in depth. Each comes with a working plate or real output, so you can poke at it instead of reading about it.
          </p>
        </header>

        <WorkIndex rows={[...featured, ...more]} />

        {featured.map((p, i) => (
          <Spread key={p.id} project={p} layout={LAYOUTS[i]} onOpen={setMedia} />
        ))}

        <h3 className="work__more">More projects</h3>
        <div className="work__minis">
          {more.map((p, i) => (
            <MiniCard key={p.id} project={p} i={i} />
          ))}
        </div>
      </div>

      <AnimatePresence>{media && <MediaModal key={media.src} media={media} onClose={close} />}</AnimatePresence>
    </section>
  );
}
