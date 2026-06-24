'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PROJECTS } from '@/lib/projects';
import { SITE_TEXT } from '@/lib/site-text';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const T = SITE_TEXT;

/**
 * Home — a Pentagram-style editorial index: a paper canvas with a sticky name
 * header, a single oversized intro line, a sticky discipline filter row, and a
 * bordered grid of project tiles. Each tile shows its title over the cover and
 * slides up a meta panel on hover, then links through to its case study.
 *
 * A curated set of disciplines (not the full tag list) keeps the filter bar to
 * a single tidy line while still surfacing every project under at least one.
 */
const FILTERS = [
  'All',
  'Creative Direction',
  'Motion Design',
  'Branding',
  'Marketing',
  'Interactive Design',
  'Concept Work',
];

export default function HomePage() {
  const [filter, setFilter] = useState('All');

  const shown = PROJECTS.filter(
    (p) => filter === 'All' || p.tags.includes(filter)
  );

  return (
    <div className="min-h-screen bg-bg text-text">
      <SiteHeader />

      {/* Intro line */}
      <section className="max-w-[1100px] border-b border-line px-6 pb-10 pt-16 sm:px-8">
        <h1 className="text-[clamp(28px,4.4vw,58px)] font-semibold leading-[1.06] tracking-[-0.025em]">
          {T.artist.name} is a graphic &amp; motion designer for music,
          entertainment, food and tech brands.{' '}
          <em className="not-italic text-muted">Selected work below.</em>
        </h1>
      </section>

      {/* Filter row */}
      <div className="sticky top-[59px] z-40 flex flex-wrap gap-x-5 gap-y-1.5 border-b border-line bg-bg px-6 py-[18px] text-[14px] font-medium sm:px-8">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`transition-colors ${
              filter === f ? 'text-text' : 'text-muted hover:text-text'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid — hairlines only between cells (no outer frame), like the
          reference. Right borders are toggled per breakpoint via nth-child. */}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <Link
            key={p.id}
            href={`/work/${p.id}`}
            className="group relative block aspect-[1/1.04] overflow-hidden border-b border-line
              sm:border-r sm:[&:nth-child(2n)]:border-r-0
              lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
          >
            {/* Cover */}
            <div className="absolute inset-0 bg-panel-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.cover}
                alt={p.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Title over the image — fades out on hover */}
            <div className="pointer-events-none absolute inset-x-5 bottom-[18px] transition-opacity duration-200 group-hover:opacity-0">
              <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.55)]">
                {p.title}
              </h3>
              <p className="mt-0.5 text-[13px] text-white/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.55)]">
                {p.blurb}
              </p>
            </div>

            {/* Meta panel — slides up on hover */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full border-t border-line bg-bg px-5 py-[18px] transition-transform duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
              <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-text">
                {p.title}
              </h3>
              <p className="mt-0.5 text-[13px] text-muted">{p.blurb}</p>
            </div>
          </Link>
        ))}
      </main>

      <SiteFooter />
    </div>
  );
}
