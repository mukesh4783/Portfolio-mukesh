import React, { useEffect, useState } from 'react';
import { NAV, PROFILE } from '../data/profile';
import Icon from './common/Icon';
import './Nav.css';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean);
    if (!sections.length || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap nav__row">
        <a className="nav__brand" href="#top" aria-label="Mukesh Kumar Pandey — back to top">
          <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">
            <path d="M6 32L34 9" stroke="var(--blue)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="12" cy="22" r="4" fill="var(--red)" />
            <circle cx="21" cy="24" r="4" fill="var(--ink)" />
            <circle cx="29" cy="11" r="4" fill="var(--yellow)" />
          </svg>
          <span>mukesh<span className="nav__dot">.</span>fit()</span>
        </a>

        <nav aria-label="Sections">
          <ul className="nav__links">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className={active === n.id ? 'is-active' : ''}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="nav__cv" href={PROFILE.resume} download>
          Résumé <Icon name="arrowDown" size={16} />
        </a>
      </div>
    </header>
  );
}
