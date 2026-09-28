import React from 'react';
import {
  siPython, siLangchain, siStreamlit, siReact, siNodedotjs, siExpress, siMongodb,
  siChartdotjs, siGooglegemini, siVercel, siDocker, siOllama, siFfmpeg, siMysql,
  siPostgresql, siFastapi, siFlask, siScikitlearn, siPandas, siNumpy, siGithub,
  siLeetcode, siCplusplus, siOpenjdk, siJsonwebtokens, siScipy, siHuggingface,
  siPytorch, siGit,
} from 'simple-icons';

/* Brand marks from simple-icons, keyed by the display names used in data/. */
const BRANDS = {
  Python: siPython,
  LangChain: siLangchain,
  Streamlit: siStreamlit,
  React: siReact,
  'Node.js': siNodedotjs,
  Express: siExpress,
  MongoDB: siMongodb,
  'Chart.js': siChartdotjs,
  Gemini: siGooglegemini,
  Vercel: siVercel,
  Docker: siDocker,
  Ollama: siOllama,
  FFmpeg: siFfmpeg,
  MySQL: siMysql,
  PostgreSQL: siPostgresql,
  FastAPI: siFastapi,
  Flask: siFlask,
  'Scikit-learn': siScikitlearn,
  Pandas: siPandas,
  NumPy: siNumpy,
  GitHub: siGithub,
  LeetCode: siLeetcode,
  'C++': siCplusplus,
  Java: siOpenjdk,
  JWT: siJsonwebtokens,
  SciPy: siScipy,
  'Hugging Face': siHuggingface,
  PyTorch: siPytorch,
  Git: siGit,
};

/* Hand-drawn line glyphs (24×24, stroke) for concepts and brands simple-icons lacks. */
const GLYPHS = {
  Globe: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  Split: 'M4 6h16M4 12h7M13 12h7M4 18h16M11 9v6',
  Check: 'M4 12.5l5 5L20 6.5',
  User: 'M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8M4 21c1-4.5 4.5-6.5 8-6.5s7 2 8 6.5',
  Prompt: 'M4 5h16v14H4zM7 10l3 2-3 2M12 15h5',
  Wave: 'M3 12h2M7 8v8M11 5v14M15 9v6M19 11v2M21 12h0',
  Video: 'M3 6h13v12H3zM16 10l5-3v10l-5-3',
  Cart: 'M3 4h3l2.5 11h10L21 8H7M10 20a1 1 0 1 0 0-.1M17 20a1 1 0 1 0 0-.1',
  Box: 'M3 7.5L12 3l9 4.5v9L12 21l-9-4.5zM3 7.5L12 12l9-4.5M12 12v9',
  Receipt: 'M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21zM9 8h6M9 12h6M9 16h3',
  Mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
  LinkedIn: 'M4 4h16v16H4zM8 10v6M8 7.5v.1M12 16v-6M12 12.5c0-1.5 1-2.5 2.3-2.5S16 11 16 12.5V16',
  Chroma: 'M9 9a5 5 0 1 0 0 .1M15 15a5 5 0 1 0 0 .1',
  FAISS: 'M5 19L19 5M5 5h5M5 5v5M19 19h-5M19 19v-5M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
  OpenAI: 'M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9zM12 8l3.5 2v4L12 16l-3.5-2v-4z',
  Matplotlib: 'M4 20V4M4 20h16M7 16l4-5 3 3 5-7',
  Seaborn: 'M3 19c3 0 4-12 7-12s3.5 12 6 12 3-5 5-5M3 20h18',
  'Power BI': 'M6 20V12M10 20V8M14 20V4M18 20v-6',
  Manim: 'M3 17c3-10 6-10 9 0s6 10 9 0M3 12h18',
  Arrow: 'M5 12h14M13 6l6 6-6 6',
  Download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  Copy: 'M8 8h12v12H8zM4 16V4h12',
};

/** Brand-coloured logo, line glyph, or a two-letter monogram fallback. */
export default function TechIcon({ name, className = '', mono = false, size }) {
  const style = size ? { width: size, height: size } : undefined;
  const brand = BRANDS[name];
  if (brand) {
    return (
      <svg viewBox="0 0 24 24" className={`tech-icon ${className}`} style={style} aria-hidden="true">
        <path d={brand.path} fill={mono ? 'currentColor' : `#${brand.hex}`} />
      </svg>
    );
  }
  const glyph = GLYPHS[name];
  if (glyph) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`tech-icon tech-icon--line ${className}`}
        style={style}
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={glyph} />
      </svg>
    );
  }
  return (
    <span className={`tech-icon tech-icon--mono ${className}`} style={style} aria-hidden="true">
      {name.replace(/[^A-Za-z0-9]/g, '').slice(0, 2)}
    </span>
  );
}
