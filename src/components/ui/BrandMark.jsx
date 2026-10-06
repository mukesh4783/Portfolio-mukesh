import {
  siCplusplus, siDocker, siExpress, siFastapi, siFfmpeg, siGithub, siGooglegemini, siInfosys, siLangchain,
  siMongodb, siMysql, siNodedotjs, siNumpy, siOllama, siPandas, siPostgresql, siPython, siReact,
  siScikitlearn, siScipy, siStreamlit, siTypescript, siVercel,
} from 'simple-icons';

const ICONS = Object.freeze({
  cplusplus: siCplusplus,
  docker: siDocker,
  express: siExpress,
  fastapi: siFastapi,
  ffmpeg: siFfmpeg,
  github: siGithub,
  googlegemini: siGooglegemini,
  infosys: siInfosys,
  langchain: siLangchain,
  mongodb: siMongodb,
  mysql: siMysql,
  nodedotjs: siNodedotjs,
  numpy: siNumpy,
  ollama: siOllama,
  pandas: siPandas,
  postgresql: siPostgresql,
  python: siPython,
  react: siReact,
  scikitlearn: siScikitlearn,
  scipy: siScipy,
  streamlit: siStreamlit,
  typescript: siTypescript,
  vercel: siVercel,
});

// Chip labels -> icon keys, so data files can stay human-readable.
const BY_LABEL = Object.freeze({
  Python: 'python', LangChain: 'langchain', Ollama: 'ollama', Streamlit: 'streamlit', React: 'react',
  'Node.js': 'nodedotjs', Express: 'express', MongoDB: 'mongodb', Gemini: 'googlegemini', Vercel: 'vercel',
  Docker: 'docker', FFmpeg: 'ffmpeg', MySQL: 'mysql', Pandas: 'pandas', TypeScript: 'typescript',
  NumPy: 'numpy',
});

export const markFor = (label) => BY_LABEL[label];

/* Monochrome simple-icons mark; renders nothing when there is no logo. */
export default function BrandMark({ name, className, size }) {
  const icon = ICONS[name];
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}
