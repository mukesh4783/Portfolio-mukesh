// Ordered newest first. `cat` drives the filter; `mono` is the stamp text,
// `mark` a simple-icons key when the issuer has a logo there.
export const CATEGORIES = Object.freeze([
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI & ML' },
  { id: 'data', label: 'Data' },
  { id: 'code', label: 'Programming' },
]);

export const credentials = Object.freeze([
  {
    id: 'oracle-aidb',
    title: 'Oracle AI Database Certified Foundations Associate',
    issuer: 'Oracle',
    date: 'Sep 2026',
    cat: 'data',
    mono: 'O',
    link: 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=53BD9ECC6E0C666FA5E6084B1047C99845AA1B75E7C942F5E2B8690763A3D1A2',
  },
  {
    id: 'infosys-dbms',
    title: 'Database Management System',
    issuer: 'Infosys Springboard',
    date: 'Aug 2026',
    cat: 'data',
    mark: 'infosys',
    link: 'https://drive.google.com/file/d/1VTmmuJfczuPCOz-8V0OZDyBwctDQ6ehN/view?usp=drive_link',
  },
  {
    id: 'oci-ai',
    title: 'OCI AI Foundations Associate',
    issuer: 'Oracle',
    date: 'Jul 2026',
    cat: 'ai',
    mono: 'O',
    link: 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=1F6F277ED4512CB44DC3BC4DA8718C9C371913CB716671AE2C4ED306AC50DA3E',
  },
  {
    id: 'launchpad',
    title: 'AI Engineer Launchpad: LLMs and Agentic AI',
    issuer: 'Training programme',
    date: 'Jun 2026',
    cat: 'ai',
    mono: 'AI',
    link: 'https://drive.google.com/file/d/1SDnWu9bymSSRnNE1fGNPuVoSUJZ76WHd/view?usp=sharing',
  },
  {
    id: 'infosys-cpp',
    title: 'Programming Using C++',
    issuer: 'Infosys Springboard',
    date: 'Aug 2025',
    cat: 'code',
    mark: 'infosys',
    link: 'https://drive.google.com/file/d/168zU0YhxjP0dhuiwlumccxZJgJ9766aG/view?usp=drive_link',
  },
]);
