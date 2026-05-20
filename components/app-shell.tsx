'use client';

import { ReactNode, useRef, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Rail } from './rail';
import { PlayerBar } from './player-bar';
import { Lightbox } from './lightbox';
import { TopChrome } from './top-chrome';
import { ScrollProvider } from '@/lib/scroll-context';
import { usePlayer } from '@/lib/player-context';

export function AppShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const viewRef = useRef<HTMLDivElement>(null);
  const { togglePlay } = usePlayer();

  // Reset scroll on navigation
  useEffect(() => {
    if (viewRef.current) viewRef.current.scrollTop = 0;
  }, [pathname]);

  // Space toggles play
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        togglePlay();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [togglePlay]);

  return (
    <ScrollProvider value={viewRef}>
      <div className="h-screen w-screen flex flex-col bg-paper relative z-[2]">
        <div className="flex-1 min-h-0 flex">
          {/* Icon rail — thin left rail with hover-out labels */}
          <Rail open={drawerOpen} onClose={() => setDrawerOpen(false)} />

          {/* Main canvas */}
          <main className="flex-1 min-w-0 relative overflow-hidden">
            <TopChrome onMenu={() => setDrawerOpen(true)} scrollRef={viewRef} />
            <div
              ref={viewRef}
              className="absolute inset-0 overflow-y-auto scrollbar-styled"
            >
              <div className="view-anim">{children}</div>
            </div>
          </main>
        </div>

        {/* Player bar at bottom — full width */}
        <PlayerBar />
      </div>

      {drawerOpen && (
        <div
          className="fixed inset-0 bg-ink/40 z-[120] lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <Lightbox />
    </ScrollProvider>
  );
}
