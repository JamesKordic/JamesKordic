'use client';

import Image from 'next/image';
import type { Media, Section, GridRow, AspectRatio } from '@/lib/projects';
import { useLightbox } from '@/lib/lightbox-context';
import { VideoPlayer } from './video-player';
import { EmbedFrame } from './embed-frame';

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

export function CaseSection({ section }: { section: Section }) {
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

  return (
    <section className="py-10 lg:py-14 border-b border-line last:border-b-0">
      {/* Section header */}
      <div className="mb-8 max-w-3xl">
        {section.eyebrow && (
          <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-muted mb-3">
            <span className="gradient-text-static">{section.eyebrow}</span>
          </div>
        )}
        <h2 className="font-display font-extrabold text-[28px] sm:text-[36px] lg:text-[44px] tracking-[-0.025em] leading-[1.04] mb-4">
          {section.title}
        </h2>
        {section.body && (
          <p className="text-[15px] lg:text-[16px] leading-[1.62] text-muted whitespace-pre-line">
            {section.body}
          </p>
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
  // Special case: single item — center it with a sensible max width
  // so vertical content doesn't blow up to full screen width on desktop
  if (media.length === 1) {
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
    <div className={`grid gap-3 lg:gap-4 ${colClasses(cols)}`}>
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
          <div key={i} className={`grid gap-3 lg:gap-4 ${colClasses(row.cols)}`}>
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
    <div className={`grid gap-3 lg:gap-4 ${colClasses(cols)}`}>
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
    return <VideoPlayer src={media.src} aspect={media.aspect || aspect || '16/9'} />;
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
