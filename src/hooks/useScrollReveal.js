import { useEffect } from 'react';

/* Adds .is-visible to every .reveal element once it scrolls into view,
   including elements mounted later (watched with a MutationObserver). */
export default function useScrollReveal() {
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root || typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }),
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' },
    );
    const observeAll = () => root.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => io.observe(el));
    observeAll();
    const mo = new MutationObserver(observeAll);
    mo.observe(root, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
}
