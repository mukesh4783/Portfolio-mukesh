import React, { useMemo, useState } from 'react';
import { PROJECTS } from '../../data/projects';
import { METHODS, SKILL_GROUPS } from '../../data/skills';
import SectionHead from '../common/SectionHead';
import ToolIcon, { brandHex } from '../common/ToolIcon';
import './Skills.css';

/* Tools used in projects, most-used first — rows of the usage matrix. */
function usageRows() {
  const counts = PROJECTS.flatMap((p) => p.stack).reduce((acc, t) => ({ ...acc, [t]: (acc[t] ?? 0) + 1 }), {});
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tool, n]) => ({ tool, n }));
}

function Matrix() {
  const rows = useMemo(usageRows, []);
  const [hover, setHover] = useState({ r: null, c: null });
  const clear = () => setHover({ r: null, c: null });

  return (
    <div className="mx reveal" onMouseLeave={clear}>
      <p className="mx__cap mono">pd.crosstab(tool, project)</p>
      <div className="mx__scroll">
        <table className="mx__table">
          <thead>
            <tr>
              <th scope="col" className="mx__corner">tool</th>
              {PROJECTS.map((p, c) => (
                <th key={p.id} scope="col" data-c={p.color} className={hover.c === c ? 'is-hot' : ''}>
                  <span className="mx__col"><i />{p.name.split(' ')[0]}</span>
                </th>
              ))}
              <th scope="col" className="mx__sum">Σ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={row.tool} className={hover.r === r ? 'is-hot' : ''}>
                <th scope="row"><span className="mx__tool"><ToolIcon name={row.tool} size={13} />{row.tool}</span></th>
                {PROJECTS.map((p, c) => {
                  const used = p.stack.includes(row.tool);
                  return (
                    <td
                      key={p.id} data-c={p.color}
                      className={`${used ? 'is-used' : ''} ${hover.c === c ? 'is-col' : ''}`}
                      onMouseEnter={() => setHover({ r, c })}
                    >
                      <span className="mx__cell" aria-label={used ? `${row.tool} used in ${p.name}` : `${row.tool} not used in ${p.name}`} />
                    </td>
                  );
                })}
                <td className="mx__sum mono">{row.n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mx__foot">Hover to cross-reference. Python shows up in three of four builds — it’s home base.</p>
    </div>
  );
}

export default function Skills() {
  return (
    <section className="section skills" id="skills">
      <div className="wrap">
        <SectionHead
          index="3"
          code="mukesh.toolbox.value_counts()"
          title="A toolbox, cross-tabulated."
          lede="What I reach for, grouped by job — and on the right, exactly where each tool has shipped in a real project."
        />

        <div className="skills__grid">
          <div className="skills__groups">
            {SKILL_GROUPS.map((g) => (
              <div key={g.id} className="sg reveal">
                <h3 className="sg__title">{g.title}</h3>
                <ul className="sg__items">
                  {g.items.map((t) => (
                    <li key={t} className="chip sg__chip" style={{ '--brand': brandHex(t) }}>
                      <ToolIcon name={t} />{t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Matrix />
        </div>

        <div className="methods reveal">
          <h3 className="methods__title">Methods I can explain on a whiteboard</h3>
          <ul className="methods__list">
            {METHODS.map((m, i) => <li key={m} data-c={['blue', 'red', 'green', 'yellow'][i % 4]}>{m}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
