'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/lib/projects';
import { ARTIST, fmtTime } from '@/lib/projects';
import { usePlayer } from '@/lib/player-context';
import { PlayIcon } from './icons';

export function TrackRow({ p, i }: { p: Project; i: number }) {
  const { state } = usePlayer();
  const isCurrent = state.id === p.id;

  return (
    <Link
      href={`/work/${p.id}`}
      className={`track-row group grid grid-cols-[34px_1fr_90px_60px] sm:grid-cols-[34px_1fr_180px_90px_60px] items-center gap-[14px] px-3 py-[9px] rounded-md transition-colors cursor-pointer hover:bg-elev ${
        isCurrent ? '[&_.tr-name]:text-accent' : ''
      }`}
    >
      <div className="text-[15px] text-muted text-center tabular-nums relative h-5">
        <span className={`tr-num transition-opacity ${isCurrent ? 'hidden' : ''}`}>{i + 1}</span>
        <span className="tr-play absolute inset-0 flex items-center justify-center opacity-0 transition-opacity">
          <PlayIcon className="w-[14px] h-[14px] fill-text" />
        </span>
      </div>
      <div className="flex items-center gap-[13px] min-w-0">
        <div className="w-[42px] h-[42px] rounded-[5px] flex-none overflow-hidden bg-panel-2 relative">
          <Image src={p.cover} alt="" fill sizes="42px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <div className="tr-name font-semibold text-[15px] truncate">{p.title}</div>
          <div className="text-[12.5px] text-muted mt-[2px]">{ARTIST}</div>
        </div>
      </div>
      <div className="hidden sm:block text-[12.5px] text-muted truncate">{p.tags[0]}</div>
      <div className="text-[13px] text-muted text-right tabular-nums">{p.year}</div>
      <div className="text-[13px] text-muted text-right tabular-nums">{fmtTime(p.len)}</div>
    </Link>
  );
}
