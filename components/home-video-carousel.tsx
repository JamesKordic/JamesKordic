'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Project } from '@/lib/projects';

const AUTOPLAY_MS = 10000;

/** Full-viewport introduction to the portfolio. Each slide uses the project's
 * motion cover, with direct project access and restrained playback controls. */
export function HomeVideoCarousel({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const activeRef = useRef(0);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const readyVideos = useRef(new Set<number>());
  const pendingSlide = useRef<number | null>(null);

  const commitSlide = useCallback((index: number) => {
    pendingSlide.current = null;
    activeRef.current = index;
    setActive(index);
  }, []);

  const requestSlide = useCallback((direction: -1 | 1) => {
    if (projects.length < 2 || pendingSlide.current !== null) return;

    const target = (activeRef.current + direction + projects.length) % projects.length;
    if (readyVideos.current.has(target)) {
      commitSlide(target);
      return;
    }

    pendingSlide.current = target;
    videoRefs.current[target]?.load();
  }, [commitSlide, projects.length]);

  const previous = useCallback(() => requestSlide(-1), [requestSlide]);
  const next = useCallback(() => requestSlide(1), [requestSlide]);

  const markReady = useCallback((index: number) => {
    readyVideos.current.add(index);
    if (pendingSlide.current === index) commitSlide(index);
  }, [commitSlide]);

  useEffect(() => {
    if (!playing || projects.length < 2) return;
    const timer = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, next, playing, projects.length]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) setPlaying(false);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      const startAt = projects[index]?.carouselStartAt ?? 0;
      if (index === active) {
        video.play().catch(() => undefined);
      } else {
        video.pause();
        if (video.readyState >= 1 && video.currentTime !== startAt) {
          video.currentTime = startAt;
        }
      }
    });
  }, [active, projects]);

  if (!projects.length) return null;
  const project = projects[active];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured projects"
      className="group relative h-[calc(100svh-60px)] min-h-[520px] overflow-hidden bg-black"
    >
      {projects.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 ${index === active ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={index !== active}
        >
          <video
            ref={(video) => { videoRefs.current[index] = video; }}
            src={slide.carouselVideo ?? slide.coverVideo}
            autoPlay={index === 0}
            muted
            loop
            playsInline
            preload="auto"
            onLoadedMetadata={(event) => {
              const startAt = slide.carouselStartAt ?? 0;
              if (event.currentTarget.duration > startAt) {
                event.currentTarget.currentTime = startAt;
              }
            }}
            onCanPlay={() => markReady(index)}
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/75" />

      <Link
        href={`/work/${project.id}`}
        aria-label={`View ${project.title} project`}
        className="absolute inset-0 z-10 cursor-pointer"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-6 p-5 text-white sm:p-7">
        <Link href={`/work/${project.id}`} className="pointer-events-auto block max-w-[70%]">
          <h1 className="font-display text-[clamp(30px,5vw,72px)] font-semibold leading-[0.95] tracking-[-0.045em] transition-colors group-hover:text-accent">
            {project.title}
          </h1>
        </Link>

        <div className="pointer-events-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={previous}
            aria-label="Previous project"
            className="flex h-11 w-11 items-center justify-center border border-white/40 text-xl transition-colors hover:border-accent hover:bg-accent hover:text-white"
          >
            ←
          </button>
          <span
            aria-live="polite"
            className="flex h-11 min-w-[74px] items-center justify-center border-y border-white/40 px-2 text-[11px] font-semibold tracking-[0.12em]"
          >
            {String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={next}
            aria-label="Next project"
            className="flex h-11 w-11 items-center justify-center border border-white/40 text-xl transition-colors hover:border-accent hover:bg-accent hover:text-white"
          >
            →
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-white/20">
        <div
          key={project.id}
          className="carousel-progress h-full bg-accent"
          style={{ animationPlayState: playing ? 'running' : 'paused' }}
        />
      </div>
    </section>
  );
}
