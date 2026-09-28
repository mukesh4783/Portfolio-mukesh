import React, { useEffect, useState } from 'react';
import { NAV, PROFILE } from '../data/profile';
import './Navbar.css';

/* Which section is under the top third of the viewport. */
function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-35% 0px -60% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/* Scroll progress (0–1) and whether the bar should tuck away. */
function useScrollState() {
  const [state, setState] = useState({ progress: 0, hidden: false, scrolled: false });
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setState({
          progress: max > 0 ? y / max : 0,
          hidden: y > 400 && y > last + 4,
          scrolled: y > 24,
        });
        last = y;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return state;
}

const IDS = NAV.map((n) => n.id);

export default function Navbar() {
  const active = useActiveSection(IDS);
  const { progress, hidden, scrolled } = useScrollState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const cls = ['nav', scrolled && 'nav--scrolled', hidden && !open && 'nav--hidden', open && 'nav--open']
    .filter(Boolean).join(' ');

  return (
    <header className={cls}>
      <div className="nav__bar wrap">
        <a href="#top" className="nav__brand" aria-label="Back to top" onClick={() => setOpen(false)}>
          <span className="nav__mark" aria-hidden="true">
            <i /><i /><i />
          </span>
          <span className="nav__name">
            {PROFILE.firstName} <em>{PROFILE.lastName}</em>
          </span>
        </a>

        <nav className="nav__links" aria-label="Sections">
          {NAV.map((n, i) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`nav__link${active === n.id ? ' is-active' : ''}`}
              onClick={() => setOpen(false)}
              style={{ '--i': i }}
            >
              <span className="nav__num">{String(i + 1).padStart(2, '0')}</span>
              {n.label}
            </a>
          ))}
        </nav>

        <div className="nav__right">
          <span className="nav__status"><span className="nav__pulse" />{PROFILE.status}</span>
          <a href={PROFILE.resume} className="nav__cv" target="_blank" rel="noopener noreferrer">Résumé</a>
          <button
            type="button"
            className="nav__burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span />
          </button>
        </div>
      </div>
      <div className="nav__progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
    </header>
  );
}
