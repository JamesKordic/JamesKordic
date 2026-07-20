'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { Lightbox } from './lightbox';

/**
 * Site shell. The home, about, and work routes are full, self-contained pages
 * (their own header, full-bleed layout, and footer in the Pentagram style),
 * so they bypass the shell. Every other route gets the shared sticky header,
 * a centered content column, and the editorial footer.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (
    pathname === '/' ||
    pathname === '/about' ||
    pathname?.startsWith('/work')
  ) {
    return (
      <>
        {children}
        <Lightbox />
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <SiteHeader />

      {/* flex-1 pushes the footer to the viewport bottom on short pages */}
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-12 sm:px-8 sm:py-16">
        {/* keyed on pathname so each route re-triggers the entrance fade */}
        <div key={pathname} className="view-anim">
          {children}
        </div>
      </main>

      <SiteFooter />
      <Lightbox />
    </div>
  );
}
