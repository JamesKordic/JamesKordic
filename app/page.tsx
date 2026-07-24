'use client';

import Link from 'next/link';
import { PROJECTS } from '@/lib/projects';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

/** Tagline words for the staggered mask reveal — the four industries pop
 *  in the accent color. */
const ACCENT_WORDS = new Set(['music,', 'entertainment,', 'food', 'tech']);
const TAGLINE_WORDS =
  'Is a graphic & motion designer for music, entertainment, food and tech brands.'
    .split(' ')
    .map((t) => ({ t, cls: ACCENT_WORDS.has(t) ? 'text-accent' : undefined }));

/**
 * Home — a bold typographic hero: an oversized "James Kordic." wordmark that
 * fills the width and rises in, with the tagline beneath it, then a
 * Pentagram-style editorial grid of project tiles.
 */
export default function HomePage() {
  const shown = PROJECTS;

  return (
    <div className="min-h-screen bg-bg text-text">
      <SiteHeader />

      {/* Hero — giant wordmark, then the tagline */}
      <section className="overflow-hidden border-b border-line px-6 pt-6 pb-9 sm:px-8 sm:pt-8">
        {/* Oversized wordmark — full-bleed (breaks out of the section
            padding) and clipped so it can rise in from below. Sized in vw so
            it spans edge to edge on one line at any breakpoint. */}
        <div className="overflow-hidden pb-[0.08em] pt-[0.05em] [container-type:inline-size]">
          <div
            aria-hidden
            className="bigmark whitespace-nowrap text-left font-display font-extrabold leading-[0.82] tracking-[-0.05em] text-[15.3cqw]"
          >
            {'James Kordic.'.split('').map((ch, i) => (
              <span
                key={i}
                className={`inline-block cursor-default transition-all duration-200 ease-out hover:-skew-x-6 hover:[-webkit-text-stroke:0.025em_currentColor]${
                  ch === '.' ? ' text-accent' : ''
                }`}
              >
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </div>
        </div>

        {/* Tagline — reads on from the wordmark. From lg up it's sized in cqw
            so it spans the same edge-to-edge measure on one line; below that
            it falls back to a wrapping clamp so it stays legible. */}
        <div className="mt-7 sm:mt-9 [container-type:inline-size]">
          <h1 className="max-w-[900px] font-display font-semibold text-[clamp(22px,2.8vw,40px)] leading-[1.1] tracking-[-0.02em] lg:max-w-none lg:whitespace-nowrap lg:text-[2.74cqw]">
            {TAGLINE_WORDS.map((w, i) => (
              <span key={i}>
                <span className="word-reveal">
                  <span
                    className={w.cls}
                    style={{ animationDelay: `${350 + i * 30}ms` }}
                  >
                    {w.t}
                  </span>
                </span>{' '}
              </span>
            ))}
          </h1>
        </div>
      </section>

      {/* Grid — hairlines only between cells (no outer frame), like the
          reference. Right borders are toggled per breakpoint via nth-child. */}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <Link
            key={p.id}
            href={`/work/${p.id}`}
            className="stagger group relative block sm:aspect-[1/1.04] sm:overflow-hidden"
            style={{ animationDelay: `${300 + i * 55}ms` }}
          >
            {/* Cover — video when one is provided, otherwise the still image.
                Normal-flow block on mobile; fills the tile from sm up. */}
            <div className="relative aspect-[1/1.04] transform-gpu overflow-hidden bg-panel-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:absolute sm:inset-0 sm:aspect-auto sm:scale-[1.02] sm:group-hover:scale-[1.06]">
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

            {/* Meta panel — sits below the image on mobile; slides up from the bottom on hover from sm up */}
            <div className="relative border-t border-line bg-bg px-5 py-[18px] sm:absolute sm:inset-x-0 sm:bottom-0 sm:translate-y-full sm:transition-transform sm:duration-[350ms] sm:ease-[cubic-bezier(0.16,1,0.3,1)] sm:group-hover:translate-y-0">
              <h3 className="font-display text-[18px] tracking-[-0.3px] text-text">
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
