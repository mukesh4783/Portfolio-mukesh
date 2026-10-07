export const education = Object.freeze([
  { school: 'Lovely Professional University', what: 'B.Tech, Computer Science & Engineering', when: 'Aug 2024 - present', where: 'Phagwara, Punjab', score: '8.89', unit: 'CGPA' },
  { school: 'Army Public School', what: 'Intermediate', when: 'Apr 2023 - May 2024', where: 'Beas, Punjab', score: '86', unit: '%' },
  { school: 'Army Public School', what: 'Matriculation', when: 'Apr 2021 - May 2022', where: 'Beas, Punjab', score: '92.6', unit: '%' },
]);

export const training = Object.freeze({
  title: 'AI Engineer Launchpad: Mastering LLMs and Agentic AI',
  when: 'May - Jun 2026',
  link: 'https://drive.google.com/file/d/1SDnWu9bymSSRnNE1fGNPuVoSUJZ76WHd/view?usp=sharing',
  lines: [
    'Transformers from the inside: attention, tokenisation, embeddings, pre-training.',
    'RAG apps with LangChain and ChromaDB: chunking, semantic search, retrieval.',
    'Zero-shot, few-shot, chain-of-thought and structured prompting with function calling.',
    'Hands-on LoRA and QLoRA fine-tuning, quantisation and instruction tuning.',
  ],
});

// The commit log, newest first. `type` picks the branch colour.
export const log = Object.freeze([
  { msg: 'Certified: Oracle AI Database Foundations Associate', when: 'Sep 2026', type: 'learn' },
  { msg: 'Certified: Database Management System (Infosys)', when: 'Aug 2026', type: 'learn' },
  { msg: 'Shipped WebRAG and GramSetu', when: 'Jul 2026', type: 'ship' },
  { msg: 'Certified: OCI AI Foundations Associate', when: 'Jul 2026', type: 'learn' },
  { msg: 'Finished AI Engineer Launchpad (LLMs, RAG, LoRA)', when: 'Jun 2026', type: 'learn' },
  { msg: 'Top 15 at Resurgence Hackathon with Manimax', when: 'Apr 2026', type: 'win' },
  { msg: 'Certified: Programming Using C++ (Infosys)', when: 'Aug 2025', type: 'learn' },
  { msg: 'Delivered first paid client system', when: 'Jul 2025', type: 'ship' },
  { msg: 'Started B.Tech CSE at LPU', when: 'Aug 2024', type: 'edu' },
]);
