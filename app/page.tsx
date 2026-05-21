'use client';

import Link from 'next/link';
import { PROJECTS, POPULAR, getProject } from '@/lib/projects';
import { usePlayer } from '@/lib/player-context';
import { AlbumCard, FeaturedCard } from '@/components/album-card';
import { PlayIcon, ShuffleIcon, VerifiedIcon } from '@/components/icons';

export default function HomePage() {
  const { playFrom, shufflePlay } = usePlayer();

  // Featured row stays the same — first 3 from POPULAR
  const featured = POPULAR.slice(0, 3)
    .map((id) => getProject(id))
    .filter((p): p is NonNullable<ReturnType<typeof getProject>> => !!p);

  // Split catalog into Side A (professional) and Side B (personal)
  const sideA = PROJECTS.filter((p) => p.kind === 'professional');
  const sideB = PROJECTS.filter((p) => p.kind === 'personal');

  return (
    <div>
      {/* COMPACT ARTIST STRIP */}
      <header
        className="relative px-5 lg:px-8 pt-20 pb-6 flex items-end"
        style={{
          background:
            'radial-gradient(120% 150% at 12% 0%, rgba(200,241,53,0.22), transparent 55%), linear-gradient(180deg,#3b3d2e 0%, #1a1a1d 78%)',
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 w-full">
          <div>
            <div className="flex items-center gap-2 text-[12px] font-semibold mb-2">
              <VerifiedIcon className="w-[18px] h-[18px]" />
              <span>Verified Designer</span>
            </div>
            <h1 className="font-display font-extrabold leading-[0.95] tracking-[-0.03em] text-[44px] sm:text-[64px] lg:text-[80px]">
              James <em className="not-italic text-accent">Kordic</em>
            </h1>
            <p className="text-[14px] text-muted mt-2 max-w-md">
              New York-based Graphic & Motion Designer · {PROJECTS.length} projects · Work for Taco Bell, FX, MNRK Heavy, The Syndicate
            </p>
          </div>

          <div className="flex items-center gap-4 flex-none">
            <button
              onClick={() => playFrom(POPULAR[0])}
              className="w-[52px] h-[52px] rounded-full bg-accent flex items-center justify-center flex-none shadow-[0_8px_24px_-6px_rgba(200,241,53,0.5)] hover:scale-[1.06] active:scale-[0.96] transition-transform"
              aria-label="Play"
            >
              <PlayIcon className="w-[22px] h-[22px] fill-accent-ink" />
            </button>
            <button
              onClick={shufflePlay}
              className="text-muted hover:text-text hover:scale-[1.08] transition-all"
              aria-label="Shuffle"
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
            Featured work
          </h2>
          <Link
            href="/search"
            className="text-[11.5px] font-bold tracking-[0.07em] uppercase text-muted hover:text-text hover:underline transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {featured.map((p, i) => (
            <FeaturedCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </section>

      {/* SIDE A — PROFESSIONAL CLIENT WORK */}
      <CatalogSide
        label="Side A"
        title="Professional client work"
        sub="Commissioned work for music, entertainment, food, and tech brands."
        projects={sideA}
      />

      {/* SIDE B — PERSONAL WORK */}
      <CatalogSide
        label="Side B"
        title="Personal work"
        sub="Concepts, capstones, and self-initiated explorations."
        projects={sideB}
      />

      {/* Closing strip */}
      <section className="px-5 lg:px-8 pt-12 pb-12">
        <Link
          href="/about"
          className="block bg-panel hover:bg-elev rounded-xl p-6 lg:p-8 transition-colors"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-display font-extrabold text-[22px] lg:text-[26px] tracking-[-0.02em] mb-1">
                Want to make something?
              </h3>
              <p className="text-[14px] text-muted">
                Available for freelance and full-time. Drop a line.
              </p>
            </div>
            <span className="font-bold text-[13px] tracking-[0.04em] uppercase text-accent flex items-center gap-2">
              Get in touch <span aria-hidden>→</span>
            </span>
          </div>
        </Link>
      </section>
    </div>
  );
}

/**
 * Catalog "side" — A or B. Mimics the visual rhythm of a vinyl record:
 * a small tag label ("Side A"), a real heading, and the grid below.
 */
function CatalogSide({
  label,
  title,
  sub,
  projects,
}: {
  label: string;
  title: string;
  sub: string;
  projects: typeof PROJECTS;
}) {
  return (
    <section className="px-5 lg:px-8 pt-10 pb-4">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase bg-accent text-accent-ink px-2 py-1 rounded-sm">
              {label}
            </span>
            <span className="text-[10.5px] font-bold tracking-[0.07em] uppercase text-muted-2">
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
        {projects.map((p, i) => (
          <AlbumCard key={p.id} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}
