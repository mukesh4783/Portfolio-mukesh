/* Toolbox groups. Tools that appear in a project's stack also show up in
   the "where it was used" matrix. */

export const SKILL_GROUPS = [
  { id: 'lang', title: 'Languages', items: ['Python', 'C++', 'Java'] },
  { id: 'ml', title: 'ML & analysis', items: ['Scikit-learn', 'SciPy', 'NumPy', 'Pandas'] },
  { id: 'llm', title: 'LLMs & retrieval', items: ['LangChain', 'Chroma', 'FAISS', 'OpenAI', 'Gemini', 'Ollama'] },
  { id: 'viz', title: 'Visualisation', items: ['Matplotlib', 'Seaborn', 'Power BI', 'Chart.js', 'Streamlit', 'Manim'] },
  { id: 'eng', title: 'Build & ship', items: ['FastAPI', 'Flask', 'React', 'Node.js', 'Express', 'Docker', 'Git', 'Vercel'] },
  { id: 'data', title: 'Databases', items: ['MySQL', 'PostgreSQL', 'MongoDB'] },
];

export const METHODS = [
  'Exploratory data analysis',
  'Feature engineering',
  'Semantic search',
  'Chunking & indexing',
  'Query transformation',
  'Zero / few-shot prompting',
  'Chain-of-thought',
  'Function calling',
  'LoRA · QLoRA',
  'Quantisation',
  'Instruction tuning',
  'Model evaluation',
];
