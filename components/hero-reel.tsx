'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PROJECTS, POPULAR } from '@/lib/projects';

// Featured set for the reel, in POPULAR order.
const FEATURED = POPULAR.map((id) => PROJECTS.find((p) => p.id === id)).filter(
  Boolean
) as (typeof PROJECTS)[number][];

const INTERVAL = 5000;

/**
 * Pentagram-style hero reel: a large, full-width crossfading showcase of the
 * featured projects that sits above the work grid. The big image (or looping
 * cover video) carries the motion; the caption beneath it — title, one-line
 * description, colour-coded discipline tags — updates with the active slide.
 * Auto-advances, pauses on hover, and can be driven by the progress bars.
 */
export function HeroReel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance. Including `active` in the deps resets the timer after a
  // manual jump, so a clicked slide still gets its full dwell. Honors
  // reduced-motion by simply not cycling.
  useEffect(() => {
    if (paused) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const id = setInterval(
      () => setActive((a) => (a + 1) % FEATURED.length),
      INTERVAL
    );
    return () => clearInterval(id);
  }, [paused, active]);

  if (FEATURED.length === 0) return null;
  const cur = FEATURED[active];

  return (
    <section
      className="px-6 pt-6 sm:px-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Stage */}
      <Link
        href={`/work/${cur.id}`}
        className="group relative block h-[clamp(240px,34vw,420px)] w-full overflow-hidden rounded-md border border-line bg-panel-2"
      >
        {FEATURED.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={p.id}
            src={p.cover}
            alt={p.title}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        {cur.coverVideo && (
          <video
            key={cur.id}
            src={cur.coverVideo}
            poster={cur.cover}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </Link>

      {/* Caption + progress */}
      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div key={cur.id} className="animate-fadein max-w-[680px]">
          <div className="mb-2 text-[12px] uppercase tracking-[0.09em] text-muted">
            Featured · {String(active + 1).padStart(2, '0')} /{' '}
            {String(FEATURED.length).padStart(2, '0')}
          </div>
          <Link href={`/work/${cur.id}`} className="group inline-block">
            <h2 className="text-[clamp(26px,3.6vw,46px)] font-bold leading-[1.04] tracking-[-0.02em] transition-colors group-hover:text-accent">
              {cur.title}
            </h2>
          </Link>
          <p className="mt-2 text-[15px] leading-[1.4] text-muted">
            {cur.blurb}
          </p>
          <div className="mt-3 text-[13px] text-muted">
            {cur.tags.join(' · ')}
          </div>
        </div>

        {/* Progress bars */}
        <div className="flex items-center gap-2">
          {FEATURED.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(i)}
              aria-label={`Show ${p.title}`}
              className="group py-2"
            >
              <span
                className={`block h-[3px] w-9 transition-colors ${
                  i === active ? 'bg-accent' : 'bg-line group-hover:bg-muted'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
