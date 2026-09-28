import React, { useCallback, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Glance from './components/Glance';
import Toolkit from './components/Toolkit';
import Work from './components/Work';
import Record from './components/Record';
import About from './components/About';
import Contact from './components/Contact';
import useScrollReveal from './hooks/useScrollReveal';

export default function App() {
  const [techFilter, setTechFilter] = useState(null);
  useScrollReveal();

  /* Picking a tool in the Toolkit filters the projects and jumps there. */
  const pickTech = useCallback((tech) => {
    setTechFilter(tech);
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <a href="#work" className="sr-only">Skip to projects</a>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Glance />
        <Toolkit onPickTech={pickTech} />
        <Work filter={techFilter} onFilter={setTechFilter} />
        <Record />
        <About />
        <Contact />
      </main>
    </>
  );
}
