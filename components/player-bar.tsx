'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { usePlayer } from '@/lib/player-context';
import { getProject, fmtTime } from '@/lib/projects';

/**
 * New player bar:
 * - Single thin horizontal strip, no border between sections
 * - Cover + title on the left
 * - Hairline progress bar at the very bottom (touches the floor)
 * - Controls cluster on the right
 * - Mono metadata feels like a transmission readout, not an app
 */
export function PlayerBar() {
  const { state, togglePlay, prev, next, toggleShuffle, toggleRepeat, seek, toggleLike } =
    usePlayer();
  const barRef = useRef<HTMLDivElement>(null);

  const p = getProject(state.id);
  if (!p) return null;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return;
    const r = barRef.current.getBoundingClientRect();
    seek((e.clientX - r.left) / r.width);
  };

  const liked = !!state.liked[state.id];

  return (
    <footer className="relative bg-ink text-paper border-t border-ink/40 z-30">
      {/* Hairline progress bar at the absolute floor */}
      <div
        ref={barRef}
        onClick={handleSeek}
        className="absolute top-0 left-0 right-0 h-[3px] bg-ink-2 cursor-pointer group hover:h-[5px] transition-[height]"
      >
        <div
          className="h-full bg-coral relative"
          style={{ width: `${state.progress * 100}%` }}
        >
          <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-coral opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6 px-3 sm:px-6 py-3">
        {/* Now playing — cover + title + tags */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/work/${state.id}`}
            className="w-12 h-12 sm:w-14 sm:h-14 flex-none overflow-hidden bg-paper-3 relative group"
          >
            <Image src={p.cover} alt="" fill sizes="56px" className="object-cover" />
          </Link>
          <div className="min-w-0">
            <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-coral mb-0.5">
              {state.playing ? '◉ NOW PLAYING' : '◯ ON DECK'}
            </div>
            <Link
              href={`/work/${state.id}`}
              className="font-display font-bold text-[15px] sm:text-[17px] tracking-[-0.01em] leading-tight truncate hover:text-coral transition-colors block"
            >
              {p.title}
            </Link>
            <div className="font-mono text-[10px] text-muted-2 truncate mt-0.5 hidden sm:block">
              {p.tags.join(' · ').toUpperCase()}
            </div>
          </div>
        </div>

        {/* Controls — center */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleShuffle}
            className={`hidden sm:flex w-7 h-7 items-center justify-center transition-colors ${
              state.shuffle ? 'text-coral' : 'text-muted-2 hover:text-paper'
            }`}
            aria-label="Shuffle"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M3 5h4l10 14h4M3 19h4l3-4M21 5h-4l-3 4M18 2l3 3-3 3M18 16l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={prev}
            className="text-muted-2 hover:text-paper transition-colors"
            aria-label="Previous"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M7 6v12H5V6zm2 6 10 6V6z" />
            </svg>
          </button>
          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-coral hover:bg-coral-deep transition-all hover:scale-105 active:scale-95 flex items-center justify-center flex-none text-paper"
            aria-label={state.playing ? 'Pause' : 'Play'}
          >
            {state.playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M7 5h4v14H7zm6 0h4v14h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 translate-x-px">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button
            onClick={next}
            className="text-muted-2 hover:text-paper transition-colors"
            aria-label="Next"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17 6v12h2V6zm-2 6L5 6v12z" />
            </svg>
          </button>
          <button
            onClick={toggleRepeat}
            className={`hidden sm:flex w-7 h-7 items-center justify-center transition-colors ${
              state.repeat ? 'text-coral' : 'text-muted-2 hover:text-paper'
            }`}
            aria-label="Repeat"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M17 3l3 3-3 3M3 11V9a4 4 0 0 1 4-4h13M7 21l-3-3 3-3M21 13v2a4 4 0 0 1-4 4H4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Right cluster — timecode, eq, like */}
        <div className="hidden sm:flex items-center justify-end gap-4">
          <span className="font-mono text-[11px] tabular-nums text-muted-2">
            {fmtTime(state.progress * p.len)} / {fmtTime(p.len)}
          </span>
          <span className={`eq ${state.playing ? 'run' : ''} text-coral`}>
            <span /><span /><span /><span /><span />
          </span>
          <button
            onClick={() => toggleLike()}
            className={`transition-all hover:scale-110 ${
              liked ? 'text-coral' : 'text-muted-2 hover:text-paper'
            }`}
            aria-label="Like"
          >
            <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M12 20s-7-4.4-9.2-9C1.3 8 3 4.5 6.4 4.5c2.2 0 3.7 1.4 4.6 3 .9-1.6 2.4-3 4.6-3 3.4 0 5.1 3.5 3.6 6.5C19 15.6 12 20 12 20Z" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
