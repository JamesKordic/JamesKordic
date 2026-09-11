'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

/** The shared site header. It stays visible while the work scrolls underneath
 * and collapses into a compact menu on small screens. */
export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const itemClass =
    'relative flex min-h-[60px] items-center justify-center border-r border-line px-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-muted transition-colors last:border-r-0 hover:text-accent sm:text-[12px]';

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur-md">
      <div className="grid grid-cols-[minmax(0,1fr)_60px] md:grid-cols-[minmax(92px,1fr)_repeat(3,minmax(70px,auto))]">
        <Link
          href="/"
          aria-label={`${T.artist.name}, home`}
          onClick={() => setMenuOpen(false)}
          className="flex min-h-[60px] items-center border-r border-line px-5 font-display text-[clamp(18px,5vw,20px)] font-semibold leading-none tracking-[-0.025em] transition-colors hover:text-accent sm:px-7 md:text-[19px]"
        >
          {T.artist.name}
        </Link>
        <button
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="relative flex min-h-[60px] items-center justify-center md:hidden"
        >
          <span className="relative block h-4 w-6" aria-hidden="true">
            <span className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300 ${menuOpen ? 'translate-y-[7.5px] rotate-45' : ''}`} />
            <span className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300 ${menuOpen ? '-translate-y-[7.5px] -rotate-45' : ''}`} />
          </span>
        </button>

        <nav aria-label="Primary navigation" className="hidden md:contents">
        <Link
          href="/#work"
          className={`${itemClass} ${pathname?.startsWith('/work') ? 'text-accent' : ''}`}
        >
          Work
          {pathname?.startsWith('/work') && (
            <span className="absolute inset-x-0 bottom-0 h-px bg-accent" />
          )}
        </Link>
        <a
          href={T.contact.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={itemClass}
        >
          Resume
        </a>
        <a href={`mailto:${T.contact.email}`} className={itemClass}>
          Contact
        </a>
        </nav>
      </div>

      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        className={`absolute inset-x-0 top-full border-b border-line bg-bg transition-[opacity,transform,visibility] duration-300 md:hidden ${
          menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
        }`}
      >
        <Link
          href="/#work"
          tabIndex={menuOpen ? 0 : -1}
          className={`flex min-h-[72px] items-center justify-between border-b border-line px-5 text-[13px] font-semibold uppercase tracking-[0.1em] ${pathname?.startsWith('/work') ? 'text-accent' : ''}`}
        >
          Work <span aria-hidden="true">↗</span>
        </Link>
        <a
          href={T.contact.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
          className="flex min-h-[72px] items-center justify-between border-b border-line px-5 text-[13px] font-semibold uppercase tracking-[0.1em]"
        >
          Resume <span aria-hidden="true">↗</span>
        </a>
        <a
          href={`mailto:${T.contact.email}`}
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
          className="flex min-h-[72px] items-center justify-between px-5 text-[13px] font-semibold uppercase tracking-[0.1em]"
        >
          Contact <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  );
}
