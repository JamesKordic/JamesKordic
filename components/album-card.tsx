'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/lib/projects';
import { usePlayer } from '@/lib/player-context';
import { PlayIcon } from './icons';

export function AlbumCard({ p, i = 0 }: { p: Project; i?: number }) {
  const { playFrom } = usePlayer();

  return (
    <div className="stagger" style={{ animationDelay: `${i * 55}ms` }}>
      <Link
        href={`/work/${p.id}`}
        className="group block bg-transparent rounded-[9px] p-[14px] transition-colors hover:bg-elev text-left cursor-pointer"
      >
        <div className="relative mb-[14px] rounded-md overflow-hidden shadow-[0_9px_22px_-8px_rgba(0,0,0,0.65)] aspect-square bg-panel-2">
          <Image
            src={p.cover}
            alt={`${p.title} cover`}
            fill
            sizes="(max-width:560px) 50vw, (max-width:1100px) 25vw, 220px"
            className="object-cover"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              playFrom(p.id);
            }}
            className="absolute right-[9px] bottom-[9px] w-[46px] h-[46px] rounded-full bg-accent flex items-center justify-center opacity-0 translate-y-[9px] group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-[0_8px_18px_-4px_rgba(0,0,0,0.5)] hover:scale-[1.07]"
            aria-label={`Play ${p.title}`}
          >
            <PlayIcon className="w-[19px] h-[19px] fill-accent-ink" />
          </button>
        </div>
        <div className="font-display font-bold text-[16px] tracking-[-0.01em] truncate">
          {p.title}
        </div>
        <div className="text-[12.5px] text-muted mt-[5px] leading-[1.45] line-clamp-2">
          {p.year} · {p.tags.join(' / ')}
        </div>
      </Link>
    </div>
  );
}
