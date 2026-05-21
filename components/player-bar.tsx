'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { usePlayer } from '@/lib/player-context';
import { PROJECTS, getProject, fmtTime } from '@/lib/projects';
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
    <footer className="col-span-2 row-start-2 grid grid-cols-[1fr_2fr_1fr] sm:grid-cols-[1fr_auto] lg:grid-cols-[1fr_2fr_1fr] items-center px-3 sm:px-4 gap-3 sm:gap-4">
      {/* Now Playing */}
      <div className="flex items-center gap-[14px] min-w-0">
        <Link
          href={`/work/${state.id}`}
          className="w-[46px] h-[46px] sm:w-[58px] sm:h-[58px] rounded-md flex-none overflow-hidden bg-panel-2 shadow-[0_5px_14px_-4px_rgba(0,0,0,0.6)] relative cursor-pointer"
        >
          <Image src={p.cover} alt="" fill sizes="58px" className="object-cover" />
        </Link>
        <div className="min-w-0">
          <Link
            href={`/work/${state.id}`}
            className="block font-bold text-[14px] truncate hover:underline"
          >
            {p.title}
          </Link>
          <div className="text-[11.5px] text-muted truncate mt-[2px]">{p.tags.join(' · ')}</div>
        </div>
        <button
          onClick={() => toggleLike()}
          className={`transition-transform hover:scale-[1.15] flex-none ${
            liked ? 'text-accent' : 'text-muted'
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
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-5">
          <button
            onClick={toggleShuffle}
            className={`hidden sm:block transition-all hover:scale-[1.1] ${
              state.shuffle ? 'text-accent' : 'text-muted hover:text-text'
            }`}
            aria-label="Shuffle"
          >
            <ShuffleIcon className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={goPrev}
            className="text-muted hover:text-text transition-all hover:scale-[1.1]"
            aria-label="Previous project"
          >
            <PrevIcon className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={togglePlay}
            className="w-[38px] h-[38px] rounded-full bg-text flex items-center justify-center flex-none transition-transform hover:scale-[1.08] active:scale-[0.93]"
            aria-label="Play"
          >
            {state.playing ? (
              <PauseIcon className="w-[17px] h-[17px] fill-[#0a0a0a]" />
            ) : (
              <PlayIcon className="w-[17px] h-[17px] fill-[#0a0a0a]" />
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
              state.repeat ? 'text-accent' : 'text-muted hover:text-text'
            }`}
            aria-label="Repeat"
          >
            <RepeatIcon className="w-[18px] h-[18px]" />
          </button>
        </div>
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
              className="h-full bg-text rounded relative group-hover:bg-accent transition-colors"
              style={{ width: `${state.progress * 100}%` }}
            >
              <span className="absolute -right-[6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-text opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-[11px] text-muted tabular-nums w-[34px]">{fmtTime(p.len)}</span>
        </div>
      </div>

      {/* Right side */}
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
            className="h-full bg-text rounded group-hover:bg-accent transition-colors"
            style={{ width: `${state.vol * 100}%` }}
          />
        </div>
      </div>
    </footer>
  );
}
