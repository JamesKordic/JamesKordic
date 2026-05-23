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
  /** Optional path to a white-on-transparent logo image. When set, the
   *  logo replaces the text monogram. Used for projects where the brand
   *  has a strong mark of its own (e.g. Taco Bell's bell). */
  logoSrc?: string;
  /** Percentage of the tile the logo should occupy (0-1). Default 0.62.
   *  Lower values create more padding around the logo. */
  logoScale?: number;
};

/** Hand-tuned monogram per project. The mapping lives here (not in
 *  projects.ts) because it's purely a presentation concern of the
 *  library sidebar — it doesn't belong on the Project data model. */
const MONOGRAMS: Record<string, Monogram> = {
  'the-syndicate': {
    text: 'TS', // fallback / alt text only when logoSrc is set
    from: '#3c3a4a',
    to: '#8b5cf6',
    logoSrc: '/logos/the-syndicate.png',
    logoScale: 0.68,
  },
  wwimf: {
    text: 'WW',
    letterSpacing: '-0.04em',
    from: '#1d2f7a',
    to: '#22d3ee',
    logoSrc: '/logos/wwimf.png',
    logoScale: 0.78, // portrait hand mark — scale up so it doesn't read too thin
  },
  'taco-bell': {
    text: 'TB',
    from: '#7a2e8a',
    to: '#ff2d8a',
    logoSrc: '/logos/taco-bell.png',
    logoScale: 0.7,
  },
  'mnrk-heavy': {
    text: 'MH',
    from: '#7a0e0e',
    to: '#ffb84a',
    logoSrc: '/logos/mnrk-heavy.png',
    logoScale: 0.78, // 2:1 wide text logo — needs more horizontal presence
  },
  consensus: {
    text: 'CO',
    from: '#0e2e7a',
    to: '#22d3ee',
    logoSrc: '/logos/consensus.png',
    logoScale: 0.66, // CoinDesk "C" with dots — keep some breathing room
  },
  adults: {
    text: 'AF',
    from: '#7a1a14',
    to: '#ff2d8a',
    logoSrc: '/logos/adults.png',
    logoScale: 0.72, // FX rectangular mark — wider than tall
  },
  voltage: {
    text: 'VO',
    from: '#7a6a0e',
    to: '#c8f135',
    // Voltage's lime gradient is bright — switch to ink for contrast
    ink: '#10130a',
    logoSrc: '/logos/voltage.png',
    logoScale: 0.74, // black V trapezoid — distinctive, let it dominate
  },
  nike: {
    text: 'NK',
    from: '#7a2e14',
    to: '#ffb84a',
    logoSrc: '/logos/nike.png',
    logoScale: 0.82, // swoosh is ~3:1 wide — scale up so the stroke reads
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

  // When the project has a logo image, size it to occupy `logoScale`
  // fraction of the tile. Default 62% leaves a small even margin all around.
  const logoSize = Math.round(size * (m.logoScale ?? 0.62));

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
      {m.logoSrc ? (
        // White-on-transparent brand logo overlaid on the gradient tile.
        // Using a plain <img> instead of next/image because the logos live
        // in /public, are very small (~12KB), and we want guaranteed inline
        // rendering without the next/image fill-container constraints.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={m.logoSrc}
          alt=""
          className="relative pointer-events-none select-none"
          style={{
            // Constrain to a square box; the image's own aspect ratio is
            // preserved via `object-contain` so non-square logos (like
            // Taco Bell's slightly portrait bell) don't get squashed.
            width: logoSize,
            height: logoSize,
            objectFit: 'contain',
          }}
        />
      ) : (
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
      )}
    </div>
  );
}
