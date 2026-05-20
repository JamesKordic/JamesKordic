'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PROJECTS, POPULAR, getProject, ARTIST } from '@/lib/projects';
import { usePlayer } from '@/lib/player-context';

export default function HomePage() {
  const { playFrom, shufflePlay } = usePlayer();

  return (
    <div className="relative">
      {/* HERO — display type breaks the canvas */}
      <section className="relative px-4 lg:px-8 pt-16 lg:pt-20 pb-12 lg:pb-20 overflow-hidden">
        {/* Marquee strip at top */}
        <div className="absolute top-12 left-0 right-0 overflow-hidden border-y border-ink/10 py-2 bg-coral text-paper">
          <div className="marquee-track font-mono text-[11px] tracking-[0.2em] uppercase">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-8 px-8 whitespace-nowrap">
                <span>● BROADCASTING FROM NYC</span>
                <span>● 9 PROJECTS IN ROTATION</span>
                <span>● TACO BELL / FX / MNRK HEAVY / THE SYNDICATE / COINDESK</span>
                <span>● AVAILABLE FOR FREELANCE Q3 2026</span>
                <span>● MOTION + BRAND + INTERACTIVE</span>
                <span>● BROADCASTING FROM NYC</span>
                <span>● ESTABLISHED 2024</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-16 lg:pt-20 grid lg:grid-cols-12 gap-6 lg:gap-8 items-end">
          {/* Big display name */}
          <div className="lg:col-span-8 relative">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-4">
              ARTIST · GRAPHIC + MOTION DESIGNER · EST. 2024
            </div>
            <h1 className="display-bleed font-display font-light leading-[0.85] tracking-[-0.04em] text-[80px] sm:text-[140px] lg:text-[200px] xl:text-[240px] text-ink">
              James
              <br />
              <span className="display-italic font-light text-coral">Kordic</span>
            </h1>
            <div className="mt-6 max-w-md text-[16px] leading-[1.55] text-ink-3">
              A graphic and motion designer based in New York. Building digital ads, social content,
              and motion for brands and the agencies that work with them.
            </div>
          </div>

          {/* Right column — featured "currently spinning" card */}
          <div className="lg:col-span-4">
            <CurrentlySpinning />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="px-4 lg:px-8">
        <div className="border-t border-ink/15 flex items-baseline justify-between py-3 font-mono text-[10px] tracking-[0.2em] uppercase">
          <span className="text-muted">SIDE A</span>
          <span className="text-muted">★</span>
          <span className="text-muted">POPULAR ROTATION</span>
        </div>
      </div>

      {/* POPULAR — asymmetric featured layout */}
      <section className="px-4 lg:px-8 pb-12">
        <h2 className="font-display font-light text-[44px] lg:text-[64px] tracking-[-0.03em] leading-none mb-2">
          Heaviest <span className="display-italic text-coral">rotation</span>
        </h2>
        <p className="text-muted text-[14px] mb-8 max-w-md">
          The five projects on heaviest rotation right now. Click any to dive into the full case
          study with all the assets.
        </p>

        <div className="space-y-2">
          {POPULAR.map((id, i) => {
            const p = getProject(id);
            if (!p) return null;
            return <RotationRow key={id} p={p} i={i} />;
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="px-4 lg:px-8">
        <div className="border-t border-ink/15 flex items-baseline justify-between py-3 font-mono text-[10px] tracking-[0.2em] uppercase">
          <span className="text-muted">SIDE B</span>
          <span className="text-muted">★</span>
          <span className="text-muted">FULL CATALOG · {PROJECTS.length} RELEASES</span>
        </div>
      </div>

      {/* CATALOG — asymmetric tile grid */}
      <section className="px-4 lg:px-8 pb-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display font-light text-[44px] lg:text-[64px] tracking-[-0.03em] leading-none">
            The <span className="display-italic text-coral">catalog</span>
          </h2>
          <Link href="/search" className="font-mono text-[11px] tracking-[0.15em] uppercase link-underline hidden sm:inline">
            Browse all →
          </Link>
        </div>

        <AsymmetricGrid />
      </section>

      {/* Bottom CTA */}
      <section className="px-4 lg:px-8 pb-16">
        <div className="bg-ink text-paper rounded-sm p-8 lg:p-16 relative overflow-hidden">
          <div className="absolute inset-0 halftone-lg text-paper opacity-[0.08]" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-end">
            <h3 className="font-display font-light text-[40px] lg:text-[80px] leading-[0.9] tracking-[-0.03em]">
              Want to make
              <br />
              <span className="display-italic text-coral">something?</span>
            </h3>
            <div>
              <p className="text-[15px] leading-[1.55] mb-6 max-w-md">
                Open for freelance and full-time. Music, entertainment, brands, anything that needs
                to move and feel.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:Jkordic@me.com"
                  className="bg-coral hover:bg-coral-deep text-paper font-mono text-[12px] tracking-[0.15em] uppercase px-5 py-3 transition-colors"
                >
                  Get in touch →
                </a>
                <Link
                  href="/about"
                  className="border border-paper hover:bg-paper hover:text-ink font-mono text-[12px] tracking-[0.15em] uppercase px-5 py-3 transition-colors"
                >
                  About / Signal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────── */

function CurrentlySpinning() {
  const featured = getProject(POPULAR[0]);
  if (!featured) return null;
  return (
    <Link
      href={`/work/${featured.id}`}
      className="block bg-ink text-paper p-4 lg:p-5 group relative overflow-hidden hover:bg-ink-2 transition-colors"
    >
      <div className="flex items-center justify-between mb-3 font-mono text-[10px] tracking-[0.2em] uppercase">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-coral rounded-full glow-coral animate-pulse" />
          FEATURED
        </span>
        <span className="text-muted-2">001</span>
      </div>
      <div className="relative aspect-[4/5] mb-4 overflow-hidden bg-paper-3">
        <Image
          src={featured.cover}
          alt={featured.title}
          fill
          sizes="(max-width:1024px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="font-display font-bold text-[24px] leading-[1.05] tracking-[-0.01em] mb-2">
        {featured.title}
      </div>
      <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted-2">
        {featured.client} · {featured.year}
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────── */

function RotationRow({ p, i }: { p: ReturnType<typeof getProject>; i: number }) {
  const { state } = usePlayer();
  if (!p) return null;
  const isCurrent = state.id === p.id;
  return (
    <Link
      href={`/work/${p.id}`}
      className={`group relative grid grid-cols-[40px_72px_1fr_auto] lg:grid-cols-[40px_88px_1fr_180px_80px] items-center gap-4 px-3 py-3 transition-all border-b border-ink/10 hover:bg-paper-2 stagger`}
      style={{ animationDelay: `${i * 70}ms` }}
    >
      {/* Number / play swap */}
      <div className="font-mono text-[12px] tabular-nums text-muted text-center relative h-6 flex items-center justify-center">
        <span className="absolute group-hover:opacity-0 transition-opacity">
          {String(i + 1).padStart(2, '0')}
        </span>
        <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity text-coral">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>

      {/* Cover */}
      <div className="aspect-[4/5] w-full overflow-hidden bg-paper-3 relative">
        <Image
          src={p.cover}
          alt=""
          fill
          sizes="88px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Title + client */}
      <div className="min-w-0">
        <div className={`font-display font-bold text-[20px] lg:text-[26px] tracking-[-0.01em] leading-tight truncate ${isCurrent ? 'text-coral' : 'group-hover:text-coral'} transition-colors`}>
          {p.title}
        </div>
        <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted mt-1 truncate">
          {p.client} · {p.role}
        </div>
      </div>

      {/* Tag */}
      <div className="hidden lg:block font-mono text-[11px] tracking-[0.1em] uppercase text-muted-2 truncate">
        {p.tags[0]}
      </div>

      {/* Year */}
      <div className="font-mono text-[11px] tabular-nums text-muted text-right">
        {p.year}
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────── */

/**
 * Asymmetric grid — projects with varied sizes and subtle tilts.
 * The first 4 are bigger/featured, the rest fill in normally.
 */
function AsymmetricGrid() {
  // Featured layout: first card spans 2 cols, next 3 are single. Then back to grid.
  const featured = PROJECTS.slice(0, 4);
  const rest = PROJECTS.slice(4);

  return (
    <>
      {/* Top featured block */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4 mb-3 lg:mb-4">
        <FeaturedCard p={featured[0]} className="col-span-2 lg:col-span-3" big driftClass="animate-drift-1" />
        <FeaturedCard p={featured[1]} className="col-span-1 lg:col-span-3" big driftClass="animate-drift-2" />
        <FeaturedCard p={featured[2]} className="col-span-1 lg:col-span-2" driftClass="animate-drift-3" />
        <FeaturedCard p={featured[3]} className="col-span-2 lg:col-span-2" driftClass="animate-drift-1" />
        {/* leave 2 cols of breathing room on lg */}
        <div className="hidden lg:flex lg:col-span-2 items-center justify-center font-mono text-[10px] tracking-[0.2em] uppercase text-muted writing-mode-vertical p-4">
          ↓ MORE BELOW ↓
        </div>
      </div>

      {/* Remaining catalog */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {rest.map((p, i) => (
          <FeaturedCard
            key={p.id}
            p={p}
            className="col-span-1"
            driftClass={i % 3 === 0 ? 'animate-drift-1' : i % 3 === 1 ? 'animate-drift-2' : 'animate-drift-3'}
          />
        ))}
      </div>
    </>
  );
}

function FeaturedCard({
  p,
  className,
  big,
  driftClass,
}: {
  p: ReturnType<typeof getProject>;
  className: string;
  big?: boolean;
  driftClass?: string;
}) {
  if (!p) return null;
  return (
    <Link
      href={`/work/${p.id}`}
      className={`group relative block tilt-card ${className} ${driftClass || ''}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-3">
        <Image
          src={p.cover}
          alt={p.title}
          fill
          sizes="(max-width:1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors duration-300" />
        {/* Top corner index */}
        <div className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.15em] uppercase text-paper opacity-0 group-hover:opacity-100 transition-opacity">
          {p.year}
        </div>
        {/* Bottom corner CTA */}
        <div className="absolute bottom-3 right-3 bg-coral text-paper font-mono text-[11px] tracking-[0.12em] uppercase px-3 py-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
          Play →
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className={`font-display font-bold tracking-[-0.01em] leading-tight ${big ? 'text-[22px] lg:text-[30px]' : 'text-[18px] lg:text-[20px]'}`}>
          {p.title}
        </h3>
        <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted whitespace-nowrap">
          {p.tags[0]}
        </span>
      </div>
    </Link>
  );
}
