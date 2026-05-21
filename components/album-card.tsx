'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/lib/projects';
import { usePlayer } from '@/lib/player-context';
import { PlayIcon } from './icons';

/**
 * Default catalog card — larger than before, with title/tags/year
 * always visible (not just on hover). Thumbnail is the focus.
 */
export function AlbumCard({ p, i = 0 }: { p: Project; i?: number }) {
  const { playFrom } = usePlayer();

  return (
    <div className="stagger" style={{ animationDelay: `${i * 55}ms` }}>
      <Link
        href={`/work/${p.id}`}
        className="group block bg-panel hover:bg-elev rounded-[10px] p-3 lg:p-4 transition-colors text-left cursor-pointer"
      >
        <div className="relative mb-4 rounded-md overflow-hidden shadow-[0_9px_22px_-8px_rgba(0,0,0,0.65)] aspect-square bg-panel-2">
          <Image
            src={p.cover}
            alt={`${p.title} cover`}
            fill
            sizes="(max-width:560px) 50vw, (max-width:1100px) 33vw, 25vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              playFrom(p.id);
            }}
            className="absolute right-3 bottom-3 w-12 h-12 rounded-full bg-accent flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-[0_8px_18px_-4px_rgba(0,0,0,0.5)] hover:scale-[1.07]"
            aria-label={`Play ${p.title}`}
          >
            <PlayIcon className="w-5 h-5 fill-accent-ink" />
          </button>
        </div>
        <h3 className="font-display font-bold text-[18px] lg:text-[19px] tracking-[-0.01em] leading-tight truncate">
          {p.title}
        </h3>
        <p className="text-[13.5px] text-muted mt-1.5 leading-[1.45] line-clamp-2">
          {p.blurb}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {p.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10.5px] font-semibold tracking-[0.04em] uppercase bg-elev-hi text-muted px-2 py-1 rounded-sm"
            >
              {tag}
            </span>
          ))}
          <span className="text-[10.5px] font-semibold tracking-[0.04em] uppercase text-muted-2 px-1 py-1 ml-auto">
            {p.year}
          </span>
        </div>
      </Link>
    </div>
  );
}

/**
 * Featured card — for the top-of-page showcase. Larger thumbnail,
 * more breathing room, blurb + tags + dedicated CTA.
 */
export function FeaturedCard({ p, i = 0 }: { p: Project; i?: number }) {
  const { playFrom } = usePlayer();

  return (
    <div className="stagger" style={{ animationDelay: `${i * 70}ms` }}>
      <Link
        href={`/work/${p.id}`}
        className="group block bg-panel hover:bg-elev rounded-xl p-4 lg:p-5 transition-colors"
      >
        <div className="relative mb-5 rounded-lg overflow-hidden shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)] aspect-square bg-panel-2">
          <Image
            src={p.cover}
            alt={`${p.title} cover`}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
            priority={i < 3}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              playFrom(p.id);
            }}
            className="absolute right-4 bottom-4 w-14 h-14 rounded-full bg-accent flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-[0_8px_18px_-4px_rgba(0,0,0,0.5)] hover:scale-[1.07]"
            aria-label={`Play ${p.title}`}
          >
            <PlayIcon className="w-6 h-6 fill-accent-ink" />
          </button>
          <div className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.14em] uppercase bg-accent text-accent-ink px-2 py-1 rounded-sm">
            Featured
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h3 className="font-display font-extrabold text-[22px] lg:text-[26px] tracking-[-0.015em] leading-tight truncate">
            {p.title}
          </h3>
          <span className="text-[11.5px] font-semibold tracking-[0.04em] uppercase text-muted-2 whitespace-nowrap">
            {p.year}
          </span>
        </div>
        <p className="text-[14px] text-muted leading-[1.55] line-clamp-2 mb-3">
          {p.blurb} — {p.client}
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          {p.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10.5px] font-semibold tracking-[0.04em] uppercase bg-elev-hi text-muted px-2 py-1 rounded-sm"
            >
              {tag}
            </span>
          ))}
          <span className="ml-auto text-[11.5px] font-semibold text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
            View case study
            <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </div>
  );
}
