'use client';

import { useState } from 'react';
import { SITE_TEXT } from '@/lib/site-text';

type FormStatus =
  | { state: 'idle' | 'sending' | 'sent' }
  | { state: 'error'; message: string };

const FIELD =
  'w-full border-b border-line bg-transparent py-4 text-[17px] text-text outline-none transition-colors placeholder:text-muted-2 focus:border-accent sm:text-[19px]';

export function ContactPageForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>({ state: 'idle' });

  const send = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.state === 'sending') return;

    const endpoint = SITE_TEXT.contact.formspreeEndpoint;
    if (!endpoint) {
      const body = `${message}\n\n—\n${name}\n${email}`;
      window.location.href = `mailto:${SITE_TEXT.contact.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus({ state: 'sending' });
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, subject, message, _subject: subject }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setStatus({
          state: 'error',
          message: data?.errors?.[0]?.message ?? 'Could not send. Please try again.',
        });
        return;
      }

      setStatus({ state: 'sent' });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setStatus({ state: 'error', message: 'Could not reach the network.' });
    }
  };

  if (status.state === 'sent') {
    return (
      <div className="flex min-h-[520px] flex-col justify-between p-5 sm:p-7 lg:p-10">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-accent">
          Message sent
        </p>
        <div>
          <p className="max-w-[11ch] font-display text-[clamp(48px,7vw,104px)] font-semibold uppercase leading-[0.82] tracking-[-0.07em]">
            Thank you.
          </p>
          <button
            type="button"
            onClick={() => setStatus({ state: 'idle' })}
            className="mt-8 border border-line px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={send} className="flex min-h-[520px] flex-col justify-between p-5 sm:p-7 lg:p-10">
      <div>
        <p className="mb-8 font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-accent">
          Send a message
        </p>
        <div className="space-y-3">
          <label className="block">
            <span className="sr-only">Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Name"
              autoComplete="name"
              required
              className={FIELD}
            />
          </label>
          <label className="block">
            <span className="sr-only">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              autoComplete="email"
              required
              className={FIELD}
            />
          </label>
          <label className="block">
            <span className="sr-only">Subject</span>
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Subject"
              required
              className={FIELD}
            />
          </label>
          <label className="block">
            <span className="sr-only">Message</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Tell me about the project"
              rows={5}
              required
              className={`${FIELD} resize-none`}
            />
          </label>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-6">
        <p className="text-[13px] text-muted" aria-live="polite">
          {status.state === 'error'
            ? status.message
            : status.state === 'sending'
              ? 'Sending…'
              : 'I’ll get back to you soon.'}
        </p>
        <button
          type="submit"
          disabled={status.state === 'sending'}
          className="group flex shrink-0 items-center gap-5 border border-line px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink disabled:opacity-50"
        >
          {status.state === 'sending' ? 'Sending' : 'Send message'}
          <span className="text-lg transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
        </button>
      </div>
    </form>
  );
}
