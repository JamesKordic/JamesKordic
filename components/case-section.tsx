'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { Media, Section, GridRow, AspectRatio } from '@/lib/projects';
import { useLightbox } from '@/lib/lightbox-context';
import { VideoPlayer } from './video-player';
import { EmbedFrame } from './embed-frame';
import { deWidow } from '@/lib/typography';

/* ============ HELPERS ============ */

/** Tailwind class for a column count. Mobile collapses to 1 col by default,
 *  except for tight grids (4 cols) which keep 2 cols on small screens. */
function colClasses(cols: 1 | 2 | 3 | 4): string {
  switch (cols) {
    case 1:
      return 'grid-cols-1';
    case 2:
      return 'grid-cols-1 sm:grid-cols-2';
    case 3:
      return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
    case 4:
      return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4';
  }
}

/** Inline aspectRatio style — CSS supports any ratio. */
function aspectStyle(aspect: AspectRatio | string | undefined) {
  if (!aspect) return undefined;
  return { aspectRatio: aspect };
}

/* ============ COMPONENT ============ */

export function CaseSection({
  section,
  index,
}: {
  section: Section;
  /** Optional 0-based section index, used to render a project number ("№ 01"). */
  index?: number;
}) {
  const { show } = useLightbox();
  const [expanded, setExpanded] = useState(false);

  /* Flatten all images in this section for lightbox navigation,
   * traversing both top-level media and any nested row media. */
  const allImages: Media[] = [];
  if (section.layout?.type === 'mixed') {
    section.layout.rows.forEach((row) => {
      row.media.forEach((m) => {
        if (m.type === 'image') allImages.push(m);
      });
    });
  } else {
    section.media.forEach((m) => {
      if (m.type === 'image') allImages.push(m);
    });
  }
  const indexOfImage = (m: Media) => allImages.indexOf(m);

  const projectNumber = typeof index === 'number' ? String(index + 1).padStart(2, '0') : null;

  // Merge context + role + body into a single flowing description.
  // Authored order is context (what the brief was) → role (what I did) → body (deeper detail).
  const description = [section.context, section.role, section.body].filter(Boolean) as string[];

  // A section is "titled" if it has any header content. Untitled sections
  // render as pure media — used for multi-part groupings where a single
  // heading spans several layout blocks (e.g. Taco Bell's Feed The Beat
  // section that includes multiple carousels). Project number still
  // shows on titled sections only.
  const isTitled = !!(section.title || section.eyebrow);

  return (
    <section className="py-16 lg:py-20 border-b border-line last:border-b-0">
      {/* Section header — two-column on desktop (heading left, description right),
          stacked on mobile. Extra paragraphs collapse behind a "Read more" toggle. */}
      {isTitled && (
        <div className="mb-10 lg:mb-12">
          {description.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
              <div className="lg:col-span-5">
                {section.title && (
                  <h2 className="font-display font-normal text-[28px] sm:text-[36px] lg:text-[44px] tracking-[-0.5px] leading-[1.06]">
                    {section.title}
                  </h2>
                )}
              </div>
              <div className="lg:col-span-7 max-w-[640px]">
                <p className="text-[15px] lg:text-[16px] leading-[1.62] text-muted whitespace-pre-line">
                  {deWidow(description[0])}
                </p>
                {description.length > 1 && (
                  <>
                    {expanded && (
                      <div className="mt-4 space-y-4">
                        {description.slice(1).map((text, i) => (
                          <p
                            key={i}
                            className="text-[15px] lg:text-[16px] leading-[1.62] text-muted whitespace-pre-line"
                          >
                            {deWidow(text)}
                          </p>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => setExpanded((v) => !v)}
                      aria-expanded={expanded}
                      className="mt-4 text-[11px] font-bold tracking-[0.18em] uppercase text-muted-2 hover:text-text transition-colors"
                    >
                      {expanded ? 'Read Less' : 'Read More'}
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            section.title && (
              <h2 className="font-display font-normal text-[28px] sm:text-[36px] lg:text-[44px] tracking-[-0.5px] leading-[1.06] max-w-3xl">
                {section.title}
              </h2>
            )
          )}
        </div>
      )}

      {/* Render based on layout type */}
      {section.layout?.type === 'mixed' ? (
        <MixedLayout rows={section.layout.rows} allImages={allImages} onLightbox={show} indexOf={indexOfImage} />
      ) : section.layout?.type === 'carousel' ? (
        <CarouselLayout
          aspect={section.layout.aspect}
          visible={section.layout.visible ?? 4}
          media={section.media}
          allImages={allImages}
          onLightbox={show}
          indexOf={indexOfImage}
        />
      ) : section.layout?.type === 'uniform' ? (
        <UniformLayout
          cols={section.layout.cols}
          aspect={section.layout.aspect}
          media={section.media}
          allImages={allImages}
          onLightbox={show}
          indexOf={indexOfImage}
        />
      ) : (
        /* Legacy: render using old cols prop, no fixed aspect (image's natural h-auto) */
        <LegacyLayout
          cols={section.cols || 1}
          media={section.media}
          allImages={allImages}
          onLightbox={show}
          indexOf={indexOfImage}
        />
      )}

    </section>
  );
}

/* ============ LAYOUTS ============ */

/** Returns the appropriate max-width for a centered, constrained single item
 *  based on its aspect ratio. Used when a uniform layout has only one media
 *  item but multiple columns — avoids huge full-width vertical media. */
function singleItemMaxWidth(aspect: AspectRatio): string {
  switch (aspect) {
    case '9/16':
    case '1/2':
      return 'max-w-[280px] lg:max-w-[340px]'; // tall vertical
    case '2/3':
    case '3/4':
      return 'max-w-[420px] lg:max-w-[520px]'; // portrait
    case '1/1':
      return 'max-w-[480px] lg:max-w-[600px]'; // square
    case '4/5':
      return 'max-w-[420px] lg:max-w-[500px]'; // 4:5
    default:
      return 'max-w-full'; // landscape — let it breathe
  }
}

function UniformLayout({
  cols,
  aspect,
  media,
  allImages,
  onLightbox,
  indexOf,
}: {
  cols: 1 | 2 | 3 | 4;
  aspect: AspectRatio;
  media: Media[];
  allImages: Media[];
  onLightbox: (items: Media[], i: number) => void;
  indexOf: (m: Media) => number;
}) {
  // Special case: single item in a MULTI-column layout — center with a
  // sensible max width so vertical content doesn't blow up to full screen.
  // If cols === 1, the author wants it full-width (e.g. a brand sheet),
  // so we skip the constraint.
  if (media.length === 1 && cols > 1) {
    return (
      <div className="flex justify-center">
        <div className={`w-full ${singleItemMaxWidth(aspect)}`}>
          <MediaTile
            media={media[0]}
            aspect={aspect}
            onLightbox={() => onLightbox(allImages, Math.max(0, indexOf(media[0])))}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`grid gap-3 lg:gap-4 items-start ${colClasses(cols)}`}>
      {media.map((m, i) => (
        <MediaTile
          key={i}
          media={m}
          aspect={aspect}
          onLightbox={() => onLightbox(allImages, Math.max(0, indexOf(m)))}
        />
      ))}
    </div>
  );
}

/* ============ CAROUSEL LAYOUT ============
 *
 * Horizontally scrolling row of fixed-width cards with snap behavior and
 * floating arrow buttons. Mirrors the live site's Taco Bell carousels —
 * tall vertical phone-format posts that the viewer scrubs through left
 * to right.
 *
 * Card sizing math:
 *   On desktop, `visible` cards fit in the carousel's viewport at once.
 *   We measure the track width and divide by `visible` minus a small
 *   gutter, then apply that as `flex-basis` on each card. Mobile uses a
 *   smaller fixed visible count for thumbability.
 *
 * Arrow behavior:
 *   The arrows scroll by one card width per click. They fade out when at
 *   the start (left) or end (right) of the track, computed from
 *   scrollLeft + clientWidth vs. scrollWidth.
 */
function CarouselLayout({
  aspect,
  visible,
  media,
  allImages,
  onLightbox,
  indexOf,
}: {
  aspect: AspectRatio;
  visible: 2 | 3 | 4 | 5;
  media: Media[];
  allImages: Media[];
  onLightbox: (items: Media[], i: number) => void;
  indexOf: (m: Media) => number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  /** How wide each card should be, in px. Computed from the container
   *  width / visible-on-this-breakpoint. Recomputed on resize. */
  const [cardWidth, setCardWidth] = useState<number | null>(null);
  /** Arrow visibility — derived from scroll position. We hide the left
   *  arrow at the start and the right arrow at the end so users aren't
   *  presented with no-op buttons. */
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /* Recompute card width whenever the track resizes. We use
   * ResizeObserver instead of window.resize so the carousel stays
   * correct if a parent container changes size (e.g. sidebar
   * collapse). */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const w = track.clientWidth;
      // Mobile shows ~2 cards, tablet ~3, desktop honors `visible`.
      // We cap by the requested number on wide screens. `v` is just a
      // number here — typed broader than `visible` because Math.min
      // widens the literal union to number.
      let v: number = visible;
      if (w < 640) v = 2;
      else if (w < 1024) v = Math.min(3, visible);
      const gap = 12; // matches gap-3 in Tailwind
      // Slight peek: subtract a little so the next card hints itself,
      // matching the live site's carousel where you can see a sliver of
      // the next item. (visible + 0.1) is the trick.
      const card = (w - gap * (v - 1)) / (v + 0.08);
      setCardWidth(card);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(track);
    return () => ro.disconnect();
  }, [visible]);

  /* Track scroll position so the arrows fade in/out at the ends. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const max = track.scrollWidth - track.clientWidth;
      setAtStart(track.scrollLeft <= 2);
      setAtEnd(track.scrollLeft >= max - 2);
    };
    onScroll();
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, [cardWidth, media.length]);

  /** Scroll by one card width plus the gap, smoothly. Direction is +1
   *  or -1 (right or left). */
  const scrollByOne = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track || cardWidth == null) return;
    track.scrollBy({ left: direction * (cardWidth + 12), behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Scroll track — overflow-x-auto with snap. `[&::-webkit-scrollbar]:hidden`
       *  hides the native scrollbar in WebKit; `scrollbar-width: none` does
       *  the same for Firefox via inline style.
       *
       *  `data-lenis-prevent` opts this element out of the page-level Lenis
       *  smooth scroll on desktop — without it, horizontal trackpad swipes
       *  here would get intercepted by Lenis and try to drive vertical page
       *  scroll instead of moving the carousel sideways. */}
      <div
        ref={trackRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {media.map((m, i) => (
          <div
            key={i}
            className="snap-start flex-none"
            style={{ width: cardWidth ?? `${100 / visible}%` }}
          >
            <MediaTile
              media={m}
              aspect={aspect}
              onLightbox={() => onLightbox(allImages, Math.max(0, indexOf(m)))}
            />
          </div>
        ))}
      </div>

      {/* Left arrow — fades out at the start of the track */}
      <button
        onClick={() => scrollByOne(-1)}
        disabled={atStart}
        aria-label="Previous"
        className={`absolute top-1/2 -translate-y-1/2 left-2 w-10 h-10 rounded-full bg-bg/85 backdrop-blur-md flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(0,0,0,0.5)] transition-opacity hover:scale-110 ${
          atStart ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Right arrow — fades out at the end of the track */}
      <button
        onClick={() => scrollByOne(1)}
        disabled={atEnd}
        aria-label="Next"
        className={`absolute top-1/2 -translate-y-1/2 right-2 w-10 h-10 rounded-full bg-bg/85 backdrop-blur-md flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(0,0,0,0.5)] transition-opacity hover:scale-110 ${
          atEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

function MixedLayout({
  rows,
  allImages,
  onLightbox,
  indexOf,
}: {
  rows: GridRow[];
  allImages: Media[];
  onLightbox: (items: Media[], i: number) => void;
  indexOf: (m: Media) => number;
}) {
  return (
    <div className="space-y-3 lg:space-y-4">
      {rows.map((row, i) => {
        // Single item in a multi-col row → center with max width constraint,
        // same logic as UniformLayout to avoid huge vertical media on desktop
        if (row.media.length === 1) {
          return (
            <div key={i} className="flex justify-center">
              <div className={`w-full ${singleItemMaxWidth(row.aspect)}`}>
                <MediaTile
                  media={row.media[0]}
                  aspect={row.aspect}
                  onLightbox={() =>
                    onLightbox(allImages, Math.max(0, indexOf(row.media[0])))
                  }
                />
              </div>
            </div>
          );
        }

        return (
          <div key={i} className={`grid gap-3 lg:gap-4 items-start ${colClasses(row.cols)}`}>
            {row.media.map((m, j) => (
              <MediaTile
                key={j}
                media={m}
                aspect={row.aspect}
                onLightbox={() => onLightbox(allImages, Math.max(0, indexOf(m)))}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function LegacyLayout({
  cols,
  media,
  allImages,
  onLightbox,
  indexOf,
}: {
  cols: 1 | 2 | 3 | 4;
  media: Media[];
  allImages: Media[];
  onLightbox: (items: Media[], i: number) => void;
  indexOf: (m: Media) => number;
}) {
  return (
    <div className={`grid gap-3 lg:gap-4 items-start ${colClasses(cols)}`}>
      {media.map((m, i) => (
        <MediaTile
          key={i}
          media={m}
          aspect={undefined /* legacy: natural h-auto */}
          onLightbox={() => onLightbox(allImages, Math.max(0, indexOf(m)))}
        />
      ))}
    </div>
  );
}

/* ============ TILE ============ */

function MediaTile({
  media,
  aspect,
  onLightbox,
}: {
  media: Media;
  aspect?: AspectRatio;
  onLightbox: () => void;
}) {
  if (media.type === 'video') {
    return (
      <VideoPlayer
        src={media.src}
        aspect={media.aspect || aspect || '16/9'}
        fit={media.fit}
        poster={media.poster}
      />
    );
  }

  if (media.type === 'embed') {
    return (
      <EmbedFrame
        src={media.src}
        aspect={media.aspect || aspect || '16/9'}
        label={media.label}
      />
    );
  }

  /* Image. The container locks the aspect ratio when provided,
   * so the image always renders at exactly that shape (no stretching, no cropping). */
  if (aspect || media.aspect) {
    return (
      <button
        onClick={onLightbox}
        className="relative w-full bg-panel-2 rounded-lg overflow-hidden cursor-zoom-in group block"
        style={aspectStyle(media.aspect || aspect)}
      >
        <Image
          src={media.src}
          alt=""
          fill
          sizes="(max-width:600px) 100vw, (max-width:1200px) 50vw, 800px"
          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          unoptimized
        />
      </button>
    );
  }

  /* Legacy fallback — natural aspect from the source. */
  return (
    <button
      onClick={onLightbox}
      className="relative w-full bg-panel-2 rounded-lg overflow-hidden cursor-zoom-in group block"
    >
      <Image
        src={media.src}
        alt=""
        width={1600}
        height={1000}
        sizes="(max-width:600px) 100vw, (max-width:1200px) 50vw, 800px"
        className="w-full h-auto object-cover"
        unoptimized
      />
    </button>
  );
}
