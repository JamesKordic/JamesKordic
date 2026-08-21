'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Media, Project } from '@/lib/projects';
import { BUTTON } from '@/lib/ui';
import { VideoPlayer } from '@/components/video-player';

/** A thumbnail in a home strip — media plus the aspect it should render at. */
type StripItem = { media: Media; aspect: string };

/** Aspect used when a media item and its row both leave it unspecified. */
const DEFAULT_ASPECT = '4/5';

/** Hover treatment for the project title at the head of a row. */
const LINK = 'transition-colors hover:text-accent';

/** One source of pieces for a home row. By default it takes the project's
 *  first few in authored order; `section` narrows it to a single case-study
 *  section, and naming a section without a `count` runs the whole of it.
 *  `order` re-sequences using 1-based positions and drops anything it doesn't
 *  name, so it doubles as a way to cherry-pick. */
export type StripSource = { section?: string; count?: number; order?: number[] };

/** What a project's row opens with — one source, or several joined end to end
 *  when a row is best assembled from more than one part of the case study. */
export type StripPick = StripSource | StripSource[];

/**
 * Flattens a project's case-study media into the opening few thumbnails for a
 * home row — the row is a teaser, not the whole case study.
 *
 * Section layouts carry the aspect ratio in different places — `uniform` and
 * `carousel` put it on the layout, `mixed` puts it on each row — so the aspect
 * is resolved here and travels with the item. Embeds are skipped: they have
 * nothing to show at thumbnail size.
 */
export function stripItems(p: Project, pick: StripPick = {}): StripItem[] {
  const sources = Array.isArray(pick) ? pick : [pick];
  return sources.flatMap((src) => sourceItems(p, src));
}

/** Collects the pieces one source asks for. */
function sourceItems(p: Project, source: StripSource): StripItem[] {
  const { section, order, count = section ? Infinity : 4 } = source;
  const out: StripItem[] = [];

  const push = (media: Media[], fallback: string) => {
    for (const m of media) {
      if (m.type === 'embed') continue;
      out.push({ media: m, aspect: m.aspect ?? fallback });
    }
  };

  const sections = section
    ? (p.sections ?? []).filter((s) => s.title === section)
    : p.sections ?? [];

  for (const s of sections) {
    const l = s.layout;
    if (l?.type === 'mixed') {
      for (const row of l.rows) push(row.media, row.aspect);
    } else {
      push(s.media, l && 'aspect' in l ? l.aspect : DEFAULT_ASPECT);
    }
  }

  // `order` is 1-based to match how the pieces are counted when picking them
  // off the page; anything it doesn't name is dropped.
  const sequenced = order ? order.map((n) => out[n - 1]).filter(Boolean) : out;

  return sequenced.slice(0, count);
}

/**
 * One project row: a label line (project title and discipline, with a
 * "View More" link on the far right) above an edge-to-edge band of its
 * opening work.
 * The thumbnails share a height and divide the width in proportion to their
 * own aspect ratios, so the band always reaches both edges while keeping the
 * varied rhythm of the source media instead of forcing everything to one crop.
 */
export function HomeStrip({
  project,
  items,
}: {
  project: Project;
  items: StripItem[];
}) {
  const href = `/work/${project.id}`;

  return (
    <section>
      {/* Label line — mirrors the reel's edge padding so the text lines up
          with the first and last thumbnail. The title and "View More" are
          separate links so each lights up on its own; the discipline that
          follows the title is plain text and stays put. */}
      <div className="flex items-center justify-between gap-6 px-5 pb-3 sm:px-7">
        <h2>
          <Link href={href} className={LINK}>
            {project.title}
          </Link>
          <span className="text-muted">
            {' / '}
            {project.blurb}
          </span>
        </h2>
        <Link href={href} className={BUTTON}>
          View Project
        </Link>
      </div>

      {/* Phones get the project's cover on its own, the same thumbnail the
          other projects carry — the full reel stacked would run to several
          screens for one project. */}
      <div className="px-5 sm:hidden">
        <div className="relative aspect-[1/1.04] overflow-hidden bg-panel-2">
          {project.coverVideo ? (
            <video
              src={project.coverVideo}
              poster={project.cover}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.cover}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      {/* From sm up the reel itself: three across, then any remaining piece
          full width beneath them, and one justified line from xl. */}
      <div className="hidden gap-3 px-7 sm:flex sm:flex-wrap xl:flex-nowrap">
        {items.map((item, i) => (
          <StripThumb key={i} item={item} alt={`${project.title} — ${i + 1}`} />
        ))}
      </div>
    </section>
  );
}

/**
 * A single tile in a row. Videos get the same full player the case-study
 * sections use — click to play, scrub, sound, fullscreen — squared off to
 * match the images beside it rather than carrying its usual rounded corners.
 */
function StripThumb({ item, alt }: { item: StripItem; alt: string }) {
  const { media, aspect } = item;

  // The ratio drives both layouts in `.strip-tile`: a fixed-height scroller on
  // mobile, and from sm up a justified band whose widths divide the line by
  // ratio. Either way the tile is cut to the media's own shape, so the media
  // inside is never cropped. Kept in CSS rather than inline so the breakpoint
  // can override it.
  const [w, h] = aspect.split('/').map(Number);
  const style = {
    '--ar': w / h,
    aspectRatio: `${w} / ${h}`,
  } as React.CSSProperties;

  return (
    <div
      className="strip-tile relative overflow-hidden bg-panel-2 [&_.rounded-lg]:rounded-none"
      style={style}
    >
      {media.type === 'video' ? (
        <VideoPlayer
          src={media.src}
          aspect={aspect}
          poster={media.poster}
          fit={media.fit ?? 'contain'}
        />
      ) : (
        // next/image rather than a raw <img>: the source art is up to 2000px
        // wide and a reel holds fifty of them, so the thumbnails have to be
        // resized down rather than shipped at full size.
        <Image
          src={media.src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 60vw, 33vw"
          className="object-cover"
        />
      )}
    </div>
  );
}
