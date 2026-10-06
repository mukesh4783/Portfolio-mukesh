// Single source of truth for personal details. Facts come from cv/latex.txt.
export const profile = Object.freeze({
  name: 'Mukesh Kumar Pandey',
  first: 'Mukesh',
  last: 'Kumar Pandey',
  initials: 'MK',
  role: 'Data science & ML engineering',
  lede: 'I build RAG systems, LLM pipelines and data tools that answer from evidence, not guesses.',
  status: 'Open to DS & ML internships',
  location: 'Phagwara, Punjab, India',
  email: 'mukeshkumarpandey82@gmail.com',
  linkedin: 'https://www.linkedin.com/in/mukesh4783/',
  github: 'https://github.com/mukesh4783',
  cv: '/Mukesh_Kumar_Pandey_CV.pdf',
});

export const stats = Object.freeze([
  { value: 8.89, decimals: 2, label: 'CGPA, B.Tech CSE', note: 'Lovely Professional University' },
  { value: 500, suffix: '+', label: 'sessions at 99% uptime', note: 'GramSetu on Vercel' },
  { value: 70, prefix: '-', suffix: '%', label: 'manual scripting time', note: 'Manimax vs hand-written Manim' },
  { value: 15, prefix: 'Top ', label: 'Resurgence Hackathon', note: 'LPU, with Manimax' },
]);

export const tape = Object.freeze([
  'Python', 'LangChain', 'Ollama', 'Chroma', 'RAG', 'Gemma 4', 'Gemini', 'Pandas', 'NumPy', 'Scikit-learn',
  'Streamlit', 'Manim', 'FFmpeg', 'Docker', 'React', 'Node.js', 'MongoDB', 'MySQL', 'PostgreSQL', 'LoRA / QLoRA',
]);
