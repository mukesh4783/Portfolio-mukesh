import React, { useState } from 'react';
import { AXIS, EVENTS, LANES, NOW, TRAINING_NOTES } from '../../data/timeline';
import { newestFirst, stackLevels } from '../../lib/timeline';
import SectionHead from '../common/SectionHead';
import './Timeline.css';

const pct = (year) => ((year - AXIS.from) / (AXIS.to - AXIS.from)) * 100;
const LEVEL_Y = [0, -14, 14];
const STACKED = LANES.flatMap((l) => stackLevels(EVENTS.filter((e) => e.lane === l.id)));
const LOG = newestFirst(EVENTS);

function Mark({ ev, lane, active, onFocus }) {
  const isSpan = ev.from !== undefined;
  const left = pct(isSpan ? ev.from : ev.at);
  const width = isSpan ? Math.max(1.2, pct(ev.to) - pct(ev.from)) : 0;
  return (
    <button
      type="button"
      className={`tl__mark ${isSpan ? 'tl__mark--span' : 'tl__mark--dot'} ${ev.ongoing ? 'is-ongoing' : ''} ${active ? 'is-active' : ''}`}
      data-c={lane.color}
      style={{ left: `${left}%`, width: isSpan ? `${width}%` : undefined, top: `calc(50% + ${LEVEL_Y[ev.level] ?? 0}px)` }}
      onMouseEnter={onFocus} onFocus={onFocus} onClick={onFocus}
      aria-label={`${ev.when}: ${ev.title}, ${ev.org}`}
    />
  );
}

export default function Timeline() {
  const [activeTitle, setActiveTitle] = useState(EVENTS.find((e) => e.title.startsWith('B.Tech')).title);
  const active = EVENTS.find((e) => e.title === activeTitle);
  const activeLane = LANES.find((l) => l.id === active.lane);

  return (
    <section className="section tl" id="timeline">
      <div className="wrap">
        <SectionHead
          index="4"
          code="mukesh.events.plot(kind='swimlane')"
          title="Five years, plotted."
          lede="School, degree, builds, courses and wins on a single time axis. Hover or tap any mark."
        />

        <div className="tl__chart reveal">
          <div className="tl__scroll">
            <div className="tl__inner">
              <div className="tl__axis" aria-hidden="true">
                {AXIS.ticks.filter((t) => t >= AXIS.from && t <= AXIS.to).map((t) => (
                  <span key={t} style={{ left: `${pct(t)}%` }} className="mono">{t}</span>
                ))}
                <span className="tl__now mono" style={{ left: `${pct(NOW)}%` }}>now</span>
              </div>
              {LANES.map((lane) => (
                <div key={lane.id} className="tl__lane" data-c={lane.color}>
                  <span className="tl__label">{lane.label}</span>
                  <div className="tl__track">
                    {AXIS.ticks.map((t) => <i key={t} className="tl__gridline" style={{ left: `${pct(t)}%` }} />)}
                    <i className="tl__nowline" style={{ left: `${pct(NOW)}%` }} />
                    {STACKED.filter((ev) => ev.lane === lane.id).map((ev) => (
                      <Mark key={ev.title} ev={ev} lane={lane} active={ev.title === activeTitle} onFocus={() => setActiveTitle(ev.title)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="tl__card" data-c={activeLane.color} aria-live="polite">
            <span className="tl__when mono">{active.when} · {activeLane.label}</span>
            <strong className="tl__title">{active.title}</strong>
            <span className="tl__org">{active.org}</span>
          </div>
        </div>

        <div className="tl__lists">
          <ol className="tl__log reveal">
            {LOG.map((ev) => {
              const lane = LANES.find((l) => l.id === ev.lane);
              return (
                <li key={ev.title} data-c={lane.color}>
                  <span className="tl__lw mono">{ev.when}</span>
                  <span className="tl__lt"><i />{ev.title}</span>
                  <span className="tl__lo">{ev.org}</span>
                </li>
              );
            })}
          </ol>

          <aside className="tl__training reveal" data-c="green">
            <p className="mono tl__tk">May – Jun 2026 · training</p>
            <h3>AI Engineer Launchpad — Mastering LLMs & Agentic AI</h3>
            <ul>{TRAINING_NOTES.map((n) => <li key={n}>{n}</li>)}</ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
