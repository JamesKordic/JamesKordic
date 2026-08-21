'use client';

import Link from 'next/link';
import { PROJECTS } from '@/lib/projects';
import { SITE_TEXT } from '@/lib/site-text';
import { BUTTON, LINK } from '@/lib/ui';
import { deWidow } from '@/lib/typography';
import { HomeStrip, stripItems, type StripPick } from '@/components/home-strip';
import { StarRule } from '@/components/star-rule';
import { PageFooter } from '@/components/page-footer';
import { ContactDialog } from '@/components/contact-dialog';

const T = SITE_TEXT;

/** The grid tiles' cover treatment, carried over from the old project cards:
 *  a slight standing over-scale that grows on hover, eased long and slow. */
const ZOOM =
  'h-full w-full transform-gpu scale-[1.02] object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]';

/** Per-project overrides for what a row opens with. Without an entry a row
 *  takes the project's first four pieces in authored order. */
const ROW_PICK: Record<string, StripPick> = {
  wwimf: { section: 'Stage Designs' },
  'taco-bell': [{ count: 3 }, { section: 'Vertical Reel Set 3', order: [1] }],
  // Square, vertical, square, video — the shapes alternate rather than
  // clumping, which is why post 6 sits between posts 1 and 2.
  'mnrk-heavy': [
    { section: 'Social Media Posts', order: [1, 6, 2] },
    { section: 'Lowheaven Vinyl Release', order: [2] },
  ],
  consensus: [
    { section: 'Speaker Announcements', order: [2, 3] },
    { section: 'Motion Graphics', order: [1, 2] },
  ],
  adults: { section: 'Cast Announcements', order: [1, 4, 2, 5, 3, 6] },
  voltage: { section: '3D Animations' },
};

/**
 * Home — a masthead index. A three-column header (name / about / contact)
 * sits at the top of an otherwise empty screen, and the work follows as
 * edge-to-edge horizontal reels, one row per project. There is no header bar
 * or menu: the masthead's own links are the navigation.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-[15px] leading-[1.45] text-text sm:text-[17px]">
      {/* Masthead — three columns on desktop, stacked on mobile. The tall
          bottom padding is what gives the top of the page its emptiness. */}
      <header className="view-anim grid grid-cols-1 gap-8 px-5 pt-6 sm:px-7 sm:pt-7 lg:grid-cols-[22%_1fr_auto] lg:gap-10">
        <h1 className="uppercase tracking-[0.01em]">
          <Link href="/" className="transition-colors hover:text-accent">
            {T.artist.name}
          </Link>
        </h1>

        {/* Wide enough to keep every role on one line — the longest, the RIT
            entry, measures 467px at this type size. */}
        <div className="max-w-[480px] space-y-5">
          <h2 className="uppercase tracking-[0.01em]">About</h2>
          {/* deWidow binds each line's last two words, so nothing wraps to a
              line by itself — the roles are long enough to wrap at this
              column width. */}
          <p>{deWidow(T.home.masthead.intro)}</p>
          <p>{deWidow(T.home.masthead.education)}</p>
          <p>{deWidow(T.home.masthead.availability)}</p>
          <div>
            <p>{T.home.masthead.previouslyLabel}</p>
            <ul className="[text-wrap:pretty]">
              {T.home.masthead.previously.map((role) => (
                <li key={role}>• {deWidow(role)}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Left-aligned inside its column, which sits flush to the page's
            right edge — so the heading and the links share one left margin. */}
        <div className="space-y-5">
          <h2>
            <ContactDialog />
          </h2>
          <ul className="space-y-0">
            <li>
              <a href={`mailto:${T.contact.email}`} className={LINK}>
                {T.contact.email}
              </a>
            </li>
            <li>
              <a
                href={T.contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK}
              >
                Linkedin
              </a>
            </li>
            <li>
              <a
                href={T.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK}
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={T.contact.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK}
              >
                Resume
              </a>
            </li>
          </ul>
        </div>
      </header>

      <main>
        <StarRule className="my-12 sm:my-16" />

        {/* The opening project runs as a full-width reel… */}
        <HomeStrip
          project={PROJECTS[0]}
          items={stripItems(PROJECTS[0], ROW_PICK[PROJECTS[0].id])}
        />

        <StarRule className="my-12 sm:my-16" />

        {/* …and the rest follow as a grid of looping cover thumbnails. */}
        {/* Row gap is small because it also separates each tile's caption from
            its thumbnail — the tiles are subgrids sharing these rows. The
            spacing between one row of projects and the next comes from the
            margin under each thumbnail instead. */}
        <div className="grid grid-cols-1 gap-x-3 gap-y-3 px-5 sm:grid-cols-2 sm:px-7 lg:grid-cols-3">
          {PROJECTS.slice(1).map((p) => (
            // Two rows of the parent grid, taken as a subgrid: every caption in
            // a row then resolves to the same height, so the thumbnails start
            // on one line no matter how many lines a caption wraps to.
            <Link
              key={p.id}
              href={`/work/${p.id}`}
              className="group row-span-2 grid grid-rows-subgrid"
            >
              {/* Name and control above the tile, the same line the featured
                  reel uses. The pill is a span, not a link — the whole tile is
                  already one. */}
              <div className="flex items-start justify-between gap-3">
                <h2>
                  <span className="transition-colors group-hover:text-accent">
                    {p.title}
                  </span>
                  <span className="text-muted">
                    {' / '}
                    {p.blurb}
                  </span>
                </h2>
                <span className={`${BUTTON} group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink`}>
                  View Project
                </span>
              </div>
              {/* The cover sits a touch over-scaled and pushes further on
                  hover — the tile clips it, so the frame stays put and only
                  the image moves. */}
              <div className="relative mb-5 aspect-[1/1.04] self-start overflow-hidden bg-panel-2">
                {p.coverVideo ? (
                  <video
                    src={p.coverVideo}
                    poster={p.cover}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={ZOOM}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover} alt={p.title} loading="lazy" className={ZOOM} />
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>

      <PageFooter />
    </div>
  );
}
