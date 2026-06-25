'use client';

import Link from 'next/link';
import { PROJECTS } from '@/lib/projects';
import { SITE_TEXT } from '@/lib/site-text';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const T = SITE_TEXT;

/**
 * Home — a Pentagram-style editorial index: a paper canvas with a sticky name
 * header, a single oversized intro line, and a bordered grid of project tiles.
 * Each tile shows its cover and slides up a meta panel on hover, then links
 * through to its case study.
 */
export default function HomePage() {
  const shown = PROJECTS;

  return (
    <div className="min-h-screen bg-bg text-text">
      <SiteHeader />

      {/* Intro line — full-width hairline, content capped at 1100px.
          Equal top/bottom padding centers the headline between the hairlines. */}
      <section className="border-b border-line px-6 py-14 sm:px-8">
        <h1 className="max-w-[1100px] text-[clamp(28px,4.4vw,58px)] font-semibold leading-[1.06] tracking-[-0.025em]">
          {T.artist.name} is a graphic &amp; motion designer for music,
          entertainment, food and tech brands.{' '}
          <em className="not-italic text-muted">Selected work below.</em>
        </h1>
      </section>

      {/* Spacer row — keeps the filter-bar height and full-width hairline
          even though the filters themselves were removed. */}
      <div className="sticky top-[59px] z-40 border-b border-line bg-bg px-6 py-[18px] text-[14px] font-medium sm:px-8">
        <span aria-hidden className="invisible">&nbsp;</span>
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
            {/* Cover — video when one is provided, otherwise the still image */}
            <div className="absolute inset-0 bg-panel-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
              {p.coverVideo ? (
                <video
                  src={p.coverVideo}
                  poster={p.cover}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.cover}
                  alt={p.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* Meta panel — shown by default on mobile; slides up on hover from sm up */}
            <div className="absolute inset-x-0 bottom-0 translate-y-0 border-t border-line bg-bg px-5 py-[18px] transition-transform duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:translate-y-full group-hover:translate-y-0">
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
