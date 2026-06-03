'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/lib/projects';
import { usePlayer } from '@/lib/player-context';
import { PlayIcon } from './icons';
import { ProjectCover } from './project-cover';
import { SITE_TEXT } from '@/lib/site-text';

/**
 * Default catalog card — larger than before, with title/tags/year
 * always visible (not just on hover). Thumbnail is the focus.
 */
export function AlbumCard({ p, i = 0 }: { p: Project; i?: number }) {
  const { playFrom } = usePlayer();

  return (
    <div className="stagger" style={{ animationDelay: `${i * 55}ms` }}>
      <Link
        href={`/work/${p.id}`}
        className="group block bg-panel hover:bg-elev rounded-[10px] p-3 lg:p-4 transition-colors text-left cursor-pointer"
      >
        <div className="relative mb-4 rounded-md overflow-hidden shadow-[0_9px_22px_-8px_rgba(0,0,0,0.65)] aspect-square bg-panel-2">
          <ProjectCover
            p={p}
            sizes="(max-width:560px) 50vw, (max-width:1100px) 33vw, 25vw"
            className="group-hover:scale-[1.03] transition-transform duration-500"
          />
          <button
            onClick={() => {
              // Updates player state. We don't preventDefault or stopPropagation
              // because we want the click to bubble up to the parent <Link>
              // and trigger Next.js navigation to /work/[id].
              playFrom(p.id);
            }}
            className="absolute right-3 bottom-3 w-12 h-12 rounded-full bg-gradient-to-br from-accent via-cyan to-magenta flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-[0_8px_18px_-4px_rgba(0,0,0,0.5)] hover:scale-[1.07]"
            aria-label={`Open ${p.title}`}
          >
            <PlayIcon className="w-5 h-5 fill-accent-ink" />
          </button>
        </div>
        <h3 className="font-display font-bold text-[18px] lg:text-[19px] tracking-[-0.01em] leading-tight truncate">
          {p.title}
        </h3>
        <p className="text-[13.5px] text-muted mt-1.5 leading-[1.45] line-clamp-2">
          {p.blurb}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {p.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10.5px] font-semibold tracking-[0.04em] uppercase bg-elev-hi text-muted px-2 py-1 rounded-sm"
            >
              {tag}
            </span>
          ))}
          <span className="text-[10.5px] font-semibold tracking-[0.04em] uppercase text-muted-2 px-1 py-1 ml-auto">
            {p.year}
          </span>
        </div>
      </Link>
    </div>
  );
}

/**
 * Featured card — for the top-of-page showcase. Larger thumbnail,
 * more breathing room, blurb + tags + dedicated CTA.
 */
export function FeaturedCard({ p, i = 0 }: { p: Project; i?: number }) {
  const { playFrom } = usePlayer();
  // Rotate the play-button gradient across the 3 featured cards so each feels distinct
  const playGradient =
    i === 0
      ? 'bg-gradient-to-br from-accent via-cyan to-magenta'
      : i === 1
        ? 'bg-gradient-to-br from-magenta via-amber to-accent'
        : 'bg-gradient-to-br from-cyan via-violet to-magenta';

  return (
    <div className="stagger" style={{ animationDelay: `${i * 70}ms` }}>
      <Link
        href={`/work/${p.id}`}
        className="group block bg-panel hover:bg-elev rounded-xl p-4 lg:p-5 transition-all relative"
      >
        {/* Soft colored glow that appears on hover */}
        <div
          className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10 blur-2xl"
          style={{
            background:
              i === 0
                ? 'linear-gradient(135deg, rgba(200,241,53,0.4), rgba(34,211,238,0.4))'
                : i === 1
                  ? 'linear-gradient(135deg, rgba(255,45,138,0.4), rgba(255,184,74,0.4))'
                  : 'linear-gradient(135deg, rgba(34,211,238,0.4), rgba(139,92,246,0.4))',
          }}
          aria-hidden
        />

        <div className="relative mb-5 rounded-lg overflow-hidden shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)] aspect-square bg-panel-2">
          <ProjectCover
            p={p}
            sizes="(max-width:768px) 100vw, 33vw"
            className="group-hover:scale-[1.04] transition-transform duration-700"
            priority={i < 3}
          />
          <button
            onClick={() => {
              // Updates player state. We don't preventDefault or stopPropagation
              // because we want the click to bubble up to the parent <Link>
              // and trigger Next.js navigation to /work/[id].
              playFrom(p.id);
            }}
            className={`absolute right-4 bottom-4 w-14 h-14 rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-[0_8px_18px_-4px_rgba(0,0,0,0.5)] hover:scale-[1.07] ${playGradient}`}
            aria-label={`Open ${p.title}`}
          >
            <PlayIcon className="w-6 h-6 fill-accent-ink" />
          </button>
          {/* Gradient FEATURED badge */}
          <div className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.14em] uppercase bg-gradient-to-r from-accent via-cyan to-magenta text-accent-ink px-2 py-1 rounded-sm">
            {SITE_TEXT.cards.featuredBadge}
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h3 className="font-display font-extrabold text-[22px] lg:text-[26px] tracking-[-0.015em] leading-tight truncate">
            {p.title}
          </h3>
          <span className="text-[11.5px] font-semibold tracking-[0.04em] uppercase text-muted-2 whitespace-nowrap">
            {p.year}
          </span>
        </div>
        <p className="text-[14px] text-muted leading-[1.55] line-clamp-2 mb-3">
          {p.blurb} — {p.client}
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          {p.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10.5px] font-semibold tracking-[0.04em] uppercase bg-elev-hi text-muted px-2 py-1 rounded-sm"
            >
              {tag}
            </span>
          ))}
          <span className="ml-auto text-[11.5px] font-semibold gradient-text-static flex items-center gap-1 group-hover:gap-2 transition-all">
            {SITE_TEXT.cards.viewCaseStudy}
            <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </div>
  );
}

/**
 * Coming Soon placeholder card — for work that exists but can't be shown
 * publicly yet (under NDA, embargoed, etc).
 *
 * Mirrors AlbumCard's visual rhythm so it fits naturally into the Side A
 * grid without disrupting the row's geometry, but is fundamentally NOT a
 * project page entry: it lives ONLY on the home page, is not in the
 * PROJECTS array, doesn't appear in the sidebar library, search results,
 * featured row, or the player bar. There's no link, no navigation, no
 * route — the card is a pure surface that reveals an NDA explanation
 * on hover/focus.
 *
 * Accessibility:
 *  - The card is keyboard-focusable (tabIndex=0) so users navigating
 *    with the keyboard can trigger the reveal via :focus state.
 *  - The full NDA message is also present in an aria-label so screen
 *    readers announce it without needing to see the hover overlay.
 */
export function ComingSoonCard({ i = 0 }: { i?: number }) {
  const ndaMessage = 'This project is currently under NDA, coming soon!';

  return (
    <div className="stagger" style={{ animationDelay: `${i * 55}ms` }}>
      {/* The card itself is fundamentally non-interactive:
       *   - no Link / no onClick / no router push
       *   - no tabIndex so it's not in the keyboard focus order
       *   - cursor-default so the mouse doesn't shift to a pointer
       *   - no hover:bg-elev or focus ring — those affordances would
       *     read as "this is clickable," which it isn't
       * The hover reveal of the NDA message is purely a visual flourish
       * for sighted users. The full message is also exposed via aria-label
       * and the always-visible "Under NDA" badge / "TBA" tag / subtitle,
       * so screen-reader and keyboard users still get the information. */}
      <div
        role="article"
        aria-label={`THE·TEAM. ${ndaMessage}`}
        className="group block bg-panel rounded-[10px] p-3 lg:p-4 cursor-default select-none relative"
      >
        {/* Cover — THE·TEAM logo on a dark backdrop. The lock and the
         *  Under NDA badge are layered on top as gradient overlays so
         *  they pop against the dark cover the same way the play button
         *  and Side A label do elsewhere on the site. */}
        <div className="relative mb-4 rounded-md overflow-hidden shadow-[0_9px_22px_-8px_rgba(0,0,0,0.65)] aspect-square bg-panel-2">
          {/* The logo cover image */}
          <Image
            src="/covers/the-team.png"
            alt=""
            fill
            sizes="(max-width:560px) 50vw, (max-width:1100px) 33vw, 25vw"
            className="object-cover"
          />

          {/* "Under NDA" badge — gradient pill matching the Side A
           *  treatment (magenta → amber → accent, dark text). Gives the
           *  card a strong identity-system tie-in: it reads as a piece
           *  of the same visual language as the section headers. */}
          <div className="absolute top-3 left-3 z-10 text-[10px] font-bold tracking-[0.18em] uppercase text-accent-ink px-2.5 py-1 rounded-sm bg-gradient-to-r from-magenta via-amber to-accent">
            Under NDA
          </div>

          {/* Centered lock icon — gradient circle matching the play
           *  button treatment (accent → cyan → magenta) with a dark
           *  lock fill inside. Same visual language as the hover
           *  play affordance on real project cards, but locked in the
           *  always-visible state instead of fading in. */}
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 pointer-events-none">
            <div className="w-16 h-16 lg:w-[72px] lg:h-[72px] rounded-full bg-gradient-to-br from-accent via-cyan to-magenta flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(0,0,0,0.45)]">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 lg:w-9 lg:h-9 text-accent-ink"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" />
                <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
                <circle cx="12" cy="15.2" r="1.2" fill="currentColor" stroke="none" />
              </svg>
            </div>
          </div>

          {/* Hover reveal overlay — fades in to fully cover the cover
           *  area with the NDA explanation. */}
          <div className="absolute inset-0 flex items-center justify-center text-center p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-bg/92 backdrop-blur-[3px]">
            <div>
              <div className="text-[10px] font-bold tracking-[0.18em] uppercase gradient-text-static mb-2.5">
                Coming Soon
              </div>
              <p className="text-[13px] font-medium leading-[1.5] text-text max-w-[90%] mx-auto">
                {ndaMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Below-cover metadata. Title now reflects the actual client
         *  (THE·TEAM). Subtitle + tags still communicate the NDA status
         *  so visitors know this card represents real work that's
         *  embargoed, not just a placeholder. */}
        <h3 className="font-display font-bold text-[18px] lg:text-[19px] tracking-[-0.01em] leading-tight truncate text-text/70">
          THE·TEAM
        </h3>
        <p className="text-[13.5px] text-muted-2 mt-1.5 leading-[1.45] line-clamp-2">
          Currently under non-disclosure. Reveal coming soon.
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="text-[10.5px] font-semibold tracking-[0.04em] uppercase bg-elev-hi text-muted px-2 py-1 rounded-sm">
            NDA
          </span>
          <span className="text-[10.5px] font-semibold tracking-[0.04em] uppercase text-muted-2 px-1 py-1 ml-auto">
            TBA
          </span>
        </div>
      </div>
    </div>
  );
}
