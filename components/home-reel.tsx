'use client';

import { useEffect, useRef, useState } from 'react';
import type { Project } from '@/lib/projects';

/** The homepage reel: each project's clip plays once, then hands off to the
 *  next, fading between them. Under reduced motion it holds on the first
 *  frame of the first clip. */
export function HomeReel({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    refs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) {
        video.currentTime = projects[i]?.carouselStartAt ?? 0;
        video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [active, projects]);

  if (!projects.length) return null;

  return (
    <div className="relative -mx-5 aspect-[4/3] overflow-hidden bg-[#111] sm:-mx-8 sm:aspect-auto sm:h-[min(82vh,56vw)]">
      {projects.map((project, i) => (
        <video
          key={project.id}
          ref={(el) => { refs.current[i] = el; }}
          src={project.carouselVideo ?? project.coverVideo}
          poster={project.cover}
          muted
          playsInline
          preload={i === 0 ? 'auto' : 'metadata'}
          onEnded={() => setActive((i + 1) % projects.length)}
          aria-hidden="true"
          className={`reel-clip absolute inset-0 h-full w-full object-cover ${i === active ? 'is-on' : ''}`}
        />
      ))}
    </div>
  );
}
