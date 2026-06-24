'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { Lightbox } from './lightbox';

/**
 * Site shell. The home route is a full, self-contained index (its own header,
 * grid, and footer in the Pentagram style), so it bypasses the shell. Every
 * other route gets the shared sticky header, a centered content column, and
 * the editorial footer.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/') {
    return (
      <>
        {children}
        <Lightbox />
      </>
    );
  }

  // Case-study pages are full-bleed editorial layouts that manage their own
  // max-widths (matching the work reference), so they skip the narrow column.
  const isWork = pathname?.startsWith('/work/');

  return (
    <div className="min-h-screen bg-bg text-text">
      <SiteHeader />

      {isWork ? (
        <div key={pathname} className="view-anim">
          {children}
        </div>
      ) : (
        <main className="mx-auto max-w-[1200px] px-6 py-12 sm:px-8 sm:py-16">
          {/* keyed on pathname so each route re-triggers the entrance fade */}
          <div key={pathname} className="view-anim">
            {children}
          </div>
        </main>
      )}

      <SiteFooter />
      <Lightbox />
    </div>
  );
}
