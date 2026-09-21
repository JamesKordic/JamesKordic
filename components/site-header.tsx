'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SITE_TEXT } from '@/lib/site-text';
import { GUTTER_X } from '@/lib/spacing';

const T = SITE_TEXT;

/** Shared header: name on the left, four links on the right. Below the
 *  `sm` breakpoint the links fold into a menu button. */
export function SiteHeader() {
  const pathname = usePathname() ?? '/';
  const onWork = pathname === '/' || pathname.startsWith('/work');
  const onAbout = pathname.startsWith('/about');
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
    { label: 'Work', href: '/', active: onWork, external: false },
    { label: 'About', href: '/about', active: onAbout, external: false },
    { label: 'Resume', href: T.contact.resumeUrl, active: false, external: true },
    { label: 'Contact', href: `mailto:${T.contact.email}`, active: false, external: false },
  ];

  const renderLink = (l: (typeof links)[number], className: string) =>
    l.href.startsWith('/') ? (
      <Link key={l.label} href={l.href} className={className} aria-current={l.active ? 'page' : undefined}>
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
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className={`flex h-16 w-full items-center justify-between gap-5 ${GUTTER_X}`}>
        <Link href="/" className="text-[18px] font-semibold tracking-[-0.01em]">
          {T.artist.name}
        </Link>

        <nav aria-label="Primary" className="hidden gap-7 text-[16px] text-muted sm:flex">
          {links.map((l) =>
            renderLink(l, `transition-colors hover:text-text ${l.active ? 'text-text' : ''}`),
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
