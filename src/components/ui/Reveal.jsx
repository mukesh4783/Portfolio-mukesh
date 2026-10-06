import { motion } from 'motion/react';

/* Fade-and-rise on first scroll into view, so the eye lands on one block at a time. */
export default function Reveal({ as = 'div', delay = 0, y = 36, children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
