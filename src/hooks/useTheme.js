import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'mkp-theme';
const DARK = '(prefers-color-scheme: dark)';

function readStored() {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

const systemTheme = () => (window.matchMedia?.(DARK).matches ? 'dark' : 'light');

export const ThemeContext = createContext({ theme: 'light', toggle: () => {} });

/* Follows the OS until the visitor picks paper or blueprint; then it sticks. */
export function useThemeState() {
  const [stored, setStored] = useState(readStored);
  const [system, setSystem] = useState(systemTheme);
  const theme = stored ?? system;

  useEffect(() => {
    const mq = window.matchMedia?.(DARK);
    if (!mq) return undefined;
    const on = () => setSystem(mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    if (stored) document.documentElement.dataset.theme = stored;
    else delete document.documentElement.dataset.theme;
  }, [stored]);

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    setStored(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage blocked: the theme still switches for this visit */
    }
  }, [theme]);

  return useMemo(() => ({ theme, toggle }), [theme, toggle]);
}

export const useTheme = () => useContext(ThemeContext);
