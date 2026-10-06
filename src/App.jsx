import React from 'react';
import Nav from './components/Nav';
import Hero from './components/hero/Hero';
import Summary from './components/hero/Summary';
import Work from './components/work/Work';
import Skills from './components/skills/Skills';
import Timeline from './components/record/Timeline';
import About from './components/about/About';
import Contact from './components/contact/Contact';
import useReveal from './hooks/useReveal';

export default function App() {
  useReveal();
  return (
    <>
      <a href="#work" className="sr-only skip">Skip to projects</a>
      <Nav />
      <main>
        <Hero />
        <Summary />
        <Work />
        <Skills />
        <Timeline />
        <About />
        <Contact />
      </main>
    </>
  );
}
