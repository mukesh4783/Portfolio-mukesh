import React from 'react';
import { motion } from 'framer-motion';
import { nameChar, nameDot, nameLine, nameLines } from './motion';

/* The name as the page's headline: one line per word, letters rising out of a mask.
   Screen readers get the plain name; the split letters are decorative. */
export default function HeroName({ first, last }) {
  const words = [first, ...last.split(' ')];
  const lastIndex = words.length - 1;

  return (
    <h1 className="hero__name">
      <span className="sr-only">{`${first} ${last}`}</span>
      <motion.span className="hero__name-lines" aria-hidden="true" variants={nameLines}>
        {words.map((word, w) => (
          <span className="hero__name-mask" key={word}>
            <motion.span className="hero__name-line" variants={nameLine}>
              {Array.from(word).map((ch, c) => (
                <motion.span className="hero__name-char" variants={nameChar} key={c}>
                  {ch}
                </motion.span>
              ))}
              {w === lastIndex && (
                <motion.span className="hero__name-dot" variants={nameDot}>.</motion.span>
              )}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </h1>
  );
}
