import React from 'react';
import { SUMMARY } from '../../data/profile';
import CountUp from '../common/CountUp';
import './Summary.css';

/* "At a glance" as the thing a data person reads first: a describe() table. */
export default function Summary() {
  return (
    <section className="sum" aria-labelledby="sum-title">
      <div className="wrap">
        <div className="sum__card reveal">
          <p className="sum__prompt mono" id="sum-title">
            <span className="sum__in">In [1]:</span> mukesh<span className="sum__op">.</span>describe()
          </p>
          <div className="sum__scroll">
            <table className="sum__table">
              <thead>
                <tr>
                  <th scope="col" className="sum__idx" aria-label="row" />
                  {SUMMARY.map((s) => <th key={s.key} scope="col" className="mono">{s.key}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className="mono sum__idx">value</th>
                  {SUMMARY.map((s) => (
                    <td key={s.key} className="sum__val">
                      <CountUp value={s.value} decimals={s.decimals ?? 0} prefix={s.prefix ?? ''} suffix={s.suffix ?? ''} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="mono sum__idx">context</th>
                  {SUMMARY.map((s) => <td key={s.key} className="sum__ctx">{s.context}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
          <dl className="sum__list">
            {SUMMARY.map((s) => (
              <div key={s.key}>
                <dt className="mono">{s.key}</dt>
                <dd>
                  <b><CountUp value={s.value} decimals={s.decimals ?? 0} prefix={s.prefix ?? ''} suffix={s.suffix ?? ''} /></b>
                  <span>{s.context}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
