/* Who the site is about. Everything here comes straight from the CV. */

export const PROFILE = {
  first: 'Mukesh',
  last: 'Kumar Pandey',
  short: 'Mukesh',
  role: 'Data Science & ML',
  school: 'B.Tech CSE · Lovely Professional University',
  location: 'Punjab, India',
  status: 'Open to data science & ML internships',
  email: 'mukeshkumarpandey82@gmail.com',
  resume: '/Mukesh_Kumar_Pandey_CV.pdf',
  /* Square-ish headshot, ~600px wide, face near the centre. Initials show until it exists. */
  photo: '/mukesh.webp',
  initials: 'MK',
  github: 'https://github.com/mukesh4783',
  linkedin: 'https://www.linkedin.com/in/mukesh4783/',
};

export const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

/* Rendered as a pandas-style summary table under the hero. */
export const SUMMARY = [
  { key: 'cgpa', value: 8.89, decimals: 2, context: 'B.Tech CSE, LPU' },
  { key: 'ai_systems_built', value: 3, context: 'RAG · GenAI video · Gov-tech' },
  { key: 'hackathon_rank', value: 15, prefix: 'top ', context: 'Resurgence Hackathon, LPU' },
  { key: 'certifications', value: 3, context: 'Oracle · Infosys ×2' },
  { key: 'scripting_time_cut', value: 70, prefix: '−', suffix: '%', context: 'Manimax vs. hand-written Manim' },
];

export const ABOUT = {
  lead: 'I like problems where the answer has to be earned from the data — not guessed.',
  paragraphs: [
    'I’m a Computer Science undergraduate at Lovely Professional University. Most of what I build sits where data meets language models: retrieval pipelines that refuse to make things up, local LLMs that write and render maths lessons, and dashboards that help people see what is stuck and why.',
    'I care about the unglamorous parts too — chunk sizes, evaluation, latency, cost per run, and whether the thing still works when the source page changes next week.',
  ],
  facts: [
    { k: 'Studying', v: 'B.Tech CSE, LPU · 2024 → now' },
    { k: 'Based in', v: 'Punjab, India' },
    { k: 'Exploring', v: 'LoRA / QLoRA fine-tuning' },
    { k: 'Off-screen', v: 'NCC cadet · “B” certificate, A grade' },
  ],
  softSkills: ['Problem-solving', 'Self-learning', 'Time management', 'Multitasking'],
};
