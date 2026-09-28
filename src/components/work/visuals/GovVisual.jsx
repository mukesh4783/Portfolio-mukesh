import React from 'react';
import Frame from '../Frame';
import useInView from '../../../hooks/useInView';
import useTicker, { useLoopCount } from '../../../hooks/useTicker';
import useTyped from '../../../hooks/useTyped';
import useCountUp from '../../../hooks/useCountUp';
import './GovVisual.css';

const STEPS = [1700, 1300, 1300, 1700, 2800, 1500, 1500];
const STATUS = ['syncing', 'verifying', 'approving', 'citizen query', 'gemini replying', 'issued', 'live'];
const STAGES = ['Submitted', 'Verified', 'Approved', 'Issued'];
const STAGE_AT = [0, 1, 2, 2, 2, 3, 3];

const BARS = [42, 58, 51, 74, 66, 88, 61];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const DONUT = [
  { v: 0.56, c: 'var(--s2)', k: 'Resolved' },
  { v: 0.28, c: 'var(--s3)', k: 'In review' },
  { v: 0.16, c: 'var(--s1)', k: 'Pending' },
];

const USER_MSG = 'आय प्रमाण पत्र कब तक मिलेगा?';
const BOT_MSG = 'आपका आवेदन स्वीकृत है — 2 दिनों में जारी होगा। ✓';

function Kpi({ label, value, suffix }) {
  const n = useCountUp(value, { duration: 1400 });
  return (
    <div className="gov__kpi">
      <span className="gov__kpi-k">{label}</span>
      <span className="gov__kpi-v">{Math.round(n)}<small>{suffix}</small></span>
    </div>
  );
}

/* start offset of each segment = sum of the ones before it */
const OFFSETS = DONUT.map((_, i) => DONUT.slice(0, i).reduce((sum, d) => sum + d.v, 0));

function Donut() {
  return (
    <svg viewBox="0 0 42 42" className="gov__donut" aria-hidden="true">
      <circle cx="21" cy="21" r="15.9" className="gov__donut-bg" />
      {DONUT.map((d, i) => (
        <circle key={d.k} cx="21" cy="21" r="15.9" pathLength="100" stroke={d.c}
          className="gov__donut-seg"
          style={{ '--len': d.v * 100 - 1.5, '--off': -OFFSETS[i] * 100, '--i': i }} />
      ))}
    </svg>
  );
}

function GovScene({ step }) {
  const stage = STAGE_AT[step];
  const user = useTyped(USER_MSG, step >= 3, { speed: 45 });
  const bot = useTyped(BOT_MSG, step >= 4, { speed: 32, delay: 900 });

  return (
    <div className="gov">
      <aside className="gov__side" aria-hidden="true">
        <b>GS</b>
        {[0, 1, 2, 3].map((i) => <i key={i} className={i === 0 ? 'is-on' : ''} />)}
      </aside>

      <div className="gov__main">
        <header className="gov__top">
          <span>Panchayat dashboard</span>
          <span className="gov__lang"><b>EN</b><b className="is-on">हि</b><b>ਪੰ</b></span>
        </header>

        <div className="gov__kpis">
          <Kpi label="Workflows" value={10} suffix="+" />
          <Kpi label="Sessions" value={500} suffix="+" />
          <Kpi label="Uptime" value={99} suffix="%" />
        </div>

        <div className="gov__charts">
          <div className="gov__card gov__bars">
            <span className="gov__card-k">Requests / day</span>
            <div className="gov__plot">
              {BARS.map((h, i) => (
                <span key={i} className={`gov__bar${i === 5 ? ' is-peak' : ''}`} style={{ '--h': `${h}%`, '--i': i }}>
                  <em>{DAYS[i]}</em>
                </span>
              ))}
            </div>
          </div>
          <div className="gov__card gov__mix">
            <span className="gov__card-k">By status</span>
            <Donut />
            <ul className="gov__legend">
              {DONUT.map((d) => <li key={d.k}><i style={{ background: d.c }} />{d.k}</li>)}
            </ul>
          </div>
        </div>

        <div className="gov__card gov__track">
          <span className="gov__card-k">REQ-2041 · Income certificate</span>
          <ol className="gov__stages" style={{ '--p': stage / (STAGES.length - 1) }}>
            {STAGES.map((s, i) => (
              <li key={s} className={i < stage ? 'is-done' : i === stage ? 'is-now' : ''}>
                <i>{i < stage || (i === stage && stage === 3) ? '✓' : i + 1}</i>{s}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className={`gov__chat${step >= 3 && step <= 5 ? ' is-on' : ''}`}>
        <span className="gov__chat-h"><i />Gemini assistant</span>
        {user && <p className="gov__msg gov__msg--user">{user}</p>}
        {step >= 4 && (
          bot
            ? <p className="gov__msg gov__msg--bot">{bot}</p>
            : <p className="gov__msg gov__msg--bot gov__typing"><i /><i /><i /></p>
        )}
      </div>
    </div>
  );
}

export default function GovVisual() {
  const [ref, inView] = useInView({ threshold: 0.35 });
  const step = useTicker(STEPS, inView);
  const loop = useLoopCount(step);
  return (
    <div ref={ref} className="rv-host">
      <Frame title="gramsetu.vercel.app/admin" status={STATUS[step]} tone={step >= 5 ? 'ok' : 'run'}>
        {inView || step > 0 ? <GovScene key={loop} step={step} /> : null}
      </Frame>
    </div>
  );
}
