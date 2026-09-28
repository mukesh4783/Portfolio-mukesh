/* Training, certificates, achievements, education — the "Record" section.
   `type` controls the marker colour on the timeline. */

export const TIMELINE = [
  {
    date: 'Aug 2026',
    type: 'cert',
    title: 'Database Management System',
    org: 'Infosys',
    href: null, // TODO: certificate link
  },
  {
    date: 'Jul 2026',
    type: 'cert',
    title: 'OCI AI Foundations Associate',
    org: 'Oracle',
    href: null, // TODO
  },
  {
    date: 'May — Jun 2026',
    type: 'training',
    title: 'AI Engineer Launchpad: Mastering LLMs & Agentic AI',
    org: 'Training programme',
    points: [
      'Transformers from the inside: attention, tokenisation, embeddings, pre-training objectives.',
      'RAG with LangChain, ChromaDB and FAISS — chunking, indexing, semantic search, query transformation.',
      'LoRA & QLoRA fine-tuning, quantisation, instruction tuning and evaluation.',
    ],
    href: null, // TODO
  },
  {
    date: 'Apr 2026',
    type: 'award',
    title: 'Top 15 — Resurgence Hackathon',
    org: 'Lovely Professional University',
  },
  {
    date: 'Aug 2025',
    type: 'cert',
    title: 'Programming Using C++',
    org: 'Infosys',
    href: null, // TODO
  },
  {
    date: 'Jun — Jul 2025',
    type: 'work',
    title: 'Inventory & Billing Management System',
    org: 'Project experience',
  },
  {
    date: 'Aug 2024',
    type: 'edu',
    title: 'B.Tech, Computer Science & Engineering',
    org: 'Lovely Professional University — CGPA 8.89',
  },
  {
    date: 'May 2024',
    type: 'award',
    title: 'NCC “B” Certificate — Grade A',
    org: 'National Cadet Corps',
  },
];

export const LEGEND = [
  { type: 'training', label: 'Training' },
  { type: 'cert', label: 'Certificate' },
  { type: 'award', label: 'Award' },
  { type: 'work', label: 'Experience' },
  { type: 'edu', label: 'Education' },
];

/* ── Coding profiles — ALL PLACEHOLDER NUMBERS. Replace with real stats. ── */
export const CODING = {
  leetcode: {
    handle: 'TODO-handle',
    href: 'https://leetcode.com/',
    solved: { easy: 92, medium: 71, hard: 12 }, // TODO
    total: { easy: 870, medium: 1830, hard: 820 },
  },
  github: {
    handle: 'mukesh4783',
    href: 'https://github.com/mukesh4783',
    contributions: 612, // TODO
    repos: 18, // TODO
  },
};

export const SCHOOLING = [
  { school: 'Lovely Professional University', place: 'Phagwara, Punjab', what: 'B.Tech CSE', score: '8.89 CGPA', years: '2024 — present' },
  { school: 'Army Public School', place: 'Beas, Punjab', what: 'Intermediate', score: '86%', years: '2023 — 2024' },
  { school: 'Army Public School', place: 'Beas, Punjab', what: 'Matriculation', score: '92.6%', years: '2021 — 2022' },
];
