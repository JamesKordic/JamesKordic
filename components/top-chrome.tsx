'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { usePlayer } from '@/lib/player-context';
import { getProject, ARTIST } from '@/lib/projects';

/**
 * Minimal top chrome — no big title bar. Instead, a thin
 * status strip with timecode-style metadata + a back arrow.
 * Becomes more present when scrolled.
 */
export function TopChrome({
  onMenu,
  scrollRef,
}: {
  onMenu: () => void;
  scrollRef: React.RefObject<HTMLElement>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = usePlayer();
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      );
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 60);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollRef]);

  // Pretty path for the breadcrumb
  let crumb = 'HOME';
  if (pathname?.startsWith('/work/')) {
    const slug = pathname.replace('/work/', '');
    const p = getProject(slug);
    if (p) crumb = p.title.toUpperCase();
  } else if (pathname === '/search') crumb = 'BROWSE';
  else if (pathname === '/about') crumb = 'SIGNAL';

  return (
    <div
      className={`absolute top-0 left-0 right-0 z-20 transition-all duration-300 ${
        scrolled ? 'bg-paper/85 backdrop-blur-md border-b border-ink/10' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-4 px-4 lg:px-8 py-3">
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <button
            onClick={onMenu}
            className="lg:hidden w-8 h-8 flex items-center justify-center hover:bg-paper-2 rounded-md transition-colors"
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-5 h-5">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>

          {/* Back arrow only when not on home */}
          {pathname !== '/' && (
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] uppercase hover:text-coral transition-colors"
              aria-label="Back"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                <path d="m15 5-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase text-muted">
            <span className="w-1.5 h-1.5 bg-coral rounded-full inline-block" />
            <span>{ARTIST.toUpperCase()}</span>
            <span>/</span>
            <span className="text-ink">{crumb}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:block font-mono text-[10px] tracking-[0.18em] uppercase text-muted tabular-nums">
            {time} EST
          </span>
          <span className="hidden md:block font-mono text-[10px] tracking-[0.18em] uppercase text-muted">
            NYC
          </span>
          <a
            href="mailto:Jkordic@me.com"
            className="font-mono text-[11px] tracking-[0.12em] uppercase bg-ink text-paper px-3 py-1.5 hover:bg-coral transition-colors"
          >
            Tune In →
          </a>
        </div>
      </div>
    </div>
  );
}
