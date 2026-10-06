import BrandMark, { markFor } from './BrandMark.jsx';

export default function Chips({ items, className = '' }) {
  return (
    <ul className={`chips ${className}`} aria-label="Tech used">
      {items.map((s) => (
        <li key={s} className="chip">
          <BrandMark name={markFor(s)} />
          {s}
        </li>
      ))}
    </ul>
  );
}
