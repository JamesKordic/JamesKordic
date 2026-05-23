'use client';

import { ReactNode, useRef, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';
import { PlayerBar } from './player-bar';
import { Lightbox } from './lightbox';
import { ScrollProvider } from '@/lib/scroll-context';
import { getProject, ARTIST } from '@/lib/projects';
import { usePlayer } from '@/lib/player-context';

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const viewRef = useRef<HTMLDivElement>(null);
  const { togglePlay } = usePlayer();

  // Determine title for top bar based on route
  let title = ARTIST;
  let showPlay = true;
  if (pathname?.startsWith('/work/')) {
    const slug = pathname.replace('/work/', '');
    const p = getProject(slug);
    if (p) title = p.title;
  } else if (pathname === '/search') {
    title = 'Browse Work';
    showPlay = false;
  } else if (pathname === '/about') {
    title = 'About';
    showPlay = false;
  }

  // Reset scroll when route changes
  useEffect(() => {
    if (viewRef.current) viewRef.current.scrollTop = 0;
  }, [pathname]);

  // Space bar toggles play (when not focused on input)
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
      {/* Root grid:
       *   Mobile: single column, content row + 78px player row
       *   Desktop: 248px sidebar + content, content row + 92px player row
       * h-svh uses the small viewport height unit on mobile, which excludes
       * the browser's UI chrome. Falls back to h-screen for browsers that
       * don't support svh. overflow-hidden prevents the document itself from
       * scrolling — only the inner viewRef should scroll. */}
      <div className="grid grid-cols-1 lg:grid-cols-[248px_1fr] grid-rows-[1fr_64px] sm:grid-rows-[1fr_78px] lg:grid-rows-[1fr_92px] gap-2 h-screen h-svh p-2 overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="row-start-1 col-start-1 lg:col-start-2 bg-gradient-to-b from-panel-2 to-panel rounded-[11px] relative min-h-0 overflow-hidden">
          <TopBar
            title={title}
            showPlay={showPlay}
            onMenu={() => setSidebarOpen(true)}
            scrollRef={viewRef}
          />
          <div
            ref={viewRef}
            className="absolute inset-0 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-styled"
          >
            <div className="view-anim">{children}</div>
          </div>
        </main>

        <PlayerBar />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-[120] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Lightbox />
    </ScrollProvider>
  );
}
