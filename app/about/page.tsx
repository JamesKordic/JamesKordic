'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PROJECTS, POPULAR, getProject, ARTIST } from '@/lib/projects';
import { usePlayer } from '@/lib/player-context';
import { PlayIcon, ShuffleIcon, VerifiedIcon } from '@/components/icons';
import Image from 'next/image';

export default function AboutPage() {
  const router = useRouter();
  const { playFrom } = usePlayer();

  // Featured "Artist Pick" — surface the project the artist most wants
  // visitors to see. I'm using the first POPULAR project as the proxy.
  const artistPick = getProject(POPULAR[0]);

  // "Top tracks" — the top 5 from POPULAR, mimicking Spotify's "Popular" list
  const topTracks = POPULAR.slice(0, 5)
    .map((id) => getProject(id))
    .filter((p): p is NonNullable<ReturnType<typeof getProject>> => !!p);

  // "Fans also like" — the personal-work projects (Side B). Spotify uses
  // this slot for related artists; here it surfaces concept/self-initiated
  // work that complements the client-side work.
  const youMightLike = PROJECTS.filter((p) => p.kind === 'personal').slice(0, 4);

  const handlePlay = (id: string) => {
    playFrom(id);
    router.push(`/work/${id}`);
  };

  const handleShuffle = () => {
    const random = PROJECTS[Math.floor(Math.random() * PROJECTS.length)];
    handlePlay(random.id);
  };

  return (
    <div>
      {/* ============ ARTIST HERO ============
       *  Full-bleed gradient mesh top section. Name overlaps the bottom
       *  of the hero where it transitions into the body. No portrait —
       *  using a generated gradient block instead (Spotify does the same
       *  for artists without portrait photography). */}
      <header className="relative px-5 lg:px-8 pt-[120px] lg:pt-[160px] pb-10 lg:pb-14 overflow-hidden">
        {/* Animated mesh gradient backdrop — same blobs used on home page hero
         *  so this page feels like a continuation of the same visual world. */}
        <div className="mesh-bg" aria-hidden>
          <span className="blob" />
        </div>
        {/* Vignette to keep text legible on top of the moving gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,8,12,0.45) 0%, rgba(8,8,12,0.15) 40%, rgba(8,8,12,0.95) 100%)',
          }}
          aria-hidden
        />

        <div className="relative z-10">
          {/* "Verified Designer" pill — exact same component as home page */}
          <div className="flex items-center gap-2 text-[13px] font-semibold mb-4">
            <VerifiedIcon className="w-[18px] h-[18px]" />
            <span>Verified Designer</span>
          </div>

          {/* Giant artist name — overlaps the bottom of the hero gradient */}
          <h1 className="font-display font-extrabold leading-[0.92] tracking-[-0.035em] text-[64px] sm:text-[100px] lg:text-[140px] xl:text-[170px]">
            James <em className="not-italic gradient-text">Kordic</em>
          </h1>

          {/* Spotify-style metadata row under the name */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-[14px]">
            <span className="text-text font-semibold">
              {PROJECTS.length.toLocaleString()} projects
            </span>
            <span className="w-1 h-1 rounded-full bg-muted inline-block" />
            <span className="text-muted">New York, NY</span>
            <span className="w-1 h-1 rounded-full bg-muted inline-block" />
            <span className="text-muted">Est. 2024</span>
          </div>
        </div>
      </header>

      {/* ============ ACTION ROW ============
       *  Mimics the Spotify play / follow / menu row under the artist hero. */}
      <section className="px-5 lg:px-8 pt-2 pb-10 flex items-center gap-5 flex-wrap">
        <button
          onClick={() => artistPick && handlePlay(artistPick.id)}
          className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-accent via-cyan to-magenta flex items-center justify-center shadow-[0_8px_24px_-6px_rgba(200,241,53,0.5)] hover:scale-[1.06] active:scale-[0.96] transition-transform"
          aria-label="Play featured project"
        >
          <PlayIcon className="w-[26px] h-[26px] fill-accent-ink translate-x-[1px]" />
        </button>
        <button
          onClick={handleShuffle}
          className="text-muted hover:text-text hover:scale-[1.08] transition-all"
          aria-label="Shuffle to a random project"
        >
          <ShuffleIcon className="w-[30px] h-[30px]" />
        </button>
        <a
          href="mailto:Jkordic@me.com"
          className="font-bold text-[13px] tracking-[0.05em] uppercase border-[1.5px] border-[#5a5a5e] hover:border-text rounded-[30px] px-[20px] py-[10px] transition-all hover:scale-[1.03]"
        >
          Get in touch
        </a>
        <a
          href="https://drive.google.com/file/d/10fG8m5VriZOOSDyXZnowGsIqEZaRUp6Y/view"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[14px] text-muted hover:text-text transition-colors"
        >
          ⤓  Download résumé
        </a>
      </section>

      {/* ============ POPULAR ============
       *  Top 5 projects in a Spotify-style numbered track list. */}
      <section className="px-5 lg:px-8 pb-12">
        <h2 className="font-display font-extrabold text-[22px] lg:text-[26px] tracking-[-0.02em] mb-4">
          Popular
        </h2>
        <div className="space-y-1">
          {topTracks.map((p, i) => (
            <button
              key={p.id}
              onClick={() => handlePlay(p.id)}
              className="group w-full grid grid-cols-[24px_46px_1fr_auto] lg:grid-cols-[24px_46px_1fr_120px_60px] items-center gap-3 lg:gap-4 px-2 py-2 rounded-md hover:bg-elev transition-colors text-left"
            >
              <span className="text-[14px] font-medium text-muted tabular-nums text-right group-hover:hidden">
                {i + 1}
              </span>
              <span className="hidden group-hover:inline-flex justify-end text-text">
                <PlayIcon className="w-[14px] h-[14px] fill-current" />
              </span>
              <div className="w-[46px] h-[46px] rounded-[5px] overflow-hidden bg-panel-2 relative flex-none">
                <Image src={p.cover} alt="" fill sizes="46px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[15px] truncate group-hover:text-accent transition-colors">
                  {p.title}
                </div>
                <div className="text-[12px] text-muted truncate mt-[2px]">{p.client}</div>
              </div>
              <div className="hidden lg:block text-[13px] text-muted-2 tabular-nums">
                {p.year}
              </div>
              <div className="text-[13px] text-muted-2 tabular-nums text-right">
                {p.tags[0]}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ============ ARTIST PICK ============
       *  Spotify's "Artist Pick" — a single featured project surfaced
       *  prominently with cover + reasoning. */}
      {artistPick && (
        <section className="px-5 lg:px-8 pb-12">
          <h2 className="font-display font-extrabold text-[22px] lg:text-[26px] tracking-[-0.02em] mb-4">
            Artist Pick
          </h2>
          <Link
            href={`/work/${artistPick.id}`}
            className="group block bg-panel hover:bg-elev rounded-[10px] p-4 lg:p-5 transition-colors max-w-[640px]"
          >
            <div className="flex items-center gap-4 lg:gap-5">
              <div className="w-[100px] h-[100px] lg:w-[140px] lg:h-[140px] flex-none rounded-md overflow-hidden bg-panel-2 relative shadow-[0_9px_22px_-8px_rgba(0,0,0,0.65)]">
                <Image
                  src={artistPick.cover}
                  alt={artistPick.title}
                  fill
                  sizes="140px"
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-muted-2 mb-2">
                  <span className="gradient-text-static">Posted by {ARTIST.split(' ')[0]}</span>
                </div>
                <div className="font-display font-extrabold text-[20px] lg:text-[26px] tracking-[-0.015em] leading-tight mb-1">
                  {artistPick.title}
                </div>
                <div className="text-[13px] text-muted mb-2">
                  {artistPick.client} · {artistPick.year}
                </div>
                <div className="text-[13px] text-text leading-[1.5] line-clamp-2">
                  &ldquo;{artistPick.blurb} — the project that probably best represents where the
                  work&apos;s headed.&rdquo;
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ============ ABOUT (the bio itself) ============
       *  Two-column layout: bio text on the left, "factoid" stats on the right.
       *  Mimics Spotify's About tab with monthly listeners and where-they're-from. */}
      <section className="px-5 lg:px-8 pb-12">
        <h2 className="font-display font-extrabold text-[22px] lg:text-[26px] tracking-[-0.02em] mb-4">
          About
        </h2>
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 lg:gap-10 bg-panel rounded-[12px] p-6 lg:p-8 relative overflow-hidden">
          {/* Subtle gradient backdrop — kept to ~5% opacity so the bio text
           *  remains the focal point. */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background:
                'radial-gradient(ellipse at 80% 0%, rgba(255,45,138,0.25) 0%, transparent 50%), radial-gradient(ellipse at 0% 100%, rgba(34,211,238,0.18) 0%, transparent 55%)',
            }}
            aria-hidden
          />

          <div className="relative z-10">
            <p className="text-[17px] lg:text-[18px] leading-[1.6] text-text mb-4">
              James Kordic is a Graphic and Motion Designer based in New York, creating digital
              ads, social content, and motion graphics for brands and the agencies that work
              with them. His advertising experience and mixed-media approach drive
              results-focused creative work.
            </p>
            <p className="text-[15px] leading-[1.6] text-muted">
              He has produced work for Taco Bell, FX, MNRK Heavy, Consensus by CoinDesk, and The
              Syndicate, along with large-scale campaigns for the Rochester Institute of
              Technology — where he earned a BFA in Graphic Design. Away from the screen, he&apos;s
              usually deep in music or experimenting with film photography.
            </p>
          </div>

          {/* "Factoids" panel — Spotify's monthly listeners block becomes
           *  a stack of designer-relevant stats. */}
          <div className="relative z-10 space-y-4">
            <Factoid value={PROJECTS.length.toString()} label="Released projects" gradient />
            <Factoid value="4 yrs" label="Designing professionally" />
            <Factoid value="BFA" label="Graphic Design, RIT" />
            <Factoid value="NYC" label="Currently based in" />
          </div>
        </div>
      </section>

      {/* ============ ON TOUR / AVAILABILITY ============
       *  Spotify has "On tour" with upcoming concert dates. The designer
       *  equivalent: current availability + how to reach out. */}
      <section className="px-5 lg:px-8 pb-12">
        <h2 className="font-display font-extrabold text-[22px] lg:text-[26px] tracking-[-0.02em] mb-4">
          Currently
        </h2>
        <div className="bg-panel rounded-[12px] p-5 lg:p-6 flex items-center gap-4 lg:gap-5 relative overflow-hidden">
          {/* Status dot — pulsing accent, signals "online / available" */}
          <div className="relative flex h-3 w-3 flex-none ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-extrabold text-[18px] lg:text-[20px] tracking-[-0.01em]">
              Open for work · 2026
            </div>
            <div className="text-[13px] lg:text-[14px] text-muted mt-1">
              Available for freelance and full-time. Remote, onsite, or hybrid. Replies within 24
              hours.
            </div>
          </div>
          <a
            href="mailto:Jkordic@me.com"
            className="hidden sm:inline-block font-bold text-[12px] tracking-[0.05em] uppercase bg-text text-bg rounded-[30px] px-[20px] py-[11px] hover:scale-[1.05] transition-transform whitespace-nowrap"
          >
            Reach out
          </a>
        </div>
      </section>

      {/* ============ FANS ALSO LIKE ============
       *  Spotify suggests related artists. Repurposed: personal-work
       *  projects surfaced as "related" to the client-side work above. */}
      <section className="px-5 lg:px-8 pb-12">
        <h2 className="font-display font-extrabold text-[22px] lg:text-[26px] tracking-[-0.02em] mb-1">
          You might also like
        </h2>
        <p className="text-[13px] text-muted mb-5">Personal projects and self-initiated work.</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {youMightLike.map((p) => (
            <Link
              key={p.id}
              href={`/work/${p.id}`}
              className="group bg-panel hover:bg-elev rounded-[10px] p-3 lg:p-4 transition-colors block"
            >
              <div className="relative mb-3 rounded-md overflow-hidden shadow-[0_9px_22px_-8px_rgba(0,0,0,0.65)] aspect-square bg-panel-2">
                <Image
                  src={p.cover}
                  alt={p.title}
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="font-display font-bold text-[16px] tracking-[-0.01em] leading-tight truncate">
                {p.title}
              </div>
              <div className="text-[12px] text-muted-2 mt-1 truncate">{p.tags[0]}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ CONTACT GRID ============
       *  All contact channels in one compact card grid. */}
      <section className="px-5 lg:px-8 pb-12">
        <h2 className="font-display font-extrabold text-[22px] lg:text-[26px] tracking-[-0.02em] mb-4">
          Connect
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
          <ContactCard
            label="Email"
            value="Jkordic@me.com"
            href="mailto:Jkordic@me.com"
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-[20px] h-[20px]"
              >
                <rect x="3" y="5" width="18" height="14" rx="2.5" />
                <path d="m3.5 7 8.5 6 8.5-6" strokeLinecap="round" />
              </svg>
            }
          />
          <ContactCard
            label="Phone"
            value="+1 (631) 742-8043"
            href="tel:+16317428043"
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[20px] h-[20px]">
                <path d="M6.6 3.5 9 3l1.6 4-2 1.5a12 12 0 0 0 5.4 5.4l1.5-2 4 1.6-.5 2.4A2 2 0 0 1 22 21a18 18 0 0 1-19-19 2 2 0 0 1 3.6-1.5Z" />
              </svg>
            }
          />
          <ContactCard
            label="LinkedIn"
            value="@jameskordic"
            href="https://www.linkedin.com/in/jameskordic/"
            external
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[20px] h-[20px]">
                <path d="M4.5 3.5A2 2 0 1 1 4.5 7a2 2 0 0 1 0-3.5ZM3 9h3v12H3zm6 0h3v1.7c.6-1 1.9-2 3.8-2 3 0 4.2 2 4.2 5.2V21h-3v-6.4c0-1.6-.6-2.6-2-2.6s-2.3 1-2.3 2.6V21H9z" />
              </svg>
            }
          />
          <ContactCard
            label="Instagram"
            value="@jameskordic"
            href="https://www.instagram.com/jameskordic/"
            external
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-[20px] h-[20px]"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
              </svg>
            }
          />
        </div>
      </section>

      <p className="text-muted-2 text-[12px] px-5 lg:px-8 pb-8">
        ©2026 James Kordic · Graphic Design
      </p>
    </div>
  );
}

/* ============ INTERNAL COMPONENTS ============ */

/** A stat tile — gradient prop boosts the value text with the accent gradient
 *  for the most prominent stat. */
function Factoid({
  value,
  label,
  gradient = false,
}: {
  value: string;
  label: string;
  gradient?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-3 border-b border-line pb-3 last:border-b-0">
      <div
        className={`font-display font-extrabold text-[28px] lg:text-[34px] tracking-[-0.02em] tabular-nums leading-none ${
          gradient ? 'gradient-text-static' : 'text-text'
        }`}
      >
        {value}
      </div>
      <div className="text-[12px] text-muted-2 uppercase tracking-[0.08em] font-semibold">
        {label}
      </div>
    </div>
  );
}

/** Contact card — bigger than the old pill chips, more like a Spotify
 *  social link card. */
function ContactCard({
  label,
  value,
  href,
  external = false,
  icon,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group bg-panel hover:bg-elev rounded-[10px] p-4 transition-colors flex items-center gap-3"
    >
      <span className="text-muted group-hover:text-accent transition-colors flex-none">{icon}</span>
      <div className="min-w-0">
        <div className="text-[10px] tracking-[0.14em] uppercase text-muted-2 font-semibold mb-0.5">
          {label}
        </div>
        <div className="text-[13px] font-semibold truncate">{value}</div>
      </div>
    </a>
  );
}
