import { useEffect, useMemo } from 'react';
import { useIdle } from '../../../hooks/useIdle.js';
import { useTheme } from '../../../hooks/useTheme.js';
import { coreMask, portraitSrc, tilePosition } from '../../../lib/portrait.js';

const cell = (i, j, cols, rows) => ({
  left: `${(j / cols) * 100}%`,
  top: `${(i / rows) * 100}%`,
  width: `${100 / cols}%`,
  height: `${100 / rows}%`,
});

/* The subject cut into 32 px patches, the way a vision transformer reads an image.
   The head and shoulders hold together; lower patches drift out into the blueprint
   grid and leave ghost cells behind. Hovering the portrait pulls them back. */
export default function Patches({ layout }) {
  const { theme } = useTheme();
  const idle = useIdle();
  const { cols, rows, core, loose, ghost, attn } = layout;
  const mask = useMemo(() => coreMask(core, cols, rows), [core, cols, rows]);
  const attnSet = useMemo(() => new Set(attn), [attn]);

  // Warm the other theme's render so the toggle never shows an empty frame.
  useEffect(() => {
    if (!idle) return;
    const img = new Image();
    img.src = portraitSrc('subject', theme === 'dark' ? 'light' : 'dark');
  }, [idle, theme]);

  const vars = { '--src': `url(${portraitSrc('subject', theme)})`, '--cols': cols, '--rows': rows };

  return (
    <div className="pa" style={vars}>
      <div className="pa__core" style={{ WebkitMaskImage: mask, maskImage: mask }} />
      {ghost.map(([i, j]) => (
        <span key={`g${i}-${j}`} className="pa__ghost" style={cell(i, j, cols, rows)} />
      ))}
      {loose.map(([i, j, dx, dy, s, o], n) => {
        const pos = tilePosition(i, j, cols, rows);
        return (
          <span
            key={`l${i}-${j}`}
            className={`pa__tile ${attnSet.has(n) ? 'is-attn' : ''}`}
            style={{
              ...cell(i, j, cols, rows),
              backgroundPosition: `${pos.x}% ${pos.y}%`,
              '--dx': dx,
              '--dy': dy,
              '--s': s,
              '--o': o,
              '--n': n,
            }}
          />
        );
      })}
    </div>
  );
}
