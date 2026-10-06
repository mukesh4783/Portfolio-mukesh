// The toolkit, printed like a cyanotype: longer exposure = deeper blue.
// exposure: 1 getting started, 2 working knowledge, 3 daily driver.
// size: xl (2x2), w (2 wide), t (2 tall), s (1x1). `used` lists projects.
export const GROUPS = Object.freeze([
  { id: 'all', label: 'All' },
  { id: 'llm', label: 'AI & LLMs' },
  { id: 'data', label: 'Data & ML' },
  { id: 'build', label: 'Build & ship' },
]);

export const tools = Object.freeze([
  { name: 'Python', group: 'data', exposure: 3, size: 'xl', marks: ['python'], used: ['WebRAG', 'Manimax', 'NCRB EDA', 'Billing'] },
  { name: 'LangChain', group: 'llm', exposure: 3, size: 'w', marks: ['langchain'], used: ['WebRAG'] },
  { name: 'Ollama', group: 'llm', exposure: 3, size: 's', marks: ['ollama'], used: ['WebRAG', 'Manimax'] },
  { name: 'RAG & prompting', group: 'llm', exposure: 3, size: 't', note: 'chunking, retrieval, CoT', used: ['WebRAG', 'Training'] },
  { name: 'Chroma', group: 'llm', exposure: 2, size: 's', used: ['WebRAG'] },
  { name: 'Manim', group: 'build', exposure: 3, size: 'w', used: ['Manimax'] },
  { name: 'Pandas & NumPy', group: 'data', exposure: 3, size: 'w', marks: ['pandas', 'numpy'], used: ['NCRB EDA'] },
  { name: 'LoRA / QLoRA', group: 'llm', exposure: 2, size: 's', note: 'fine-tuning', used: ['Training'] },
  { name: 'Gemini API', group: 'llm', exposure: 2, size: 's', marks: ['googlegemini'], used: ['GramSetu'] },
  { name: 'Scikit-learn & SciPy', group: 'data', exposure: 2, size: 'w', marks: ['scikitlearn', 'scipy'], used: ['Coursework'] },
  { name: 'Matplotlib & Seaborn', group: 'data', exposure: 2, size: 's', used: ['NCRB EDA'] },
  { name: 'Streamlit', group: 'build', exposure: 2, size: 's', marks: ['streamlit'], used: ['WebRAG'] },
  { name: 'React & Node.js', group: 'build', exposure: 2, size: 'w', marks: ['react', 'nodedotjs'], used: ['GramSetu', 'Manimax'] },
  { name: 'Docker & FFmpeg', group: 'build', exposure: 2, size: 'w', marks: ['docker'], used: ['Manimax'] },
  { name: 'MySQL & PostgreSQL', group: 'data', exposure: 2, size: 'w', marks: ['mysql', 'postgresql'], used: ['Billing'] },
  { name: 'MongoDB', group: 'build', exposure: 2, size: 's', marks: ['mongodb'], used: ['GramSetu'] },
  { name: 'FastAPI & Flask', group: 'build', exposure: 2, size: 's', marks: ['fastapi'], used: ['APIs'] },
  { name: 'Power BI', group: 'data', exposure: 1, size: 's', used: ['Coursework'] },
  { name: 'C++ & Java', group: 'build', exposure: 2, size: 's', marks: ['cplusplus'], used: ['Coursework'] },
  { name: 'Git & GitHub', group: 'build', exposure: 3, size: 'w', marks: ['github'], used: ['Everything'] },
]);
