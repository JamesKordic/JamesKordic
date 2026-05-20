'use client';

import { usePlayer } from '@/lib/player-context';
import { PlayIcon, HeartIcon } from './icons';

export function ProjectActions({ id }: { id: string }) {
  const { playFrom, toggleLike, state } = usePlayer();
  const liked = !!state.liked[id];

  return (
    <div className="flex items-center gap-6 py-[22px] pb-[14px]">
      <button
        onClick={() => playFrom(id)}
        className="w-[58px] h-[58px] rounded-full bg-accent flex items-center justify-center flex-none shadow-[0_8px_24px_-6px_rgba(200,241,53,0.5)] hover:scale-[1.06] active:scale-[0.96] transition-transform"
        aria-label="Play"
      >
        <PlayIcon className="w-[25px] h-[25px] fill-accent-ink" />
      </button>
      <button
        onClick={() => toggleLike(id)}
        className={`transition-all hover:scale-[1.08] ${
          liked ? 'text-accent' : 'text-muted hover:text-text'
        }`}
        aria-label="Like"
      >
        <HeartIcon
          className="w-[30px] h-[30px]"
          fill={liked ? 'currentColor' : 'none'}
          strokeWidth="1.7"
        />
      </button>
    </div>
  );
}
