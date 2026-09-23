'use client';

import { useState } from 'react';
import { SITE_TEXT } from '@/lib/site-text';
import { META } from '@/lib/type';

const T = SITE_TEXT;

/** Where a submission stands. An error keeps everything typed on screen so
 *  nothing is lost; `sent` swaps the form for a thank-you. */
type Status = { state: 'idle' | 'sending' | 'sent' } | { state: 'error'; message: string };

type Fields = { name: string; company: string; phone: string; email: string; message: string };
const EMPTY: Fields = { name: '', company: '', phone: '', email: '', message: '' };

/**
 * The contact form: name and message required, company, phone and email
 * optional. It posts to the Formspree endpoint in `contact.formspreeEndpoint`,
 * which forwards each message to James's inbox — send a test through it now
 * and then to make sure messages are still arriving.
 */
export function ContactForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [status, setStatus] = useState<Status>({ state: 'idle' });

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.state === 'sending') return;

    // Spam bots fill every field, including this hidden one.
    const trap = new FormData(e.currentTarget).get('_gotcha');
    if (trap) return;

    setStatus({ state: 'sending' });
    try {
      const res = await fetch(T.contact.formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...fields,
          // Subject line of the email Formspree forwards; a filled-in email
          // becomes its reply-to address.
          _subject: `Portfolio message from ${fields.name}${fields.company ? ` (${fields.company})` : ''}`,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const detail = data?.errors?.[0]?.message as string | undefined;
        setStatus({ state: 'error', message: detail ?? 'Your message didn’t send. Please try again.' });
        return;
      }
      setFields(EMPTY);
      setStatus({ state: 'sent' });
    } catch {
      setStatus({ state: 'error', message: 'Couldn’t reach the server. Check your connection and try again.' });
    }
  };

  if (status.state === 'sent') {
    return (
      <div role="status" className="border-t border-line pt-6">
        <p className="text-[clamp(22px,2.2vw,28px)] font-medium leading-snug tracking-[-0.02em]">
          {T.contactPage.sent}
        </p>
        <button
          type="button"
          onClick={() => setStatus({ state: 'idle' })}
          className="mt-4 text-muted transition-colors hover:text-accent"
        >
          Send another message
        </button>
      </div>
    );
  }

  const input =
    'mt-2 w-full rounded-none border-b border-line bg-transparent pb-3 text-[17px] text-text outline-none transition-colors placeholder:text-muted-2 focus:border-text';

  return (
    <form onSubmit={send} className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
      <Field label="Name" required className="sm:col-span-2">
        <input value={fields.name} onChange={set('name')} name="name" autoComplete="name" required className={input} />
      </Field>
      <Field label="Company">
        <input value={fields.company} onChange={set('company')} name="company" autoComplete="organization" className={input} />
      </Field>
      <Field label="Phone">
        <input value={fields.phone} onChange={set('phone')} name="phone" type="tel" autoComplete="tel" className={input} />
      </Field>
      <Field label="Email" className="sm:col-span-2">
        <input value={fields.email} onChange={set('email')} name="email" type="email" autoComplete="email" className={input} />
      </Field>
      <Field label="Message" required className="sm:col-span-2">
        <textarea
          value={fields.message}
          onChange={set('message')}
          name="message"
          rows={6}
          required
          className={`${input} resize-y`}
        />
      </Field>

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:col-span-2">
        <button
          type="submit"
          disabled={status.state === 'sending'}
          className="rounded-full bg-accent px-7 py-3.5 text-[17px] font-medium text-accent-ink transition-colors hover:bg-accent-deep disabled:opacity-60"
        >
          {status.state === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        {status.state === 'error' ? (
          <p role="alert" className={`${META} text-accent`}>
            {status.message}
          </p>
        ) : (
          <p className={`${META} text-muted`}>* Required</p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  required = false,
  className = '',
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={`${META} text-muted`}>
        {label}
        {/* `required` on the field already tells screen readers. */}
        {required ? <span aria-hidden> *</span> : ' (optional)'}
      </span>
      {children}
    </label>
  );
}
