/* Projects — the single source for the Work section and the skills matrix.
   `viz` picks the interactive figure rendered beside each project. */

export const PROJECTS = [
  {
    id: 'webrag',
    name: 'WebRAG',
    kicker: 'Retrieval-augmented generation',
    date: 'Jul 2026',
    color: 'blue',
    viz: 'retrieval',
    title: 'A Q&A bot that only answers from the page you give it.',
    summary:
      'Paste a URL, ask a question. WebRAG retrieves the relevant chunks of that live page and answers strictly from them — and when the answer isn’t there, it says so instead of guessing.',
    how: [
      'LangChain WebBaseLoader → RecursiveCharacterTextSplitter (1000-char chunks, 200 overlap)',
      'OpenAI text-embedding-3-small vectors in a local Chroma store; GPT-4o-mini answers from retrieved context only',
      'SHA-256 hash per source detects page changes; Streamlit UI shows a diff-based freshness report',
    ],
    metrics: [
      { value: '≈0%', label: 'hallucinated answers on out-of-scope questions' },
      { value: '+30%', label: 'retrieval relevance' },
      { value: '−40%', label: 'per-query latency vs cloud vector DBs' },
    ],
    stack: ['Python', 'LangChain', 'Chroma', 'OpenAI', 'Streamlit'],
    repo: 'https://github.com/mukesh4783',
  },
  {
    id: 'gramsetu',
    name: 'GramSetu',
    kicker: 'Full-stack · Analytics',
    date: 'Jul 2026',
    color: 'green',
    viz: 'flow',
    title: 'Village administration, online — every request trackable.',
    summary:
      'A digital governance portal where citizens raise service requests, apply for welfare schemes and request certificates, then watch each one move. Admins get an analytics dashboard that shows where things are stuck.',
    how: [
      'React front end, Node.js + Express API, MongoDB Atlas, JWT role-based auth',
      'Chart.js admin dashboard for backlogs and turnaround',
      'Multilingual Google Gemini chatbot answers in the citizen’s own language; deployed on Vercel',
    ],
    metrics: [
      { value: '10+', label: 'citizen workflows digitised' },
      { value: '+45%', label: 'request-processing visibility' },
      { value: '500+', label: 'concurrent sessions at 99% uptime' },
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Chart.js', 'Gemini', 'Vercel'],
    repo: 'https://github.com/mukesh4783',
  },
  {
    id: 'manimax',
    name: 'Manimax',
    kicker: 'Generative AI pipeline',
    date: 'Apr 2026',
    color: 'red',
    viz: 'morph',
    title: 'Type a concept. Get a rendered maths explainer video.',
    summary:
      'A prompt-to-video pipeline: a local LLM plans the lesson, writes the Manim animation code and the narration, and the renderer turns it into a finished video — no paid APIs involved.',
    how: [
      'Local LLMs generate Manim scripts for equations, graphs and transforms',
      'Narration text generated and synchronised with the animation',
      'Renderer and model containerised with Docker for a zero-dependency setup',
    ],
    metrics: [
      { value: '−70%', label: 'manual animation scripting time' },
      { value: '−60%', label: 'inference cost per video' },
      { value: '−50%', label: 'environment setup time' },
    ],
    stack: ['Python', 'Manim', 'Ollama', 'Docker'],
    repo: 'https://github.com/mukesh4783',
  },
  {
    id: 'billing',
    name: 'Inventory & Billing',
    kicker: 'Data systems',
    date: 'Jun – Jul 2025',
    color: 'yellow',
    viz: 'stock',
    title: 'Stock and invoices that stay in sync on every sale.',
    summary:
      'A Python + MySQL inventory and billing system with separate customer and manager modules. Managers run the catalogue, pricing and stock; customers check out and get an itemised bill automatically.',
    how: [
      'Manager module: product catalogue, pricing, stock levels',
      'Customer module: cart and checkout',
      'Real-time stock updates and automated bill generation backed by MySQL',
    ],
    metrics: [
      { value: '2', label: 'role-based modules — customer & manager' },
      { value: 'Live', label: 'stock updates on every sale' },
      { value: 'Auto', label: 'itemised bill generation' },
    ],
    stack: ['Python', 'MySQL'],
    repo: 'https://github.com/mukesh4783',
  },
];
