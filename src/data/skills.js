/* Toolkit groups. Names must match TechIcon keys (or fall back to a monogram).
   Items that appear in a project's `stack` become clickable project filters. */

export const SKILL_GROUPS = [
  {
    id: 'ml',
    title: 'Machine learning',
    blurb: 'Classical models, evaluation and the maths underneath.',
    items: ['Scikit-learn', 'SciPy', 'NumPy', 'Pandas', 'PyTorch'],
  },
  {
    id: 'llm',
    title: 'LLMs & retrieval',
    blurb: 'RAG, prompting, embeddings and fine-tuning.',
    items: ['LangChain', 'Chroma', 'FAISS', 'OpenAI', 'Gemini', 'Ollama', 'Hugging Face'],
  },
  {
    id: 'viz',
    title: 'Visualisation & BI',
    blurb: 'Charts that make a decision obvious.',
    items: ['Matplotlib', 'Seaborn', 'Power BI', 'Chart.js', 'Streamlit', 'Manim'],
  },
  {
    id: 'eng',
    title: 'Engineering',
    blurb: 'Serving models and the apps around them.',
    items: ['Python', 'C++', 'Java', 'FastAPI', 'Flask', 'React', 'Node.js', 'Express', 'Docker', 'Git'],
  },
  {
    id: 'data',
    title: 'Data stores',
    blurb: 'Relational, document and vector.',
    items: ['MySQL', 'PostgreSQL', 'MongoDB'],
  },
];

export const METHODS = [
  'Zero / few-shot prompting',
  'Chain-of-thought',
  'Function calling',
  'Semantic search',
  'Query transformation',
  'LoRA · QLoRA',
  'Quantisation',
  'Instruction tuning',
  'EDA',
  'Feature engineering',
];
