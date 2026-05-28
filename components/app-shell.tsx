'use client';

import { ReactNode, useRef, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';
import { PlayerBar } from './player-bar';
import { Lightbox } from './lightbox';
import { ScrollProvider } from '@/lib/scroll-context';
import { getProject, ARTIST } from '@/lib/projects';
import { usePlayer } from '@/lib/player-context';
import { SITE_TEXT } from '@/lib/site-text';

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const viewRef = useRef<HTMLDivElement>(null);
  /** Holds the Lenis instance when smooth scroll is active. Null on
   *  mobile (where native scroll inertia already feels great and a JS
   *  scroll layer would fight the OS gesture). */
  const lenisRef = useRef<Lenis | null>(null);
  const { togglePlay, setCurrent } = usePlayer();

  // Determine title for top bar based on route
  let title = ARTIST;
  let showPlay = true;
  let currentProjectSlug: string | null = null;
  if (pathname?.startsWith('/work/')) {
    const slug = pathname.replace('/work/', '');
    const p = getProject(slug);
    if (p) {
      title = p.title;
      currentProjectSlug = slug;
    }
  } else if (pathname === '/search') {
    title = SITE_TEXT.search.heading;
    showPlay = false;
  } else if (pathname === '/about') {
    title = SITE_TEXT.about.headings.about;
    showPlay = false;
  }

  /* Initialize smooth scroll on desktop.
   *
   * Why desktop only?
   *   - Mobile browsers already give us native momentum/inertia on
   *     touch scroll. Layering a JS scroll animation over that fights
   *     the OS gesture and ends up feeling laggy or rubber-band-y.
   *   - Desktop wheel/trackpad input is discrete and "snappy" by
   *     default — a small amount of lerp adds a polished feel that
   *     matches the music-app aesthetic.
   *
   * Why a ref + a single useEffect?
   *   - The lenis instance needs to be reachable from the route-change
   *     scroll-reset effect (so it can call lenis.scrollTo with
   *     immediate:true instead of fighting our smooth scroll loop).
   *   - matchMedia is evaluated once at mount. We don't reactively
   *     swap Lenis in/out on viewport resize — that edge case (user
   *     resizes from mobile to desktop) is handled by a page refresh. */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;

    const container = viewRef.current;
    if (!container) return;

    const lenis = new Lenis({
      wrapper: container,
      // Lerp = how much of the remaining distance to traverse each frame.
      // 0.1 = a noticeable but quick easing. Lower = more drift, higher =
      // closer to native instant feel.
      lerp: 0.1,
      // Sync touch off — we already short-circuit on mobile, but if
      // someone uses a touchscreen-equipped laptop, we still want native
      // touch inertia (not JS-driven) since browser-native is smoother
      // than anything we can drive from JS.
      syncTouch: false,
      // Smooth wheel + keyboard scrolls, but leave drag-on-scrollbar
      // alone (Lenis handles that internally without our help).
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // RAF loop drives the lerp animation. Lenis expects a high-res
    // timestamp on each tick — which is what requestAnimationFrame
    // already provides.
    let rafId = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll when route changes. Route via Lenis when it's active
  // so the smooth scroll loop knows what's going on; otherwise fall
  // back to native scrollTop assignment (mobile path).
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else if (viewRef.current) {
      viewRef.current.scrollTop = 0;
    }
  }, [pathname]);

  /* Keep the player synced with whichever project the user is viewing.
   *
   * The player bar should always reflect the current page — if you're on
   * /work/wwimf, the bar should show WWIMF. Previously the bar only
   * updated when you clicked a play button, so navigating via the sidebar
   * library left the bar showing whichever project was last played.
   *
   * We only sync TO a project (when currentProjectSlug is set). On the
   * home page, about page, or search, we leave the player alone so the
   * "last viewed project" stays visible in the bar. */
  useEffect(() => {
    if (currentProjectSlug) {
      setCurrent(currentProjectSlug);
    }
  }, [currentProjectSlug, setCurrent]);

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
