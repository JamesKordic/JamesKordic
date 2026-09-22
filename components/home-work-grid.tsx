'use client';

import Link from 'next/link';
import { useRef } from 'react';
import type { Project } from '@/lib/projects';
import { BLOCK_GAP_Y, GAP_X, STACK } from '@/lib/spacing';

/**
 * Homepage project grid — three across on desktop, two on tablet, one on
 * phones. Every tile is the same 16:9 frame and the cover fills it edge to
 * edge. Most covers are already 16:9, so they show whole; the rest are
 * trimmed evenly from the centre.
 *
 * Hover (or keyboard focus): the project's motion cover fades in and plays
 * over the still, the other cards step back, and an arrow slides in beside
 * the title. Touch screens and reduced-motion visitors get the still only.
 */
export function HomeWorkGrid({ projects }: { projects: Project[] }) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${GAP_X} ${BLOCK_GAP_Y} [&:has(.work-card:hover)_.work-card:not(:hover)]:opacity-50`}
    >
      {projects.map((project) => (
        <WorkCard key={project.id} project={project} />
      ))}
    </div>
  );
}

function WorkCard({ project }: { project: Project }) {
  const video = useRef<HTMLVideoElement>(null);

  const canPreview = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const start = () => {
    const v = video.current;
    if (!v || !canPreview()) return;
    if (v.preload !== 'auto') v.preload = 'auto';
    v.currentTime = 0;
    v.play().catch(() => undefined);
  };

  const stop = () => {
    const v = video.current;
    if (v) v.pause();
  };

  return (
    <Link
      href={`/work/${project.id}`}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      className="work-card group block outline-none transition-opacity duration-500"
    >
      <div className="relative aspect-video overflow-hidden bg-panel ring-accent ring-offset-2 ring-offset-bg group-focus-visible:ring-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.cover}
          alt={`${project.title} project cover`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
        />
        {project.coverVideo && (
          <video
            ref={video}
            src={project.coverVideo}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          />
        )}
      </div>

      <div className={`${STACK} flex items-baseline gap-2`}>
        <h3 className="text-[20px] font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent">
          {project.title}
        </h3>
        <span
          aria-hidden="true"
          className="-translate-x-2 text-[20px] text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
        >
          →
        </span>
      </div>
      <p className="mt-1 text-[16px] text-muted">{project.blurb}</p>
    </Link>
  );
}
