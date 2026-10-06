import { MotionConfig, useReducedMotion } from 'motion/react';
import { ThemeContext, useThemeState } from './hooks/useTheme.js';
import { useLenis } from './hooks/useLenis.js';
import Nav from './components/chrome/Nav.jsx';
import Hero from './components/hero/Hero.jsx';
import Tape from './components/stats/Tape.jsx';
import Stats from './components/stats/Stats.jsx';
import Work from './components/work/Work.jsx';
import Toolkit from './components/toolkit/Toolkit.jsx';
import Record from './components/record/Record.jsx';
import Certificates from './components/certs/Certificates.jsx';
import Contact from './components/contact/Contact.jsx';
import Footer from './components/contact/Footer.jsx';

export default function App() {
  const themeState = useThemeState();
  const reduce = useReducedMotion();
  useLenis(!reduce);

  return (
    <ThemeContext.Provider value={themeState}>
      <MotionConfig reducedMotion="user">
        <a className="skip" href="#work">Skip to work</a>
        <Nav />
        <main>
          <Hero />
          <Tape />
          <Stats />
          <Work />
          <Toolkit />
          <Record />
          <Certificates />
          <Contact />
        </main>
        <Footer />
      </MotionConfig>
    </ThemeContext.Provider>
  );
}
