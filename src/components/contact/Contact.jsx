import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Copy, DownloadSimple, GithubLogo, LinkedinLogo, MapPin } from '@phosphor-icons/react';
import { profile } from '../../data/profile.js';
import Drafted from '../ui/Drafted.jsx';
import ContactForm from './ContactForm.jsx';
import './contact.css';

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <button type="button" className="ct__copy mono" onClick={copy} aria-label={copied ? 'Email copied' : 'Copy email address'}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? 'y' : 'n'}
          className="ct__copy-in"
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {copied ? <Check size={14} weight="bold" /> : <Copy size={14} weight="bold" />}
          {copied ? 'Copied' : 'Copy'}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export default function Contact() {
  return (
    <section className="ct" id="contact" aria-labelledby="contact-title">
      <div className="ct__grid wrap">
        <div>
          <Drafted id="contact-title" className="ct__title">Say hello</Drafted>
          <p className="ct__lede">Hiring for a data science or ML internship, or have a dataset worth a look? I reply within a day or two.</p>
          <div className="ct__mail">
            <a href={`mailto:${profile.email}`} className="ct__email">{profile.email}</a>
            <CopyEmail />
          </div>
          <ul className="ct__links">
            <li>
              <a className="link" href={profile.linkedin} target="_blank" rel="noreferrer">
                <LinkedinLogo size={18} weight="bold" /> LinkedIn
              </a>
            </li>
            <li>
              <a className="link" href={profile.github} target="_blank" rel="noreferrer">
                <GithubLogo size={18} weight="bold" /> GitHub
              </a>
            </li>
            <li>
              <a className="link" href={profile.cv} download>
                <DownloadSimple size={18} weight="bold" /> Download CV
              </a>
            </li>
            <li className="ct__loc">
              <MapPin size={18} weight="bold" /> {profile.location}
            </li>
          </ul>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
