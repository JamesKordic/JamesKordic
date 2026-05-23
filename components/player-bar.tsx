'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { usePlayer } from '@/lib/player-context';
import { PROJECTS, getProject, fmtTime } from '@/lib/projects';
import { ProjectMonogram } from './project-monogram';
import {
  ShuffleIcon,
  PrevIcon,
  NextIcon,
  RepeatIcon,
  PlayIcon,
  PauseIcon,
  HeartIcon,
  VolumeIcon,
} from './icons';

export function PlayerBar() {
  const router = useRouter();
  const { state, togglePlay, toggleShuffle, toggleRepeat, seek, setVol, toggleLike, playFrom } =
    usePlayer();
  const barRef = useRef<HTMLDivElement>(null);
  const volRef = useRef<HTMLDivElement>(null);

  const p = getProject(state.id);
  if (!p) return null;

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

  const liked = !!state.liked[state.id];

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
          aria-label={`Open ${p.title}`}
        >
          <span className="sm:hidden">
            <ProjectMonogram p={p} size={40} />
          </span>
          <span className="hidden sm:inline-block">
            <ProjectMonogram p={p} size={58} />
          </span>
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/work/${state.id}`}
            className="block font-bold text-[13px] sm:text-[14px] truncate hover:underline"
          >
            {p.title}
          </Link>
          <div className="text-[10.5px] sm:text-[11.5px] text-muted truncate mt-[2px]">
            {p.tags.join(' · ')}
          </div>
        </div>
        {/* Like — hidden on mobile to save space; available on project page */}
        <button
          onClick={() => toggleLike()}
          className={`hidden sm:block transition-transform hover:scale-[1.15] flex-none ${
            liked ? 'text-magenta' : 'text-muted'
          }`}
          aria-label="Like"
        >
          <HeartIcon
            className="w-[18px] h-[18px]"
            fill={liked ? 'currentColor' : 'none'}
            stroke={liked ? 'currentColor' : 'currentColor'}
          />
        </button>
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
            {fmtTime(state.progress * p.len)}
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
          <span className="text-[11px] text-muted tabular-nums w-[34px]">{fmtTime(p.len)}</span>
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
