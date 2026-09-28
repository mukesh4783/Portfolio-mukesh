/* ─────────────────────────────────────────────────────────────
   PROJECTS — single source of truth for the Work section and
   the Toolkit "used in N projects" counts.

   visual: which animated simulation renders on the card
           ('rag' | 'gov' | 'manim' | 'billing')
   stack:  names must be known to TechIcon (unknown names fall
           back to a monogram, so nothing breaks).
   ───────────────────────────────────────────────────────────── */

export const PROJECTS = [
  {
    id: 'rag',
    no: 'Fig. 01',
    year: 'Jul 2026',
    name: 'WebRAG',
    subtitle: 'Grounded Q&A Bot',
    tagline: 'Ask a question about any web page — get an answer that can only come from that page.',
    kind: 'Retrieval-augmented generation',
    role: 'Solo build — ML & retrieval engineering',
    href: 'https://github.com/mukesh4783', // TODO: exact repo URL
    demo: null, // TODO: live demo URL
    visual: 'rag',
    stack: ['Python', 'LangChain', 'Chroma', 'OpenAI', 'Streamlit'],
    highlights: [
      { value: 0, prefix: '≈', suffix: '%', label: 'hallucination on out-of-scope queries' },
      { value: 30, prefix: '+', suffix: '%', label: 'retrieval relevance' },
      { value: 40, prefix: '−', suffix: '%', label: 'per-query latency vs cloud vector DBs' },
    ],
    flowTitle: 'Retrieval pipeline',
    flow: [
      { label: 'Web loader', icon: 'Globe' },
      { label: 'Chunk 1000/200', icon: 'Split' },
      { label: 'Embed', icon: 'OpenAI' },
      { label: 'Chroma store', icon: 'Chroma' },
      { label: 'GPT-4o-mini', icon: 'OpenAI' },
      { label: 'Cited answer', icon: 'Check' },
    ],
    detail: [
      'A Retrieval-Augmented Generation app that answers strictly from live, user-supplied web pages instead of the model’s training memory. If the answer isn’t on the page, it says so.',
      'LangChain’s WebBaseLoader pulls the page; a RecursiveCharacterTextSplitter cuts it into 1000-character chunks with 200-character overlap; OpenAI text-embedding-3-small vectors go into a local Chroma store; GPT-4o-mini answers with the retrieved context only.',
      'Every source is SHA-256 hashed — when a page changes, the app detects it, re-indexes only what moved, and the Streamlit UI shows a diff-based freshness report.',
    ],
  },
  {
    id: 'gov',
    no: 'Fig. 02',
    year: 'Jul 2026',
    name: 'GramSetu',
    subtitle: 'Digital Village Portal',
    tagline: 'Rural administration, online — requests, schemes and certificates tracked in real time.',
    kind: 'Full-stack · Analytics',
    role: 'Architect & full-stack developer',
    href: 'https://github.com/mukesh4783', // TODO: exact repo URL
    demo: null, // TODO: Vercel URL
    visual: 'gov',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Chart.js', 'Gemini', 'Vercel', 'JWT'],
    highlights: [
      { value: 10, suffix: '+', label: 'citizen workflows digitised' },
      { value: 45, prefix: '+', suffix: '%', label: 'request-processing visibility' },
      { value: 500, suffix: '+', label: 'concurrent sessions at 99% uptime' },
    ],
    flowTitle: 'Request lifecycle',
    flow: [
      { label: 'Citizen request', icon: 'User' },
      { label: 'React portal', icon: 'React' },
      { label: 'JWT role auth', icon: 'JWT' },
      { label: 'Express API', icon: 'Express' },
      { label: 'MongoDB Atlas', icon: 'MongoDB' },
      { label: 'Admin analytics', icon: 'Chart.js' },
    ],
    detail: [
      'A full-stack digital governance portal that bridges village administration and citizen services. Citizens raise service requests, apply for welfare schemes and request certificates — and can watch each one move through the pipeline.',
      'Administrators get an analytics dashboard built on Chart.js that surfaces backlogs and turnaround times; a multilingual Google Gemini chatbot answers questions in the language the citizen writes in.',
      'Deployed on Vercel with MongoDB Atlas and JWT-based role authorisation, it sustained 500+ concurrent sessions at 99% uptime.',
    ],
  },
  {
    id: 'manim',
    no: 'Fig. 03',
    year: 'Apr 2026',
    name: 'Manimax',
    subtitle: 'Prompt → Explainer Video',
    tagline: 'Type a concept. A local LLM writes the Manim, the narration, and renders the lesson.',
    kind: 'Generative AI pipeline',
    role: 'AI pipeline engineer',
    href: 'https://github.com/mukesh4783', // TODO: exact repo URL
    demo: null,
    visual: 'manim',
    stack: ['Python', 'Manim', 'Ollama', 'Docker', 'FFmpeg'],
    highlights: [
      { value: 70, prefix: '−', suffix: '%', label: 'manual animation scripting time' },
      { value: 60, prefix: '−', suffix: '%', label: 'inference cost per video' },
      { value: 50, prefix: '−', suffix: '%', label: 'environment setup time' },
    ],
    flowTitle: 'Generation pipeline',
    flow: [
      { label: 'Topic prompt', icon: 'Prompt' },
      { label: 'Local LLM plans', icon: 'Ollama' },
      { label: 'Manim script', icon: 'Python' },
      { label: 'Narration', icon: 'Wave' },
      { label: 'FFmpeg merge', icon: 'FFmpeg' },
      { label: 'MP4 out', icon: 'Video' },
    ],
    detail: [
      'An AI pipeline that turns a natural-language prompt into a finished educational video: the model plans chapters, writes narration and generates Manim code for equations, graphs and transforms.',
      'Everything runs on local LLMs, removing the dependency on paid external APIs; the renderer and model are containerised with Docker for a portable, zero-dependency setup.',
    ],
  },
  {
    id: 'billing',
    no: 'Fig. 04',
    year: 'Jun 2025',
    name: 'Inventory & Billing',
    subtitle: 'Management System',
    tagline: 'Stock, pricing and invoices that stay in sync the moment an item leaves the shelf.',
    kind: 'Data systems',
    role: 'Developer — separate customer & manager modules',
    href: 'https://github.com/mukesh4783', // TODO: exact repo URL
    demo: null,
    visual: 'billing',
    stack: ['Python', 'MySQL'],
    highlights: [
      { value: 2, label: 'role-based modules — customer & manager' },
      { text: 'Live', label: 'stock updates on every sale' },
      { text: 'Auto', label: 'itemised bill generation' },
    ],
    flowTitle: 'Transaction flow',
    flow: [
      { label: 'Cart', icon: 'Cart' },
      { label: 'Price lookup', icon: 'Python' },
      { label: 'MySQL txn', icon: 'MySQL' },
      { label: 'Stock update', icon: 'Box' },
      { label: 'Bill printed', icon: 'Receipt' },
    ],
    detail: [
      'A Python and MySQL inventory and billing system with separate customer and manager modules. Managers maintain the catalogue, pricing and stock; customers build a cart and check out.',
      'Every sale runs as a single transaction — stock is decremented in real time, low-stock items are flagged for reorder, and an itemised bill is generated automatically.',
    ],
  },
];

/* { Python: 3, React: 1, ... } */
export function projectCountByTech() {
  return PROJECTS.reduce(
    (acc, p) => p.stack.reduce((a, t) => ({ ...a, [t]: (a[t] ?? 0) + 1 }), acc),
    {},
  );
}

export const FILTER_TECHS = ['Python', 'LangChain', 'React', 'MongoDB', 'Docker', 'MySQL', 'Ollama'];
