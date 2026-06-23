'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/lib/projects';

/**
 * Editorial work card — a hero image with a year pill and category tag
 * overlaid, then the title (with a hover arrow) and a short blurb beneath.
 * `feature` makes the card span the full grid width with a wider hero.
 */
export function WorkCard({
  p,
  i = 0,
  feature = false,
}: {
  p: Project;
  i?: number;
  feature?: boolean;
}) {
  return (
    <Link
      href={`/work/${p.id}`}
      className={`stagger group block ${feature ? 'col-span-full' : ''}`}
      style={{ animationDelay: `${i * 70}ms` }}
    >
      <div
        className={`relative overflow-hidden rounded-[10px] bg-panel-2 ${
          feature ? 'aspect-[21/9]' : 'aspect-[4/3]'
        }`}
      >
        <Image
          src={p.cover}
          alt={`${p.title} cover`}
          fill
          sizes={feature ? '(max-width:768px) 100vw, 70vw' : '(max-width:768px) 100vw, 35vw'}
          priority={i < 2}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        {p.coverVideo && (
          <video
            src={p.coverVideo}
            poster={p.cover}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        )}

        {/* Year pill */}
        <span className="absolute top-3 right-3.5 z-[2] text-[12px] font-semibold tracking-[0.5px] text-white bg-[rgba(20,19,15,0.55)] backdrop-blur-[4px] rounded-full px-2.5 py-1">
          {p.year}
        </span>

        {/* Category tag */}
        <span className="absolute left-3.5 bottom-3.5 z-[2] text-[11px] uppercase tracking-[1.5px] text-white bg-[rgba(20,19,15,0.45)] backdrop-blur-[4px] rounded-full px-3 py-[5px]">
          {p.tags[0]}
        </span>
      </div>

      <div className="flex items-baseline justify-between gap-3.5 mt-4">
        <div className="min-w-0">
          <h3
            className={`font-display font-medium tracking-[-0.3px] transition-colors group-hover:text-accent ${
              feature ? 'text-[clamp(26px,3vw,38px)]' : 'text-[clamp(20px,2.2vw,26px)]'
            }`}
          >
            {p.title}
          </h3>
          <p className="text-[14px] text-muted mt-0.5">{p.blurb}</p>
        </div>
        <span className="text-[16px] text-muted transition-all group-hover:text-accent group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">
          ↗
        </span>
      </div>
    </Link>
  );
}
