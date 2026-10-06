import React from 'react';
import {
  siChartdotjs, siCplusplus, siDocker, siExpress, siFastapi, siFlask, siGit, siGooglegemini,
  siLangchain, siMongodb, siMysql, siNodedotjs, siNumpy, siOllama, siOpenjdk, siPandas,
  siPostgresql, siPython, siReact, siScikitlearn, siScipy, siStreamlit, siVercel,
} from 'simple-icons';

const BRAND = {
  Python: siPython,
  'C++': siCplusplus,
  Java: siOpenjdk,
  'Scikit-learn': siScikitlearn,
  SciPy: siScipy,
  NumPy: siNumpy,
  Pandas: siPandas,
  LangChain: siLangchain,
  Gemini: siGooglegemini,
  Ollama: siOllama,
  'Chart.js': siChartdotjs,
  Streamlit: siStreamlit,
  FastAPI: siFastapi,
  Flask: siFlask,
  React: siReact,
  'Node.js': siNodedotjs,
  Express: siExpress,
  Docker: siDocker,
  Git: siGit,
  Vercel: siVercel,
  MySQL: siMysql,
  PostgreSQL: siPostgresql,
  MongoDB: siMongodb,
};

/* Brand mark when simple-icons has one, otherwise a tidy monogram. */
export default function ToolIcon({ name, size = 14 }) {
  const icon = BRAND[name];
  if (icon) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor">
        <path d={icon.path} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <rect x="1" y="1" width="22" height="22" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="12" y="16.5" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor" fontFamily="var(--font-sans)">
        {name[0]}
      </text>
    </svg>
  );
}

export const brandHex = (name) => (BRAND[name] ? `#${BRAND[name].hex}` : 'var(--ink)');
