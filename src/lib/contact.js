const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITS = Object.freeze({ name: 80, email: 120, message: 2000 });

/* Returns { field: message } for every invalid field. Empty object = valid. */
export function validate({ name = '', email = '', message = '' }) {
  const n = name.trim();
  const e = email.trim();
  const m = message.trim();
  const errors = {};
  if (!n) errors.name = 'Please add your name.';
  else if (n.length > LIMITS.name) errors.name = `Keep it under ${LIMITS.name} characters.`;
  if (!e) errors.email = 'I need an email to reply to.';
  else if (!EMAIL.test(e) || e.length > LIMITS.email) errors.email = 'That email does not look right.';
  if (m.length < 10) errors.message = 'A little more detail, please (10+ characters).';
  else if (m.length > LIMITS.message) errors.message = `Keep it under ${LIMITS.message} characters.`;
  return errors;
}
