'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SITE_TEXT } from '@/lib/site-text';
import { GUTTER_X } from '@/lib/spacing';

const T = SITE_TEXT;

/** Shared header: name on the left, three links on the right. Below the
 *  `sm` breakpoint the links fold into a menu button. */
export function SiteHeader() {
  const pathname = usePathname() ?? '/';
  const onWork = pathname === '/' || pathname.startsWith('/work');
  const onContact = pathname.startsWith('/contact');
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const links = [
    // Straight to the project list, not the top of the homepage.
    { label: 'Work', href: '/#work', active: onWork, external: false },
    { label: 'Resume', href: T.contact.resumeUrl, active: false, external: true },
    { label: 'Contact', href: '/contact', active: onContact, external: false },
  ];

  /** Close the menu on click as well as on route change: "Work" can be a
   *  jump within the homepage, which doesn't change the pathname. The open
   *  menu also locks page scroll, which would swallow that jump — so on the
   *  same page, scroll once the lock has been released. */
  const follow = (href: string) => () => {
    setOpen(false);
    const [path, hash] = href.split('#');
    if (hash && (path || '/') === pathname) {
      window.setTimeout(() => document.getElementById(hash)?.scrollIntoView());
    }
  };

  const renderLink = (l: (typeof links)[number], className: string) =>
    l.href.startsWith('/') ? (
      <Link
        key={l.label}
        href={l.href}
        onClick={follow(l.href)}
        className={className}
        aria-current={l.active ? 'page' : undefined}
      >
        {l.label}
      </Link>
    ) : (
      <a
        key={l.label}
        href={l.href}
        className={className}
        {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {l.label}
      </a>
    );

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-md">
      <div className={`flex h-16 w-full items-center justify-between gap-5 ${GUTTER_X}`}>
        <Link href="/" className="text-[17px] font-medium tracking-[-0.01em] transition-colors hover:text-accent">
          {T.artist.name}
        </Link>

        <nav aria-label="Primary" className="hidden gap-7 text-[17px] text-muted sm:flex">
          {links.map((l) =>
            renderLink(l, `transition-colors hover:text-accent ${l.active ? 'text-text' : ''}`),
          )}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="-mr-2 flex h-11 w-11 items-center justify-center sm:hidden"
        >
          <span className="relative block h-3.5 w-6" aria-hidden="true">
            <span className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </span>
        </button>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Mobile"
        hidden={!open}
        className={`absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto bg-bg sm:hidden ${GUTTER_X}`}
      >
        <div className="flex flex-col border-t border-line">
          {links.map((l) =>
            renderLink(
              l,
              `border-b border-line py-5 text-[28px] font-medium tracking-[-0.02em] ${l.active ? 'text-text' : 'text-muted'}`,
            ),
          )}
        </div>
      </nav>
    </header>
  );
}
