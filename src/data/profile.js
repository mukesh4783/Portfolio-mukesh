/* ─────────────────────────────────────────────────────────────
   PROFILE — edit this file to change who the site is about.
   Anything marked TODO is a placeholder waiting for real data.
   ───────────────────────────────────────────────────────────── */

export const PROFILE = {
  firstName: 'Mukesh',
  middleName: 'Kumar',
  lastName: 'Pandey',
  initials: 'MKP',
  role: 'Data Scientist & ML Engineer',
  location: 'Punjab, India',
  timezone: 'Asia/Kolkata',
  status: 'Open to internships — 2026',
  thesis:
    'I build retrieval systems, LLM pipelines and analytics that answer real questions — grounded in evidence, measured end to end, and shipped where people actually use them.',

  email: 'mukeshkumarpandey82@gmail.com',
  resume: '/Mukesh_Kumar_Pandey_CV.pdf',

  // TODO: drop a square photo into /public/images/ and set the path, e.g. '/images/mukesh.jpg'
  photo: null,

  socials: [
    { label: 'GitHub', handle: 'mukesh4783', href: 'https://github.com/mukesh4783', icon: 'GitHub' },
    { label: 'LinkedIn', handle: 'in/mukesh4783', href: 'https://www.linkedin.com/in/mukesh4783/', icon: 'LinkedIn' },
    { label: 'LeetCode', handle: 'TODO-handle', href: 'https://leetcode.com/', icon: 'LeetCode' }, // TODO
    { label: 'Email', handle: 'mukeshkumarpandey82', href: 'mailto:mukeshkumarpandey82@gmail.com', icon: 'Mail' },
  ],
};

export const NAV = [
  { id: 'toolkit', label: 'Toolkit' },
  { id: 'work', label: 'Work' },
  { id: 'record', label: 'Record' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

/* Headline numbers for the "At a glance" strip. */
export const GLANCE = [
  { value: 8.89, decimals: 2, suffix: '', label: 'CGPA', note: 'B.Tech CSE · LPU', viz: 'gauge', max: 10 },
  { value: 3, decimals: 0, suffix: '', label: 'AI systems shipped', note: 'RAG · GenAI video · Gov-tech', viz: 'dots' },
  { value: 15, decimals: 0, prefix: 'Top ', suffix: '', label: 'Resurgence Hackathon', note: 'Lovely Professional University', viz: 'rank' },
  { value: 70, decimals: 0, suffix: '%', label: 'Scripting time cut', note: 'Manimax vs. hand-written Manim', viz: 'drop' },
];

export const ABOUT = {
  paragraphs: [
    'I’m a Computer Science undergraduate at Lovely Professional University who fell for data the moment a scatter plot told me something a spreadsheet couldn’t. Since then I’ve been chasing the same feeling — turning noise into a clear, defensible answer.',
    'Lately that means large language models: retrieval pipelines that refuse to hallucinate, local models that render math videos, and chatbots that speak the languages of the people using them. I care about the unglamorous parts too — chunking strategy, evaluation, latency, and whether the thing still works next week.',
  ],
  facts: [
    { k: 'Studying', v: 'B.Tech CSE, LPU — 2024 → present' },
    { k: 'Based in', v: 'Punjab, India' },
    { k: 'Currently', v: 'LoRA / QLoRA fine-tuning experiments' },
    { k: 'Outside code', v: 'NCC cadet · B certificate, A grade' },
  ],
};
