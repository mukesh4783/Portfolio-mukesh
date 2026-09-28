import React from 'react';
import CodingCards from './record/CodingCards';
import useScrollProgress from '../hooks/useScrollProgress';
import { TIMELINE, LEGEND, SCHOOLING } from '../data/record';
import './Record.css';

function Entry({ item, index }) {
  const body = (
    <>
      <p className="tl__date">{item.date}</p>
      <h3 className="tl__title">{item.title}</h3>
      <p className="tl__org">{item.org}</p>
      {item.points && (
        <ul className="tl__points">
          {item.points.map((pt) => <li key={pt.slice(0, 24)}>{pt}</li>)}
        </ul>
      )}
    </>
  );
  return (
    <li className={`tl__item tl__item--${item.type} reveal`} style={{ '--d': `${(index % 3) * 0.05}s` }}>
      <span className="tl__dot" aria-hidden="true" />
      {item.href
        ? <a className="tl__card" href={item.href} target="_blank" rel="noopener noreferrer">{body}</a>
        : <div className="tl__card">{body}</div>}
    </li>
  );
}

export default function Record() {
  const lineRef = useScrollProgress();

  return (
    <section className="section record" id="record" aria-labelledby="record-h">
      <div className="wrap">
        <header className="record__head">
          <div className="reveal">
            <span className="eyebrow">§ 03 — Record</span>
            <h2 className="heading" id="record-h">The <em>paper trail.</em></h2>
          </div>
          <ul className="record__legend reveal" style={{ '--d': '0.1s' }} aria-label="Legend">
            {LEGEND.map((l) => (
              <li key={l.type} className={`tl__item--${l.type}`}><i />{l.label}</li>
            ))}
          </ul>
        </header>

        <div className="record__grid">
          <div className="tl" ref={lineRef}>
            <span className="tl__rail" aria-hidden="true"><span className="tl__fill" /></span>
            <ol className="tl__list">
              {TIMELINE.map((item, i) => <Entry key={item.title} item={item} index={i} />)}
            </ol>
          </div>

          <aside className="record__side">
            <p className="record__side-k reveal">Coding profiles</p>
            <div className="reveal"><CodingCards /></div>

            <p className="record__side-k reveal">Education</p>
            <table className="edu reveal">
              <tbody>
                {SCHOOLING.map((s) => (
                  <tr key={s.what}>
                    <td>
                      <b>{s.what}</b>
                      <span>{s.school} · {s.place}</span>
                    </td>
                    <td className="edu__score">{s.score}<span>{s.years}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </aside>
        </div>
      </div>
    </section>
  );
}
