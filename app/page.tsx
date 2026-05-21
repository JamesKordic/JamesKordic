'use client';

import Link from 'next/link';
import { PROJECTS, POPULAR, getProject } from '@/lib/projects';
import { usePlayer } from '@/lib/player-context';
import { AlbumCard, FeaturedCard } from '@/components/album-card';
import { PlayIcon, ShuffleIcon, VerifiedIcon } from '@/components/icons';

export default function HomePage() {
  const { playFrom, shufflePlay } = usePlayer();

  // The 3 projects we want above the fold as the showcase
  const featured = POPULAR.slice(0, 3)
    .map((id) => getProject(id))
    .filter((p): p is NonNullable<ReturnType<typeof getProject>> => !!p);

  return (
    <div>
      {/* COMPACT ARTIST STRIP — about 1/3 the height of the old hero */}
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

          {/* Action buttons — moved into the artist strip to save vertical space */}
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

      {/* FEATURED PROJECTS — 3 large thumbnails with full info, above the fold */}
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

      {/* CATALOG — every other project as a bigger card */}
      <section className="px-5 lg:px-8 pt-10 pb-4">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display font-extrabold text-[22px] lg:text-[26px] tracking-[-0.02em]">
            Full catalog
          </h2>
          <span className="text-[11.5px] font-bold tracking-[0.07em] uppercase text-muted-2">
            {PROJECTS.length} releases
          </span>
        </div>
        <p className="text-[13px] text-muted mb-5 max-w-xl">
          Click any cover for the full case study with all the images, videos, and process work.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
          {PROJECTS.map((p, i) => (
            <AlbumCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </section>

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
