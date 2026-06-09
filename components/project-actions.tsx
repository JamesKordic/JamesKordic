'use client';

import { usePlayer } from '@/lib/player-context';
import { PlayIcon, HeartIcon } from './icons';

export function ProjectActions({ id }: { id: string }) {
  const { playFrom, state } = usePlayer();

  return (
    <div className="flex items-center gap-6 py-[22px] pb-[14px]">
      <button
        onClick={() => playFrom(id)}
        className="w-[58px] h-[58px] rounded-full bg-gradient-to-br from-accent via-cyan to-magenta flex items-center justify-center flex-none shadow-[0_8px_24px_-6px_rgba(200,241,53,0.5)] hover:scale-[1.06] active:scale-[0.96] transition-transform"
        aria-label="Play"
      >
        <PlayIcon className="w-[25px] h-[25px] fill-accent-ink" />
      </button>
     
    </div>
  );
}
