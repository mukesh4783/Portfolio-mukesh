import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PaperPlaneTilt, WarningCircle } from '@phosphor-icons/react';
import { profile } from '../../data/profile.js';
import { LIMITS, validate } from '../../lib/contact.js';

// FormSubmit relays the message to the inbox; no keys live in the client.
// The first submission triggers a one-time confirmation email to that inbox.
const ENDPOINT = `https://formsubmit.co/ajax/${profile.email}`;
const EMPTY = Object.freeze({ name: '', email: '', message: '' });

function Field({ id, label, error, children }) {
  return (
    <div className={`fld ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-err`} className="fld__err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const set = (k) => (e) => {
    const v = e.target.value;
    setValues((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      form.querySelector(`#cf-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    if (form.elements._honey.value) return;
    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          _subject: `Portfolio message from ${values.name.trim()}`,
          _template: 'table',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) === 'false') throw new Error(data.message || `HTTP ${res.status}`);
      setStatus('sent');
      setValues(EMPTY);
    } catch {
      setStatus('error');
    }
  };

  const described = (k) => (errors[k] ? `cf-${k}-err` : undefined);

  return (
    <form className="cf" onSubmit={submit} noValidate>
      <p className="cf__tag mono">Message form</p>
      <Field id="cf-name" label="Your name" error={errors.name}>
        <input id="cf-name" name="name" autoComplete="name" maxLength={LIMITS.name} value={values.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={described('name')} />
      </Field>
      <Field id="cf-email" label="Email" error={errors.email}>
        <input id="cf-email" name="email" type="email" autoComplete="email" maxLength={LIMITS.email} value={values.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={described('email')} />
      </Field>
      <Field id="cf-message" label="Message" error={errors.message}>
        <textarea id="cf-message" name="message" rows={5} maxLength={LIMITS.message} value={values.message} onChange={set('message')} aria-invalid={!!errors.message} aria-describedby={described('message')} />
      </Field>
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />

      <div className="cf__foot">
        <button type="submit" className="btn" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending' : 'Send message'} <PaperPlaneTilt size={16} weight="bold" />
        </button>
        <div className="cf__status" role="status" aria-live="polite">
          {status === 'sent' && <span className="cf__ok">Sent. Thanks, I will get back to you soon.</span>}
          {status === 'error' && (
            <span className="cf__bad">
              <WarningCircle size={16} weight="bold" /> Could not send. Email me directly at {profile.email}.
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
