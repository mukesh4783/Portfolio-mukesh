import { useIdle } from '../../../hooks/useIdle.js';
import { useTheme } from '../../../hooks/useTheme.js';
import { portraitSrc } from '../../../lib/portrait.js';

const THEMES = Object.freeze(['light', 'dark']);

/* Both theme renders, stacked, crossfading with the page. The inactive one is only
   requested once the browser is idle, so it never competes with the first paint. */
export default function ThemedImg({ name }) {
  const { theme } = useTheme();
  const idle = useIdle();

  return THEMES.filter((t) => idle || t === theme).map((t) => (
    <img
      key={t}
      className={`pt-img ${t === theme ? 'is-on' : ''}`}
      src={portraitSrc(name, t)}
      alt=""
      draggable="false"
      decoding="async"
      fetchpriority={t === theme ? 'high' : 'low'}
    />
  ));
}
