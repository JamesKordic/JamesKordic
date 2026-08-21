'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

/** Where a submission stands. `sent` swaps the form for a thank-you; an error
 *  keeps the typed message on screen so nothing is lost. */
type Status =
  | { state: 'idle' | 'sending' | 'sent' }
  | { state: 'error'; message: string };

/** The trigger's default look: the uppercase heading used in the mastheads.
 *  Callers that read as something else — the footer's call to action — pass
 *  their own. */
const TRIGGER = 'uppercase tracking-[0.01em] transition-colors hover:text-accent';

/**
 * A contact form behind a text trigger — the CONTACT heading by default, or
 * whatever is passed as children. Clicking it opens a dialog; Escape, the
 * Close link, or the backdrop closes it, and the page behind is locked while
 * it's open.
 *
 * The dialog itself is portalled to the document body. A trigger can sit
 * inside a transformed element — the project header slides on a transform when
 * it hides — and a transformed ancestor becomes the containing block for
 * `position: fixed`, which would pin the overlay to the header and carry it
 * off-screen with it.
 *
 * How it sends depends on whether `contact.formspreeEndpoint` is filled in:
 * with an endpoint the message posts there and never leaves the page; without
 * one it falls back to a prefilled `mailto:`, which needs no service but hands
 * the message to the visitor's mail app rather than sending it.
 */
export function ContactDialog({
  children = 'Contact',
  className = TRIGGER,
}: {
  /** The trigger's label. */
  children?: React.ReactNode;
  /** Replaces the trigger's styling wholesale, hover treatment included. */
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>({ state: 'idle' });
  /** Portals need a DOM to target, which only exists after mount. */
  const [mounted, setMounted] = useState(false);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  const endpoint = T.contact.formspreeEndpoint;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    firstField.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /** Reset to a blank form, so reopening never shows a stale error or a
   *  thank-you from last time. */
  const close = () => {
    setOpen(false);
    setStatus({ state: 'idle' });
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status.state === 'sending') return;

    if (!endpoint) {
      const body = `${message}\n\n—\n${name}\n${email}`;
      window.location.href = `mailto:${T.contact.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      close();
      return;
    }

    setStatus({ state: 'sending' });
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        // `_subject` sets the subject line of the notification Formspree
        // sends; `email` is what it uses as the reply-to address.
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          _subject: subject,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const detail = data?.errors?.[0]?.message as string | undefined;
        setStatus({ state: 'error', message: detail ?? 'Could not send. Try again?' });
        return;
      }
      setStatus({ state: 'sent' });
    } catch {
      setStatus({ state: 'error', message: 'Could not reach the network.' });
    }
  };

  const field =
    'w-full border-b border-line bg-transparent py-2 text-[15px] text-text outline-none transition-colors placeholder:text-muted-2 focus:border-accent sm:text-[17px]';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={className}
      >
        {children}
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Contact"
            onClick={close}
            className="animate-fadein fixed inset-0 z-50 flex items-center justify-center bg-bg/90 px-5 backdrop-blur"
          >
            {/* Stop clicks inside the panel from reaching the backdrop. */}
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={send}
              className="w-full max-w-[520px] space-y-6 border border-line bg-bg p-6 text-[15px] leading-[1.45] sm:p-8 sm:text-[17px]"
            >
              <div className="flex items-baseline justify-between gap-6">
                <h2 className="uppercase tracking-[0.01em]">Contact</h2>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="text-muted transition-colors hover:text-accent"
                >
                  Close
                </button>
              </div>

              {status.state === 'sent' ? (
                <div className="space-y-4 py-6">
                  <p>Sent — thank you.</p>
                  <p className="text-muted">You&rsquo;ll hear back at {email}.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <input
                      ref={firstField}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      autoComplete="name"
                      required
                      className={field}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      autoComplete="email"
                      required
                      className={field}
                    />
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Subject"
                      required
                      className={field}
                    />
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Message"
                      rows={4}
                      required
                      className={`${field} resize-none`}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-6">
                    <p className="text-[13px] text-muted" role="status">
                      {status.state === 'error'
                        ? status.message
                        : status.state === 'sending'
                          ? 'Sending…'
                          : 'Responds within 24 hours.'}
                    </p>
                    <button
                      type="submit"
                      disabled={status.state === 'sending'}
                      className="shrink-0 whitespace-nowrap rounded-full border border-line px-4 pb-[7px] pt-[5px] text-[13px] leading-none transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink disabled:opacity-50 disabled:hover:border-line disabled:hover:bg-transparent disabled:hover:text-text sm:text-[14px]"
                    >
                      {status.state === 'sending' ? 'Sending' : 'Send'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>,
          document.body
        )}
    </>
  );
}
