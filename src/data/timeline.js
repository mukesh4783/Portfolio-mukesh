/* Timeline as a swimlane chart. Dates are fractional years
   (2025.42 ≈ early June 2025) so they can be placed on an axis. */

export const AXIS = { from: 2021.15, to: 2027.0, ticks: [2022, 2023, 2024, 2025, 2026] };

export const LANES = [
  { id: 'edu', label: 'Education', color: 'blue' },
  { id: 'build', label: 'Built', color: 'red' },
  { id: 'learn', label: 'Learned', color: 'green' },
  { id: 'win', label: 'Recognised', color: 'yellow' },
];

export const NOW = 2026.74;

export const EVENTS = [
  { lane: 'edu', from: 2021.25, to: 2022.37, when: 'Apr 2021 – May 2022', title: 'Matriculation — 92.6%', org: 'Army Public School, Beas' },
  { lane: 'edu', from: 2023.25, to: 2024.37, when: 'Apr 2023 – May 2024', title: 'Intermediate — 86%', org: 'Army Public School, Beas' },
  { lane: 'edu', from: 2024.58, to: NOW, when: 'Aug 2024 – now', title: 'B.Tech CSE — CGPA 8.89', org: 'Lovely Professional University', ongoing: true },

  { lane: 'build', from: 2025.42, to: 2025.58, when: 'Jun – Jul 2025', title: 'Inventory & Billing System', org: 'Python · MySQL' },
  { lane: 'build', at: 2026.27, when: 'Apr 2026', title: 'Manimax', org: 'Prompt → maths video pipeline' },
  { lane: 'build', at: 2026.52, when: 'Jul 2026', title: 'WebRAG', org: 'Grounded Q&A bot' },
  { lane: 'build', at: 2026.56, when: 'Jul 2026', title: 'GramSetu', org: 'Digital village portal' },

  { lane: 'learn', at: 2025.6, when: 'Aug 2025', title: 'Programming Using C++', org: 'Infosys — certificate' },
  { lane: 'learn', from: 2026.35, to: 2026.5, when: 'May – Jun 2026', title: 'AI Engineer Launchpad: LLMs & Agentic AI', org: 'Transformers, RAG, LoRA / QLoRA' },
  { lane: 'learn', at: 2026.53, when: 'Jul 2026', title: 'OCI AI Foundations Associate', org: 'Oracle — certificate' },
  { lane: 'learn', at: 2026.6, when: 'Aug 2026', title: 'Database Management System', org: 'Infosys — certificate' },

  { lane: 'win', at: 2024.37, when: 'May 2024', title: 'NCC “B” Certificate — Grade A', org: 'National Cadet Corps' },
  { lane: 'win', at: 2026.27, when: 'Apr 2026', title: 'Top 15 — Resurgence Hackathon', org: 'Lovely Professional University' },
];

export const TRAINING_NOTES = [
  'Transformers from the inside — attention, tokenisation, embeddings, pre-training objectives',
  'Prompting — zero / few-shot, chain-of-thought, structured prompting, function calling',
  'RAG with LangChain, ChromaDB and FAISS — chunking, indexing, semantic search, query transformation',
  'LoRA & QLoRA fine-tuning, quantisation, instruction tuning and evaluation',
];
