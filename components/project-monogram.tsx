'use client';

import type { Project } from '@/lib/projects';

/**
 * Per-project "logo" treatment — a monogram set on a gradient tile.
 * Used in the sidebar's "Your Library" list in place of the photographic
 * cover, because at 40px the photographic covers all look noisy and
 * similar, while these read instantly as distinct brand tiles.
 *
 * Each project gets:
 *  - A short monogram (1-3 chars) hand-tuned to read well at small sizes
 *  - A two-color gradient using the project's themeColor + a complementary
 *    accent from the design system (cyan, magenta, violet, amber, lime)
 *
 * NOT used elsewhere — the photographic cover still serves the rest of
 * the app (home page cards, project page hero, player bar, search).
 */

type Monogram = {
  /** Letters to render in the tile (kept short — 1, 2, or 3 chars). */
  text: string;
  /** Optional finer typographic tuning per project. Some monograms read
   *  better tighter (wide letters) or looser (narrow letters). */
  letterSpacing?: string;
  /** Top-left gradient color. */
  from: string;
  /** Bottom-right gradient color. */
  to: string;
  /** Text color override. Default is paper-cream — good for dark gradients. */
  ink?: string;
};

/** Hand-tuned monogram per project. The mapping lives here (not in
 *  projects.ts) because it's purely a presentation concern of the
 *  library sidebar — it doesn't belong on the Project data model. */
const MONOGRAMS: Record<string, Monogram> = {
  'the-syndicate': {
    text: 'TS',
    from: '#3c3a4a',
    to: '#8b5cf6',
  },
  wwimf: {
    text: 'WW',
    letterSpacing: '-0.04em',
    from: '#1d2f7a',
    to: '#22d3ee',
  },
  'taco-bell': {
    text: 'TB',
    from: '#7a2e8a',
    to: '#ff2d8a',
  },
  'mnrk-heavy': {
    text: 'MH',
    from: '#7a0e0e',
    to: '#ffb84a',
  },
  consensus: {
    text: 'CO',
    from: '#0e2e7a',
    to: '#22d3ee',
  },
  adults: {
    text: 'AF',
    from: '#7a1a14',
    to: '#ff2d8a',
  },
  voltage: {
    text: 'VO',
    from: '#7a6a0e',
    to: '#c8f135',
    // Voltage's lime gradient is bright — switch to ink for contrast
    ink: '#10130a',
  },
  nike: {
    text: 'NK',
    from: '#7a2e14',
    to: '#ffb84a',
  },
};

/** Fallback monogram for any project we haven't tuned by hand —
 *  uses the title's first two characters and a neutral gradient. */
function fallbackMonogram(p: Project): Monogram {
  return {
    text: p.title.replace(/^The\s+/i, '').slice(0, 2).toUpperCase(),
    from: p.themeColor,
    to: '#22d3ee',
  };
}

export function ProjectMonogram({
  p,
  size = 46,
}: {
  p: Project;
  /** Pixel size of the square tile. Default tuned for the sidebar
   *  library row, where covers used to be 46×46. */
  size?: number;
}) {
  const m = MONOGRAMS[p.id] || fallbackMonogram(p);

  // Letter size scales with the tile size — keep the monogram large
  // enough to dominate the tile, but with breathing room from the edge.
  const fontSize = Math.round(size * (m.text.length > 2 ? 0.38 : 0.46));

  return (
    <div
      className="rounded-[5px] flex-none flex items-center justify-center font-display font-extrabold relative overflow-hidden"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${m.from} 0%, ${m.to} 100%)`,
        color: m.ink || '#f3f1ec',
      }}
      aria-label={`${p.title} logo`}
    >
      {/* Subtle inner highlight to give the tile a sense of depth,
       *  like a small object catching light. Layered over the gradient. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.10) 100%)',
        }}
        aria-hidden
      />
      <span
        className="relative"
        style={{
          fontSize,
          lineHeight: 1,
          letterSpacing: m.letterSpacing || '-0.02em',
          // Slight optical adjustment — uppercase display letters tend to
          // look heavy at the baseline; a tiny upward shift balances them.
          transform: 'translateY(-1px)',
        }}
      >
        {m.text}
      </span>
    </div>
  );
}
