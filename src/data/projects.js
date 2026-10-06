// Project copy comes from the CV and each repo's README.
// `demo` names the working plate; `proof` names the real-media preview.
export const featured = Object.freeze([
  {
    id: 'webrag',
    name: 'WebRAG',
    kicker: 'Grounded Q&A bot',
    date: 'Jul 2026',
    demo: 'retrieval',
    proof: 'rag',
    summary:
      'Paste a URL and ask a question. WebRAG answers only from that live page, and when the answer is not there it says so instead of guessing.',
    points: [
      'LangChain loader and splitter, nomic-embed-text vectors in a local Chroma store, Gemma 4 through Ollama.',
      'SHA-256 hash per page catches edits, prints a unified-diff freshness report and re-indexes on its own.',
      'Runs fully local, so no page content leaves the machine.',
    ],
    metrics: [
      { k: '~0%', v: 'out-of-scope hallucinations' },
      { k: '+30%', v: 'retrieval relevance' },
      { k: 'Auto', v: 're-index on page change' },
    ],
    stack: ['Python', 'LangChain', 'Ollama', 'Chroma', 'Streamlit'],
    github: 'https://github.com/mukesh4783/webRAG',
    preview: { type: 'image', src: '/media/rag-answer.jpg' },
  },
  {
    id: 'manimax',
    name: 'Manimax',
    kicker: 'Topic to narrated maths video',
    date: 'Apr 2026',
    demo: 'manim',
    summary:
      'Type a topic and get a narrated Manim lesson. DeepSeek plans it, Qwen3-Coder writes the animation code, validators catch render errors, and the renderer does the rest.',
    points: [
      'DeepSeek code review, stage validators and deterministic fixes for known Manim render errors.',
      'Per-chapter regeneration from feedback, with synced notes.',
      'Narration in 8 languages with edge-tts, packaged with Docker and FFmpeg.',
    ],
    metrics: [
      { k: '-70%', v: 'scripting time' },
      { k: '8', v: 'narration languages' },
      { k: 'Top 15', v: 'Resurgence Hackathon' },
    ],
    stack: ['Python', 'Manim', 'Ollama', 'Node.js', 'Docker', 'FFmpeg'],
    github: 'https://github.com/pxkuma/manimax',
    preview: { type: 'video', src: '/media/manimax-pythagoras.mp4', poster: '/media/manimax-pythagoras.jpg' },
  },
  {
    id: 'gramsetu',
    name: 'GramSetu',
    kicker: 'Digital village portal',
    date: 'Jul 2026',
    demo: 'pipeline',
    summary:
      'Citizens raise service requests, apply for schemes and request certificates, then track every one. Admins see where requests are stuck.',
    points: [
      'React front end, Node.js and Express API, MongoDB Atlas, JWT role-based auth.',
      'Chart.js admin dashboard that lifted request-processing visibility by about 45%.',
      'Multilingual Gemini 2.5 Flash chatbot, deployed on Vercel.',
    ],
    metrics: [
      { k: '10+', v: 'citizen workflows' },
      { k: '~45%', v: 'more visibility' },
      { k: '500+', v: 'sessions, 99% uptime' },
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Gemini', 'Vercel'],
    github: 'https://github.com/mukesh4783/Digital_Village_Management_Portal',
    live: 'https://gramsetu-portal.vercel.app',
    preview: { type: 'demo' },
  },
]);

export const more = Object.freeze([
  {
    id: 'billing',
    name: 'Inventory & Billing',
    kicker: 'Paid client project',
    date: 'Jun - Jul 2025',
    demo: 'stock',
    summary:
      'Python and MySQL system with customer and manager modules: stock that updates on every sale, and bills that write themselves.',
    stack: ['Python', 'MySQL'],
  },
  {
    id: 'meme',
    name: 'Meme Error',
    kicker: 'VS Code extension',
    date: 'Jul 2026',
    demo: 'meme',
    summary:
      'Watches the terminal, failed tasks and diagnostics. When something breaks, a meme pops up in the sidebar. A 3-second cooldown keeps it funny.',
    stack: ['TypeScript', 'VS Code API'],
    github: 'https://github.com/mukesh4783/cat-meme-error-popup',
  },
  {
    id: 'ncrb',
    name: 'NCRB Data EDA',
    kicker: 'Public-health dashboard',
    date: 'Apr 2026',
    demo: 'waffle',
    summary:
      'Interactive Panel dashboard over ~18k NCRB rows (2018 to 2022): state, gender, cause and socio-economic breakdowns with year and category filters.',
    stack: ['Pandas', 'Panel', 'hvPlot', 'Matplotlib'],
    github: 'https://github.com/mukesh4783/Suicide-Analysis-in-India-2018---2022-using-Python',
  },
]);
