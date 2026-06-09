'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PROJECTS, POPULAR, getProject } from '@/lib/projects';
import { usePlayer } from '@/lib/player-context';
import { AlbumCard, FeaturedCard, ComingSoonCard } from '@/components/album-card';
import { PlayIcon, ShuffleIcon, VerifiedIcon } from '@/components/icons';
import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

export default function HomePage() {
  const router = useRouter();
  const { playFrom } = usePlayer();

  // Featured row stays the same — first 3 from POPULAR
  const featured = POPULAR.slice(0, 3)
    .map((id) => getProject(id))
    .filter((p): p is NonNullable<ReturnType<typeof getProject>> => !!p);

  // Split catalog into Side A (professional) and Side B (personal)
  const sideA = PROJECTS.filter((p) => p.kind === 'professional');
  const sideB = PROJECTS.filter((p) => p.kind === 'personal');

  // Click handlers — these update the player AND navigate to the project page
  const goToProject = (id: string) => {
    playFrom(id);
    router.push(`/work/${id}`);
  };
  const goToRandomProject = () => {
    const random = PROJECTS[Math.floor(Math.random() * PROJECTS.length)];
    goToProject(random.id);
  };

  return (
    <div>
      {/* COMPACT ARTIST STRIP */}
      <header className="relative px-5 lg:px-8 pt-20 pb-6 flex items-end overflow-hidden bg-bg">
        {/* Animated mesh gradient backdrop */}
        <div className="mesh-bg" aria-hidden>
          <span className="blob" />
        </div>
        {/* Subtle dark vignette on top so text stays readable */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,8,12,0.55) 0%, rgba(8,8,12,0.3) 50%, rgba(8,8,12,0.85) 100%)',
          }}
          aria-hidden
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 w-full">
          <div>
            <div className="flex items-center gap-2 text-[12px] font-semibold mb-2">
              <VerifiedIcon className="w-[18px] h-[18px]" />
              <span>{T.artist.verifiedLabel}</span>
            </div>
            <h1 className="font-display font-extrabold leading-[0.95] tracking-[-0.03em] text-[44px] sm:text-[64px] lg:text-[80px]">
              {T.artist.firstName}{' '}
              <em className="not-italic gradient-text">{T.artist.lastName}</em>
            </h1>
          </div>

          <div className="flex items-center gap-4 flex-none">
            <button
              onClick={() => goToProject(POPULAR[0])}
              className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-accent via-cyan to-magenta flex items-center justify-center flex-none shadow-[0_8px_24px_-6px_rgba(200,241,53,0.5)] hover:scale-[1.06] active:scale-[0.96] transition-transform"
              aria-label="Play featured project"
            >
              <PlayIcon className="w-[22px] h-[22px] fill-accent-ink" />
            </button>
            <button
              onClick={goToRandomProject}
              className="text-muted hover:text-text hover:scale-[1.08] transition-all"
              aria-label="Shuffle to a random project"
            >
              <ShuffleIcon className="w-7 h-7" />
            </button>
            <Link
              href="/about"
              className="font-bold text-[12px] tracking-[0.05em] uppercase border-[1.5px] border-[#5a5a5e] hover:border-text rounded-[30px] px-4 py-2 transition-all"
            >
              About
            </Link>
          </div>
        </div>
      </header>

      {/* FEATURED WORK */}
      <section className="px-5 lg:px-8 pt-6 pb-2">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display font-extrabold text-[22px] lg:text-[26px] tracking-[-0.02em]">
            {T.home.featuredHeading}
          </h2>
          <Link
            href="/search"
            className="text-[11.5px] font-bold tracking-[0.07em] uppercase text-muted hover:text-text hover:underline transition-colors"
          >
            {T.home.viewAllLink}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {featured.map((p, i) => (
            <FeaturedCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </section>

      {/* SIDE A — PROFESSIONAL CLIENT WORK
       *  extraCards prepends a Coming Soon placeholder card to the
       *  front of the grid (sits before The Syndicate). It's not a
       *  real project (not in PROJECTS), so it doesn't appear in
       *  featured, the sidebar library, search, or the player bar —
       *  only here. */}
      <CatalogSide
        label={T.home.sideALabel}
        title={T.home.sideAHeading}
        sub={T.home.sideASubheading}
        projects={sideA}
        theme="magenta"
        extraCards={<ComingSoonCard i={0} />}
      />

      {/* SIDE B — PERSONAL WORK */}
      <CatalogSide
        label={T.home.sideBLabel}
        title={T.home.sideBHeading}
        sub={T.home.sideBSubheading}
        projects={sideB}
        theme="cyan"
      />

      {/* CALL TO ACTION — full-energy panel that pops out of the page */}
      <section className="px-5 lg:px-8 pt-14 pb-12">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Multi-color gradient base — slowly drifting */}
          <div
            className="absolute inset-0 animate-gradient-drift"
            style={{
              background:
                'linear-gradient(120deg, #c8f135 0%, #22d3ee 35%, #8b5cf6 65%, #ff2d8a 100%)',
              backgroundSize: '200% 200%',
            }}
            aria-hidden
          />

          {/* Layered radial highlights for depth */}
          <div
            className="absolute -top-32 -right-20 w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)',
            }}
            aria-hidden
          />
          <div
            className="absolute -bottom-32 -left-20 w-[380px] h-[380px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(255,184,74,0.4) 0%, transparent 70%)',
            }}
            aria-hidden
          />

          {/* Background equalizer pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.10]" aria-hidden>
            <div className="absolute inset-0 flex items-end justify-around gap-1 px-4">
              {Array.from({ length: 32 }).map((_, i) => (
                <span
                  key={i}
                  className="flex-1 bg-accent-ink"
                  style={{
                    height: `${30 + ((i * 37) % 70)}%`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="relative text-accent-ink px-6 py-10 lg:px-12 lg:py-14">
            {/* Availability status pill — dark chip with white text + cyan
             *  pulsing dot. Switched away from lime text/dot so the pill
             *  doesn't read as solid green against the gradient backdrop. */}
            <div className="inline-flex items-center gap-2 bg-accent-ink text-text font-bold text-[11px] tracking-[0.14em] uppercase px-3 py-1.5 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan" />
              </span>
              {T.home.cta.availability}
            </div>

            {/* Headline */}
            <h2 className="font-display font-extrabold tracking-[-0.035em] leading-[0.92] text-[44px] sm:text-[64px] lg:text-[88px] mb-3 max-w-3xl">
              {T.home.cta.headlinePrefix}{' '}
              <em className="not-italic underline decoration-[6px] underline-offset-[6px]">
                {T.home.cta.headlineEmphasis}
              </em>
            </h2>

            {/* Subhead */}
            <p className="text-[15px] lg:text-[17px] font-medium leading-[1.5] max-w-xl mb-8 opacity-90">
              {T.home.cta.subhead}
            </p>

            {/* Primary + secondary actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              {/* Primary email button — dark chip with WHITE email text
               *  (was lime). The gradient arrow circle on the right stays
               *  the focal accent. */}
              <a
                href={`mailto:${T.contact.email}`}
                className="group inline-flex items-center justify-between gap-4 bg-accent-ink text-text rounded-full pl-6 pr-3 py-3 font-bold text-[15px] hover:scale-[1.03] active:scale-[0.97] transition-transform shadow-[0_8px_24px_-6px_rgba(0,0,0,0.4)]"
              >
                <span className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <rect x="3" y="5" width="18" height="14" rx="2.5" />
                    <path d="m3.5 7 8.5 6 8.5-6" strokeLinecap="round" />
                  </svg>
                  {T.home.cta.emailButton}
                </span>
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-accent via-cyan to-magenta text-accent-ink flex items-center justify-center font-bold text-[18px] group-hover:rotate-[-12deg] transition-transform">
                  →
                </span>
              </a>

              {/* Secondary outlined button — hover state now fills with
               *  white text on dark bg (was lime text). */}
              <a
                href={T.contact.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 border-2 border-accent-ink text-accent-ink font-bold text-[14px] tracking-[0.02em] rounded-full px-5 py-3 hover:bg-accent-ink hover:text-text transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {T.home.cta.resumeButton}
              </a>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-bold text-[13px] tracking-[0.05em] uppercase text-accent-ink hover:opacity-70 transition-opacity sm:ml-auto"
              >
                {T.home.cta.aboutLink}
                <span aria-hidden>→</span>
              </Link>
            </div>

            {/* Bottom row — quick stats / social */}
            <div className="mt-10 pt-6 border-t border-accent-ink/20 flex flex-wrap items-center gap-x-8 gap-y-3 text-[12px] font-semibold">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-ink" />
                Based in New York
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-ink" />
                Replies within 24 hours
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-ink" />
                Remote · onsite · hybrid
              </span>
              <div className="sm:ml-auto flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/in/jameskordic/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-60 transition-opacity"
                  aria-label="LinkedIn"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M4.5 3.5A2 2 0 1 1 4.5 7a2 2 0 0 1 0-3.5ZM3 9h3v12H3zm6 0h3v1.7c.6-1 1.9-2 3.8-2 3 0 4.2 2 4.2 5.2V21h-3v-6.4c0-1.6-.6-2.6-2-2.6s-2.3 1-2.3 2.6V21H9z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/jameskordic/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-60 transition-opacity"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Catalog "side" — A or B. Mimics the visual rhythm of a vinyl record:
 * a small tag label ("Side A"), a real heading, and the grid below.
 * The theme prop tints the side label with a colored gradient.
 */
function CatalogSide({
  label,
  title,
  sub,
  projects,
  theme,
  extraCards,
}: {
  label: string;
  title: string;
  sub: string;
  projects: typeof PROJECTS;
  theme: 'magenta' | 'cyan';
  /** Optional non-project content rendered AFTER all AlbumCards in the
   *  grid — used to inject placeholder cards like "Coming Soon (under
   *  NDA)" that aren't real catalog entries but should occupy a slot in
   *  the visual rhythm of the row. */
  extraCards?: React.ReactNode;
}) {
  const chipGradient =
    theme === 'magenta'
      ? 'bg-gradient-to-r from-magenta via-amber to-accent'
      : 'bg-gradient-to-r from-cyan via-violet to-magenta';

  const dotColor = theme === 'magenta' ? 'bg-magenta' : 'bg-cyan';

  return (
    <section className="px-5 lg:px-8 pt-10 pb-4">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`text-[10px] font-bold tracking-[0.18em] uppercase text-accent-ink px-2.5 py-1 rounded-sm ${chipGradient}`}
            >
              {label}
            </span>
            <span className="flex items-center gap-1.5 text-[10.5px] font-bold tracking-[0.07em] uppercase text-muted-2">
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
              {projects.length} {projects.length === 1 ? 'release' : 'releases'}
            </span>
          </div>
          <h2 className="font-display font-extrabold text-[22px] lg:text-[26px] tracking-[-0.02em]">
            {title}
          </h2>
          <p className="text-[13px] text-muted mt-1 max-w-xl">{sub}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
        {/* extraCards renders BEFORE the catalog so a "Coming Soon" or
         *  similar placeholder leads the row instead of trailing it.
         *  When present, real project cards bump their stagger index by
         *  one so animations cascade from the extra card → projects in
         *  visual order. */}
        {extraCards}
        {projects.map((p, i) => (
          <AlbumCard key={p.id} p={p} i={extraCards ? i + 1 : i} />
        ))}
      </div>
    </section>
  );
}
