'use client';

import Image from 'next/image';
import type { Media, Section, GridRow, AspectRatio } from '@/lib/projects';
import { useLightbox } from '@/lib/lightbox-context';
import { VideoPlayer } from './video-player';
import { EmbedFrame } from './embed-frame';
import { SITE_TEXT } from '@/lib/site-text';

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
      return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-4';
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

  // If the section has any case-study intro fields (context / role / fieldNote),
  // render the richer layout. Otherwise fall back to the simple body-paragraph layout.
  const isCaseStudy = !!(section.context || section.role || section.fieldNote);
  const projectNumber = typeof index === 'number' ? String(index + 1).padStart(2, '0') : null;

  return (
    <section className="py-10 lg:py-14 border-b border-line last:border-b-0">
      {/* Section header */}
      <div className="mb-8">
        {/* Top bar: № + tag + title in a single row, like a chapter divider */}
        <div className="flex items-baseline gap-4 mb-4 flex-wrap">
          {projectNumber && (
            <span className="font-mono text-[11px] font-bold tracking-[0.18em] uppercase">
              <span className="gradient-text-static">№ {projectNumber}</span>
            </span>
          )}
          {section.eyebrow && (
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-muted-2">
              {section.eyebrow}
            </span>
          )}
        </div>
        <h2 className="font-display font-extrabold text-[28px] sm:text-[36px] lg:text-[44px] tracking-[-0.025em] leading-[1.04] mb-4 max-w-3xl">
          {section.title}
        </h2>
        {section.body && (
          <p className="text-[15px] lg:text-[16px] leading-[1.62] text-muted whitespace-pre-line max-w-3xl">
            {section.body}
          </p>
        )}

        {/* Case-study Context + Role grid — two columns on desktop, stacked on mobile */}
        {isCaseStudy && (section.context || section.role) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mt-7 pt-6 border-t border-line max-w-4xl">
            {section.context && (
              <div>
                <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-muted-2 mb-2">
                  {SITE_TEXT.projectPage.sectionContextLabel}
                </div>
                <p className="text-[14.5px] leading-[1.6] text-text">{section.context}</p>
              </div>
            )}
            {section.role && (
              <div>
                <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-muted-2 mb-2">
                  {SITE_TEXT.projectPage.sectionRoleLabel}
                </div>
                <p className="text-[14.5px] leading-[1.6] text-text">{section.role}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Render based on layout type */}
      {section.layout?.type === 'mixed' ? (
        <MixedLayout rows={section.layout.rows} allImages={allImages} onLightbox={show} indexOf={indexOfImage} />
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

      {/* Field note — italicized pull-quote callout after the media grid.
       * Used to share a lesson, breakthrough, or insight from this project. */}
      {section.fieldNote && (
        <div
          className="mt-8 lg:mt-10 max-w-4xl pl-5 py-2 relative"
        >
          {/* Vertical gradient bar — replaces a flat green border so the
           *  callout picks up the same lime → cyan → magenta palette used
           *  throughout the site. Positioned absolute so the gradient
           *  appears as a 2px-wide left rule along the full callout height. */}
          <span
            className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
            style={{
              background:
                'linear-gradient(180deg, #c8f135 0%, #22d3ee 50%, #ff2d8a 100%)',
            }}
            aria-hidden
          />
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2 gradient-text-static">
            {SITE_TEXT.projectPage.fieldNoteLabel}
          </div>
          <p className="text-[16px] lg:text-[18px] leading-[1.55] text-text italic">
            {section.fieldNote}
          </p>
        </div>
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
