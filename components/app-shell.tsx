'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from './sidebar';
import { Lightbox } from './lightbox';
import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

/**
 * Editorial layout shell.
 *
 * A fixed dark sidebar on the left (sticky on desktop). On mobile the
 * sidebar becomes a slide-in drawer toggled from a sticky top bar. The
 * cream main column scrolls with the document.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // The home route is a full-bleed, self-contained experience (its own nav +
  // footer in the Louis Moss style), so it bypasses the editorial sidebar shell.
  if (pathname === '/') {
    return (
      <>
        {children}
        <Lightbox />
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] min-h-screen">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

        <div className="min-w-0">
          {/* Mobile top bar */}
          <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-6 h-[60px] bg-bg/90 backdrop-blur-md border-b border-line">
            <Link href="/" className="font-display text-[20px] tracking-[-0.3px]">
              {T.artist.name}
            </Link>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="w-10 h-10 -mr-2 flex flex-col items-center justify-center gap-[5px]"
            >
              <span className="block w-5 h-[1.5px] bg-text" />
              <span className="block w-5 h-[1.5px] bg-text" />
              <span className="block w-5 h-[1.5px] bg-text" />
            </button>
          </div>

          <main className="px-7 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            {/* keyed on pathname so each route re-triggers the entrance fade */}
            <div key={pathname} className="view-anim">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile drawer backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      )}

      <Lightbox />
    </>
  );
}
