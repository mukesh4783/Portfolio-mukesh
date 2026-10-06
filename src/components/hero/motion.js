/* Shared timing for the hero entrance, so every piece lands in one sequence. */

export const EASE = [0.22, 1, 0.36, 1];

/* When the name has finished revealing; everything else keys off this. */
export const NAME_DONE = 1.05;

/* Container for the name: each line starts a beat after the previous one. */
export const nameLines = {
  hidden: {},
  shown: { transition: { delayChildren: 0.15, staggerChildren: 0.12 } },
};

/* Container for one line: its letters follow each other closely. */
export const nameLine = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.028 } },
};

/* One letter rising out of its line's mask. */
export const nameChar = {
  hidden: { y: '108%' },
  shown: { y: '0%', transition: { duration: 0.85, ease: EASE } },
};

/* The full stop after the surname. */
export const nameDot = {
  hidden: { scale: 0, opacity: 0 },
  shown: {
    scale: 1,
    opacity: 1,
    transition: { delay: NAME_DONE - 0.1, type: 'spring', stiffness: 520, damping: 18 },
  },
};

/* The portrait rises into view bottom-up while the photo settles from a slight zoom. */
export const portraitReveal = {
  hidden: { clipPath: 'inset(100% 0% 0% 0% round 22px)' },
  shown: {
    clipPath: 'inset(0% 0% 0% 0% round 22px)',
    transition: { delay: 0.3, duration: 1.1, ease: EASE },
  },
};

export const portraitImg = {
  hidden: { scale: 1.18 },
  shown: { scale: 1, transition: { delay: 0.3, duration: 1.6, ease: EASE } },
};

/* Supporting copy under the name: a soft rise, staggered by `i`. */
export const rise = {
  hidden: { opacity: 0, y: 18 },
  shown: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.55 + i * 0.1, duration: 0.8, ease: EASE },
  }),
};

/* The playground card lands over the portrait once the photo is mostly revealed. */
export const panel = {
  hidden: { opacity: 0, y: 48 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.85, duration: 1, ease: EASE },
  },
};
