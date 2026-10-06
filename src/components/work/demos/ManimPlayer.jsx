import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion } from 'motion/react';
import { FilmStrip, Pause, Play } from '@phosphor-icons/react';
import { useVisible } from '../../../hooks/useVisible.js';

export const CHAPTERS = Object.freeze([
  {
    id: 'pythagoras',
    label: 'Pythagoras',
    topic: '"Explain the Pythagorean theorem"',
    loop: '/media/manimax-pythagoras.mp4',
    poster: '/media/manimax-pythagoras.jpg',
    full: '/media/manimax-pythagoras-full.mp4',
    length: '2:09',
  },
  {
    id: 'lens',
    label: 'Thin lens',
    topic: '"How does a convex lens form an image?"',
    loop: '/media/manimax-lens.mp4',
    poster: '/media/manimax-lens.jpg',
    full: '/media/manimax-lens-full.mp4',
    length: '0:41',
  },
]);

// Real Manimax output. Muted, sped-up loops play here; the full narrated
// render opens in a modal.
export default function ManimPlayer({ onWatch }) {
  const reduce = useReducedMotion();
  const [chapter, setChapter] = useState(CHAPTERS[0]);
  const [paused, setPaused] = useState(false);
  const [ref, visible] = useVisible({ threshold: 0.25 });
  const video = useRef(null);
  const progress = useMotionValue(0);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (visible && !paused && !reduce) v.play().catch(() => {});
    else v.pause();
  }, [visible, paused, reduce, chapter]);

  const onTime = (e) => {
    const v = e.currentTarget;
    if (v.duration) progress.set(v.currentTime / v.duration);
  };

  return (
    <div className="plate manim" ref={ref}>
      <div className="plate__bar">
        <span className="mono">
          <strong>Render output</strong> prompt: {chapter.topic}
        </span>
        <div className="manim__tabs" role="group" aria-label="Chapters">
          {CHAPTERS.map((c) => (
            <button key={c.id} type="button" className="pill-btn" aria-pressed={chapter.id === c.id} onClick={() => setChapter(c)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="manim__screen">
        <video
          key={chapter.id}
          ref={video}
          src={chapter.loop}
          poster={chapter.poster}
          muted
          loop
          playsInline
          preload="metadata"
          onTimeUpdate={onTime}
          aria-label={`Manimax render: ${chapter.label}, muted preview`}
        />
        <motion.span className="manim__progress" style={{ scaleX: progress }} aria-hidden="true" />
      </div>

      <div className="plate__foot">
        <button type="button" className="pill-btn" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play preview' : 'Pause preview'}>
          {paused ? <Play size={13} weight="fill" /> : <Pause size={13} weight="fill" />}
          {paused ? 'Play' : 'Pause'}
        </button>
        <button type="button" className="btn btn--sm manim__watch" onClick={() => onWatch(chapter)}>
          <FilmStrip size={16} weight="bold" /> Watch full render, {chapter.length}, with narration
        </button>
      </div>
    </div>
  );
}
