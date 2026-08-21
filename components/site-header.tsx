'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

/**
 * Sticky paper header in the Pentagram editorial style: a name mark with a
 * single accent dot on the left, and a minimal Work / About / Contact nav on
 * the right. On mobile the nav collapses behind a hamburger menu. Shared by the
 * home grid and the inner content pages so the chrome is identical everywhere.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links: {
    label: string;
    href: string;
    external?: boolean;
    newTab?: boolean;
  }[] = [
    { label: 'Work', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Resume', href: T.contact.resumeUrl, external: true, newTab: true },
    { label: 'Contact', href: `mailto:${T.contact.email}`, external: true },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg">
      <div className="flex items-center justify-between px-6 py-[18px] sm:px-8">
        <Link
          href="/"
          className="font-display text-[22px] sm:text-[26px] font-bold tracking-[-0.02em] leading-none"
        >
          {T.artist.name}
          <span className="text-accent">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 sm:flex sm:gap-7">
          {links.map((l) =>
            l.external ? (
              <a
                key={l.label}
                href={l.href}
                target={l.newTab ? '_blank' : undefined}
                rel={l.newTab ? 'noopener noreferrer' : undefined}
                className="text-[14px] sm:text-[15px] font-medium text-muted transition-colors hover:text-accent"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                className={`text-[14px] sm:text-[15px] font-medium transition-colors hover:text-accent ${
                  isActive(l.href) ? 'text-text' : 'text-muted'
                }`}
              >
                {l.label}
              </Link>
            )
          )}
        </nav>

        {/* Mobile hamburger toggle */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="-mr-1.5 flex h-8 w-8 flex-col items-center justify-center gap-[5px] sm:hidden"
        >
          <span
            className={`block h-[2px] w-5 bg-text transition-transform duration-200 ${
              open ? 'translate-y-[7px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-[2px] w-5 bg-text transition-opacity duration-200 ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-[2px] w-5 bg-text transition-transform duration-200 ${
              open ? '-translate-y-[7px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <nav className="flex flex-col border-t border-line px-6 py-2 sm:hidden">
          {links.map((l) =>
            l.external ? (
              <a
                key={l.label}
                href={l.href}
                target={l.newTab ? '_blank' : undefined}
                rel={l.newTab ? 'noopener noreferrer' : undefined}
                onClick={() => setOpen(false)}
                className="py-3 text-[16px] font-medium text-muted transition-colors hover:text-accent"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`py-3 text-[16px] font-medium transition-colors hover:text-accent ${
                  isActive(l.href) ? 'text-text' : 'text-muted'
                }`}
              >
                {l.label}
              </Link>
            )
          )}
        </nav>
      )}
    </header>
  );
}
