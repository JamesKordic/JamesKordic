'use client';

import { usePlayer } from '@/lib/player-context';

export function ProjectActions({ id }: { id: string }) {
  const { playFrom, toggleLike, state } = usePlayer();
  const liked = !!state.liked[id];

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => playFrom(id)}
        className="bg-coral hover:bg-coral-deep text-paper font-mono text-[11px] tracking-[0.18em] uppercase px-5 py-3 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 translate-x-px">
          <path d="M8 5v14l11-7z" />
        </svg>
        Play
      </button>
      <button
        onClick={() => toggleLike(id)}
        className={`border w-11 h-11 flex items-center justify-center transition-all hover:scale-105 ${
          liked ? 'border-coral text-coral bg-coral/10' : 'border-ink/30 text-ink hover:border-ink'
        }`}
        aria-label="Like"
      >
        <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M12 20s-7-4.4-9.2-9C1.3 8 3 4.5 6.4 4.5c2.2 0 3.7 1.4 4.6 3 .9-1.6 2.4-3 4.6-3 3.4 0 5.1 3.5 3.6 6.5C19 15.6 12 20 12 20Z" />
        </svg>
      </button>
    </div>
  );
}
