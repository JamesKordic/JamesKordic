'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useRef } from 'react';
import { usePlayer } from '@/lib/player-context';
import { PROJECTS, getProject, fmtTime } from '@/lib/projects';
import { ProjectMonogram } from './project-monogram';
import { SITE_TEXT } from '@/lib/site-text';
import {
  ShuffleIcon,
  PrevIcon,
  NextIcon,
  RepeatIcon,
  PlayIcon,
  PauseIcon,
  HeartIcon,
  VolumeIcon,
  HomeIcon,
  SearchIcon,
  UserIcon,
} from './icons';

/* Synthetic "page" descriptors — render in the player bar when the
 * visitor is on a non-project page (home, search, about). Each one has
 * its own title, subtitle, link, gradient stops, and inline icon. This
 * lets the player bar reflect the current route in the same way it
 * reflects a project, while keeping the visual language consistent. */
type PageEntry = {
  title: string;
  subtitle: string;
  href: string;
  from: string;
  to: string;
  Icon: (p: { className?: string }) => JSX.Element;
};

const PAGE_ENTRIES: Record<string, PageEntry> = {
  '/': {
    title: SITE_TEXT.player.pages.home.title,
    subtitle: SITE_TEXT.player.pages.home.subtitle,
    href: '/',
    from: '#c8f135',
    to: '#22d3ee',
    Icon: HomeIcon,
  },
  '/search': {
    title: SITE_TEXT.player.pages.search.title,
    subtitle: SITE_TEXT.player.pages.search.subtitle,
    href: '/search',
    from: '#22d3ee',
    to: '#8b5cf6',
    Icon: SearchIcon,
  },
  '/about': {
    title: SITE_TEXT.player.pages.about.title,
    subtitle: SITE_TEXT.player.pages.about.subtitle,
    href: '/about',
    from: '#8b5cf6',
    to: '#ff2d8a',
    Icon: UserIcon,
  },
};

/** Inline tile used as the "cover" for non-project pages. Same visual
 *  language as ProjectMonogram (gradient + centered glyph) but with a
 *  page icon instead of a brand logo. Renders at the size given. */
function PageTile({ entry, size }: { entry: PageEntry; size: number }) {
  const { Icon } = entry;
  return (
    <div
      className="rounded-[5px] flex-none flex items-center justify-center relative overflow-hidden text-text"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${entry.from} 0%, ${entry.to} 100%)`,
      }}
      aria-hidden
    >
      {/* Subtle inner highlight — matches the ProjectMonogram tile's depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.10) 100%)',
        }}
      />
      <Icon className={`relative ${size <= 42 ? 'w-5 h-5' : 'w-7 h-7'}`} />
    </div>
  );
}

export function PlayerBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { state, togglePlay, toggleShuffle, toggleRepeat, seek, setVol, playFrom } =
    usePlayer();
  const barRef = useRef<HTMLDivElement>(null);
  const volRef = useRef<HTMLDivElement>(null);

  /* Decide what the player bar should reflect:
   *   - On a project page → that project (full controls visible)
   *   - On a non-project page → a synthetic "page" entry (controls hidden) */
  const pageEntry = pathname ? PAGE_ENTRIES[pathname] : undefined;
  const isPageMode = !!pageEntry;

  const p = getProject(state.id);
  if (!p && !isPageMode) return null;

  /* PAGE MODE — visitor is on home/about/search. Render a simplified bar
   *  with the synthetic page entry on the left and no playback controls.
   *  The bar still occupies its grid row in the layout so the page below
   *  doesn't reflow; it just shows a different identity. */
  if (isPageMode && pageEntry) {
    return (
      <footer className="col-span-1 lg:col-span-2 row-start-2 bg-panel/95 backdrop-blur-sm rounded-[10px] lg:bg-transparent lg:backdrop-blur-none lg:rounded-none flex items-center px-3 sm:px-4 gap-3 sm:gap-4 min-w-0 overflow-hidden">
        <Link
          href={pageEntry.href}
          className="flex-none shadow-[0_5px_14px_-4px_rgba(0,0,0,0.6)] rounded-[5px]"
          aria-label={`Open ${pageEntry.title}`}
        >
          <span className="sm:hidden">
            <PageTile entry={pageEntry} size={40} />
          </span>
          <span className="hidden sm:inline-block">
            <PageTile entry={pageEntry} size={58} />
          </span>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-[13px] sm:text-[14px] truncate">{pageEntry.title}</div>
          <div className="text-[10.5px] sm:text-[11.5px] text-muted truncate mt-[2px]">
            {pageEntry.subtitle}
          </div>
        </div>
        {/* Right-side label so the bar visually balances — a small
         *  "Now browsing" indicator with the page's gradient color so it
         *  reads as a state badge, not as a clickable control. */}
        <div className="hidden sm:flex items-center gap-2 flex-none">
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase gradient-text-static">
            {SITE_TEXT.player.nowBrowsingLabel}
          </span>
        </div>
      </footer>
    );
  }

  // PROJECT MODE — visitor is on /work/<slug>. From here on, p is guaranteed
  // to exist (the early returns above filtered out null cases). We non-null
  // assert it because TypeScript can't narrow across the boolean branches.
  const project = p!;

  // Compute the prev/next project ids based on the current id's position in
  // PROJECTS. Wraps around at the boundaries. These are used to BOTH update
  // the player state and navigate the browser to that project's page.
  const currentIdx = PROJECTS.findIndex((proj) => proj.id === state.id);
  const prevIdx = (currentIdx - 1 + PROJECTS.length) % PROJECTS.length;
  const nextIdx = (currentIdx + 1) % PROJECTS.length;
  const prevId = PROJECTS[prevIdx].id;
  const nextId = PROJECTS[nextIdx].id;

  const goPrev = () => {
    playFrom(prevId);
    router.push(`/work/${prevId}`);
  };
  const goNext = () => {
    playFrom(nextId);
    router.push(`/work/${nextId}`);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return;
    const r = barRef.current.getBoundingClientRect();
    seek((e.clientX - r.left) / r.width);
  };

  const handleVol = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volRef.current) return;
    const r = volRef.current.getBoundingClientRect();
    setVol((e.clientX - r.left) / r.width);
  };


  return (
    /* PlayerBar layout
     *
     *  Mobile (< sm):
     *    Single row, single column. Only the essentials visible:
     *      [ cover ][ title/tags ][ play ][ next ]
     *    The bar takes the full width (col-span-1) and uses the panel
     *    background for a clean docked look. Like button, shuffle,
     *    repeat, time, progress bar, and volume are all hidden — they
     *    can be accessed from the project page itself.
     *
     *  Tablet (sm) and up:
     *    3-column grid with Now Playing | Controls+Progress | (nothing yet)
     *
     *  Desktop (lg):
     *    Full 3-column grid with the right side showing EQ + volume.
     *    `col-span-2` only applies when the shell has 2 columns,
     *    which is only at lg+ — at smaller sizes the player sits in
     *    the single shell column. */
    <footer className="col-span-1 lg:col-span-2 row-start-2 bg-panel/95 backdrop-blur-sm rounded-[10px] lg:bg-transparent lg:backdrop-blur-none lg:rounded-none grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_2fr_1fr] items-center px-3 sm:px-4 gap-3 sm:gap-4 min-w-0 overflow-hidden">
      {/* Now Playing */}
      <div className="flex items-center gap-2.5 sm:gap-[14px] min-w-0">
        {/* Cover tile — uses the same gradient + logo monogram treatment
         *  as the library sidebar, not the photographic cover. Renders
         *  two sizes (mobile 40px, desktop 58px) because ProjectMonogram
         *  takes a fixed numeric size prop rather than CSS-responsive
         *  sizing. The drop shadow stays so the tile reads as a card
         *  sitting on top of the player bar surface. */}
        <Link
          href={`/work/${state.id}`}
          className="flex-none shadow-[0_5px_14px_-4px_rgba(0,0,0,0.6)] rounded-[5px] cursor-pointer"
          aria-label={`Open ${project.title}`}
        >
          <span className="sm:hidden">
            <ProjectMonogram p={project} size={40} />
          </span>
          <span className="hidden sm:inline-block">
            <ProjectMonogram p={project} size={58} />
          </span>
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/work/${state.id}`}
            className="block font-bold text-[13px] sm:text-[14px] truncate hover:underline"
          >
            {project.title}
          </Link>
          <div className="text-[10.5px] sm:text-[11.5px] text-muted truncate mt-[2px]">
            {project.tags.join(' · ')}
          </div>
        </div>
        
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 min-w-0">
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            onClick={toggleShuffle}
            className={`hidden sm:block transition-all hover:scale-[1.1] ${
              state.shuffle ? 'text-cyan' : 'text-muted hover:text-text'
            }`}
            aria-label="Shuffle"
          >
            <ShuffleIcon className="w-[18px] h-[18px]" />
          </button>
          {/* Prev — hidden on mobile; users can swipe / use next instead */}
          <button
            onClick={goPrev}
            className="hidden sm:block text-muted hover:text-text transition-all hover:scale-[1.1]"
            aria-label="Previous project"
          >
            <PrevIcon className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={togglePlay}
            className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-full bg-text flex items-center justify-center flex-none transition-transform hover:scale-[1.08] active:scale-[0.93]"
            aria-label="Play"
          >
            {state.playing ? (
              <PauseIcon className="w-[15px] h-[15px] sm:w-[17px] sm:h-[17px] fill-[#0a0a0a]" />
            ) : (
              <PlayIcon className="w-[15px] h-[15px] sm:w-[17px] sm:h-[17px] fill-[#0a0a0a]" />
            )}
          </button>
          <button
            onClick={goNext}
            className="text-muted hover:text-text transition-all hover:scale-[1.1]"
            aria-label="Next project"
          >
            <NextIcon className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={toggleRepeat}
            className={`hidden sm:block transition-all hover:scale-[1.1] ${
              state.repeat ? 'text-cyan' : 'text-muted hover:text-text'
            }`}
            aria-label="Repeat"
          >
            <RepeatIcon className="w-[18px] h-[18px]" />
          </button>
        </div>
        {/* Progress bar — desktop only; on mobile space is at a premium */}
        <div className="hidden sm:flex items-center gap-[11px] w-full max-w-[600px]">
          <span className="text-[11px] text-muted tabular-nums w-[34px]">
            {fmtTime(state.progress * project.len)}
          </span>
          <div
            ref={barRef}
            onClick={handleSeek}
            className="flex-1 h-[5px] bg-[#4a4a4e] rounded cursor-pointer relative group"
          >
            <div
              className="h-full bg-text rounded relative group-hover:bg-gradient-to-r group-hover:from-accent group-hover:via-cyan group-hover:to-magenta transition-colors"
              style={{ width: `${state.progress * 100}%` }}
            >
              <span className="absolute -right-[6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-text opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-[11px] text-muted tabular-nums w-[34px]">{fmtTime(project.len)}</span>
        </div>
      </div>

      {/* Right side — desktop only (EQ + volume slider) */}
      <div className="hidden lg:flex items-center justify-end gap-[14px]">
        <span className={`eq ${state.playing ? 'run' : ''}`}>
          <span /><span /><span /><span />
        </span>
        <button className="text-muted hover:text-text transition-colors" aria-label="Volume">
          <VolumeIcon className="w-[17px] h-[17px]" />
        </button>
        <div
          ref={volRef}
          onClick={handleVol}
          className="w-[92px] h-[5px] bg-[#4a4a4e] rounded cursor-pointer relative group"
        >
          <div
            className="h-full bg-text rounded group-hover:bg-gradient-to-r group-hover:from-accent group-hover:via-cyan group-hover:to-magenta transition-colors"
            style={{ width: `${state.vol * 100}%` }}
          />
        </div>
      </div>
    </footer>
  );
}
