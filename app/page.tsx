'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PROJECTS } from '@/lib/projects';
import { SITE_TEXT } from '@/lib/site-text';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { HeroReel } from '@/components/hero-reel';

const T = SITE_TEXT;

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

      <div className="mx-auto max-w-[1200px]">
      {/* Editorial intro line */}
      <section className="px-6 pb-7 pt-[clamp(40px,8vw,88px)] sm:px-8">
        <h1 className="max-w-[16ch] text-[clamp(28px,5vw,52px)] font-bold leading-[1.08] tracking-[-0.025em]">
          {T.home.introHeadline}
        </h1>
        <p className="mt-[18px] max-w-[52ch] text-[clamp(15px,2vw,18px)] text-muted">
          {T.home.tagline} {T.about.availability.title}.
        </p>
      </section>

      {/* Featured hero reel */}
      <HeroReel />

      {/* Discipline filter row */}
      <div className="mt-14 flex flex-wrap gap-x-5 gap-y-2 border-t border-line px-6 pb-7 pt-7 text-[14px] font-medium sm:px-8">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`transition-colors ${
              filter === f ? 'text-accent' : 'text-muted hover:text-accent'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Work grid */}
      <main className="grid grid-cols-1 gap-x-6 gap-y-9 px-6 pb-24 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {shown.map((p) => (
          <Link key={p.id} href={`/work/${p.id}`} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-line bg-panel-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.cover}
                alt={p.title}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              {/* Blue hover ring — the reference's single interactive accent */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-md border-2 border-accent opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              />
            </div>

            <div className="mt-3.5 flex items-baseline justify-between gap-3">
              <span className="text-[15px] font-semibold transition-colors group-hover:text-accent">
                {p.title}
              </span>
              <span className="flex-none text-right text-[13px] text-muted">
                {p.tags.slice(0, 2).join(' · ')}
              </span>
            </div>
          </Link>
        ))}
      </main>
      </div>

      <SiteFooter />
    </div>
  );
}
