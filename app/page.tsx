'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PROJECTS, disciplineColor } from '@/lib/projects';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { HeroReel } from '@/components/hero-reel';

// Curated discipline filters — one tidy row, covering every project.
const FILTERS = [
  'All',
  'Creative Direction',
  'Motion Design',
  'Branding',
  'Marketing',
  'Interactive Design',
  'Concept Work',
];

/**
 * Home — a Pentagram-style work feed: pure black-on-white, a grid of project
 * images each captioned below with a bold title, a one-line description, and
 * small colour-coded discipline tags. Colour lives only in those tags; the
 * rest of the page is ink on paper.
 */
export default function HomePage() {
  const [filter, setFilter] = useState('All');

  const shown = PROJECTS.filter(
    (p) => filter === 'All' || p.tags.includes(filter)
  );

  return (
    <div className="min-h-screen bg-bg text-text">
      <SiteHeader />

      {/* Featured hero reel */}
      <HeroReel />

      {/* Discipline filter row */}
      <div className="mt-14 flex flex-wrap gap-x-5 gap-y-2 border-t border-line px-6 pb-7 pt-7 text-[14px] font-medium sm:px-8">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`underline-offset-[3px] transition-colors ${
              filter === f
                ? 'text-text underline'
                : 'text-muted hover:text-text'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Work grid */}
      <main className="grid grid-cols-1 gap-x-6 gap-y-12 px-6 pb-24 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {shown.map((p) => (
          <Link key={p.id} href={`/work/${p.id}`} className="group block">
            <div className="aspect-[4/3] overflow-hidden bg-panel-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.cover}
                alt={p.title}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </div>

            <h3 className="mt-4 text-[19px] font-bold leading-[1.2] tracking-[-0.01em] underline-offset-2 group-hover:underline">
              {p.title}
            </h3>
            <p className="mt-1 text-[14px] leading-[1.35] text-muted">
              {p.blurb}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 text-[13px] text-text"
                >
                  <span
                    className="h-[9px] w-[9px] flex-none"
                    style={{ background: disciplineColor(t) }}
                    aria-hidden
                  />
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </main>

      <SiteFooter />
    </div>
  );
}
