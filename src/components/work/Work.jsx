import React from 'react';
import { PROJECTS } from '../../data/projects';
import SectionHead from '../common/SectionHead';
import ProjectCard from './ProjectCard';
import './Work.css';
import './viz/viz.css';

export default function Work() {
  return (
    <section className="section work" id="work">
      <div className="wrap">
        <SectionHead
          index="2"
          code="mukesh.projects.sort_values('date', ascending=False)"
          title="Things I’ve built, and how well they work."
          lede="Every figure below is a small working model of the project — poke at it. The numbers next to it are what I measured on the real thing."
          note="all interactive ✎"
        />
        <div className="work__list">
          {PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} index={i} total={PROJECTS.length} />)}
        </div>
      </div>
    </section>
  );
}
