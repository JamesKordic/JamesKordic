'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Lightbox } from './lightbox';

/**
 * Editorial layout shell.
 *
 * A fixed dark sidebar on the left (sticky on desktop, stacked on mobile)
 * and a cream main content column that scrolls with the document. No player
 * bar, no top bar — the music-player chrome has been removed in favor of the
 * studio-portfolio layout from the reference design.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] min-h-screen">
        <Sidebar />
        <main className="min-w-0 px-7 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          {/* keyed on pathname so each route re-triggers the entrance fade */}
          <div key={pathname} className="view-anim">
            {children}
          </div>
        </main>
      </div>
      <Lightbox />
    </>
  );
}
