'use client';

import Link from 'next/link';
import { PROJECTS, POPULAR, getProject, ARTIST } from '@/lib/projects';
import { usePlayer } from '@/lib/player-context';
import { AlbumCard } from '@/components/album-card';
import { TrackRow } from '@/components/track-row';
import { PlayIcon, ShuffleIcon, VerifiedIcon } from '@/components/icons';

export default function HomePage() {
  const { playFrom, shufflePlay } = usePlayer();

  return (
    <div>
      {/* Hero */}
      <header
        className="relative min-h-[380px] px-5 lg:px-8 pb-[26px] flex flex-col justify-end"
        style={{
          background:
            'radial-gradient(120% 150% at 12% 0%, rgba(200,241,53,0.22), transparent 55%), linear-gradient(180deg,#3b3d2e 0%, #1a1a1d 78%)',
        }}
      >
        <div className="flex items-center gap-2 mt-[84px] text-[13px] font-semibold">
          <VerifiedIcon className="w-[21px] h-[21px]" />
          <span>Verified Designer</span>
        </div>
        <h1 className="font-display font-extrabold leading-[0.92] tracking-[-0.035em] my-[14px] mt-[14px] mb-[18px] text-[48px] sm:text-[72px] lg:text-[116px]">
          James <em className="not-italic text-accent">Kordic</em>
        </h1>
        <div className="flex items-center gap-2 flex-wrap text-[13.5px] font-medium">
          <span>New York–based Graphic & Motion Designer</span>
          <span className="w-1 h-1 rounded-full bg-muted inline-block" />
          <span className="text-muted">{PROJECTS.length} projects in rotation</span>
        </div>
      </header>

      {/* Action bar */}
      <div className="flex items-center gap-6 px-5 lg:px-8 pt-6 pb-2">
        <button
          onClick={() => playFrom(POPULAR[0])}
          className="w-[58px] h-[58px] rounded-full bg-accent flex items-center justify-center flex-none shadow-[0_8px_24px_-6px_rgba(200,241,53,0.5)] hover:scale-[1.06] active:scale-[0.96] transition-transform"
          aria-label="Play"
        >
          <PlayIcon className="w-[25px] h-[25px] fill-accent-ink" />
        </button>
        <button
          onClick={shufflePlay}
          className="text-muted hover:text-text hover:scale-[1.08] transition-all"
          aria-label="Shuffle"
        >
          <ShuffleIcon className="w-[30px] h-[30px]" />
        </button>
        <Link
          href="/about"
          className="font-bold text-[13px] tracking-[0.04em] uppercase border-[1.5px] border-[#5a5a5e] hover:border-text rounded-[30px] px-[18px] py-[9px] hover:scale-[1.04] transition-all"
        >
          Follow
        </Link>
      </div>

      {/* Popular */}
      <section className="px-5 lg:px-8 pt-[30px] pb-[6px]">
        <div className="flex items-baseline justify-between mb-[6px]">
          <h2 className="font-display font-extrabold text-[25px] tracking-[-0.02em]">Popular</h2>
        </div>
        <p className="text-[13px] text-muted mb-[14px]">
          The projects on heaviest rotation — click any row to open the full case study.
        </p>
        <div className="mt-[6px]">
          {POPULAR.map((id, i) => {
            const p = getProject(id);
            if (!p) return null;
            return <TrackRow key={id} p={p} i={i} />;
          })}
        </div>
      </section>

      {/* Discography */}
      <section className="px-5 lg:px-8 pt-[30px] pb-[6px]">
        <div className="flex items-baseline justify-between mb-[6px]">
          <h2 className="font-display font-extrabold text-[25px] tracking-[-0.02em]">
            Discography
          </h2>
          <Link
            href="/search"
            className="text-[12px] font-bold tracking-[0.07em] uppercase text-muted hover:underline"
          >
            Browse all
          </Link>
        </div>
        <p className="text-[13px] text-muted mb-[14px]">
          Every project, packaged as a release. Click a cover to dive into the full case study.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2 mt-2">
          {PROJECTS.map((p, i) => (
            <AlbumCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </section>

      {/* About blurb */}
      <section className="px-5 lg:px-8 pt-[30px] pb-10">
        <div className="flex items-baseline justify-between mb-[6px]">
          <h2 className="font-display font-extrabold text-[25px] tracking-[-0.02em]">
            About the artist
          </h2>
        </div>
        <p className="text-[13px] text-muted mb-[14px]">
          A Graphic & Motion Designer creating digital ads, social content, and motion graphics for
          brands and agencies.
        </p>
        <Link
          href="/about"
          className="block max-w-[520px] bg-panel rounded-[9px] p-5 hover:bg-elev transition-colors"
        >
          <div className="text-[#cfcdc7] text-[14px] leading-[1.6]">
            BFA in Graphic Design from the Rochester Institute of Technology · four years designing
            brands professionally · work for Taco Bell, FX, and The Syndicate. Tap to read more &
            get in touch.
          </div>
        </Link>
      </section>
    </div>
  );
}
