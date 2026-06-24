'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

/**
 * Sticky paper header ported from the reference design: a name mark on the
 * left (with a muted discipline suffix) and a minimal Work / About / Contact
 * text nav on the right that collapses behind a ☰ toggle on small screens.
 * About / Contact point at the home-page anchors, matching the reference's
 * single-page structure.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Work', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="site-header">
      <div className="bar">
        <Link className="brand" href="/">
          {T.artist.name} <span>— {T.artist.discipline}</span>
        </Link>

        <nav className={open ? 'nav open' : 'nav'}>
          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            ☰
          </button>
          <ul>
            {links.map((l) => (
              <li key={l.label}>
                <Link href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
