'use client';

import Image from 'next/image';
import type { Project } from '@/lib/projects';

/**
 * Renders a project's cover artwork — either the still image alone,
 * or the looping coverVideo overlaid on top of the image (which acts
 * as poster and instant-paint fallback).
 *
 * Used in two places on the home page:
 *  - AlbumCard (Side A / Side B grid)
 *  - FeaturedCard (top-of-page showcase)
 *
 * NOT used in:
 *  - Sidebar library list (40px is too small for video)
 *  - Player bar (current-track thumbnail)
 *  - Prev/Next nav cards on project pages
 *  - Search page results
 *  - The project page hero itself (it has its own slightly different
 *    treatment with priority loading)
 *
 * Props:
 *  - p: the Project (uses p.cover always, p.coverVideo if present)
 *  - sizes: next/image sizes attribute for responsive image loading
 *  - className: passed through to the inner media so card hover
 *    transforms (e.g. scale on group-hover) reach both image AND video
 */
export function ProjectCover({
  p,
  sizes,
  className = '',
  priority = false,
}: {
  p: Project;
  sizes: string;
  className?: string;
  /** Eagerly load the cover image — useful for above-the-fold cards
   *  like the top 3 Featured items on the home page. Doesn't affect
   *  the video, which always preloads metadata only. */
  priority?: boolean;
}) {
  return (
    <>
      {/* Image always renders — acts as poster for the video and as
          fallback if the video fails or hasn't loaded yet. */}
      <Image
        src={p.cover}
        alt={`${p.title} cover`}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
      {p.coverVideo && (
        <video
          src={p.coverVideo}
          poster={p.cover}
          autoPlay
          muted
          loop
          playsInline
          // preload=metadata fetches only the first few KB until the
          // user actually sees the card. With many videos on the page
          // this matters for initial load weight.
          preload="metadata"
          aria-hidden
          className={`absolute inset-0 w-full h-full object-cover ${className}`}
        />
      )}
    </>
  );
}
