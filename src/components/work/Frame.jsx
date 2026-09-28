import React from 'react';

/** Window chrome around each project simulation. `status` shows the live phase. */
export default function Frame({ title, status, tone = 'run', children, dark = false }) {
  return (
    <div className={`frame${dark ? ' frame--dark' : ''}`}>
      <div className="frame__bar">
        <span className="frame__dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="frame__title">{title}</span>
        {status && (
          <span className={`frame__status frame__status--${tone}`} aria-hidden="true">
            <b />{status}
          </span>
        )}
      </div>
      <div className="frame__body">{children}</div>
    </div>
  );
}
