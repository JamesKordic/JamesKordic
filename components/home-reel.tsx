'use client';

import { useEffect, useRef, useState } from 'react';
import type { Project } from '@/lib/projects';

/** The homepage reel: autoplays muted, each project's clip plays once and
 *  hands off to the next, fading between them. No poster image — the frame
 *  stays dark until the first clip's first frame is ready.
 *
 *  `className` replaces the default frame (full-bleed, 4:3 on phones, up to
 *  82vh tall) — pass it to size the reel to a parent instead. */
const FRAME =
  'relative -mx-5 aspect-[4/3] overflow-hidden bg-[#111] sm:-mx-8 sm:aspect-auto sm:h-[min(82vh,56vw)]';

export function HomeReel({ projects, className = FRAME }: { projects: Project[]; className?: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    refs.current.forEach((video, i) => {
      if (!video) return;
      if (i !== active) {
        video.pause();
        return;
      }
      // React doesn't write `muted` as an attribute; browsers only allow
      // autoplay on muted video, so set the property directly.
      video.muted = true;
      const start = projects[i]?.carouselStartAt ?? 0;
      const go = () => {
        if (start && Math.abs(video.currentTime - start) > 0.25) video.currentTime = start;
        video.play().catch(() => undefined);
      };
      if (video.readyState >= 1) go();
      else video.addEventListener('loadedmetadata', go, { once: true });
    });
  }, [active, projects]);

  if (!projects.length) return null;

  return (
    <div className={className}>
      {projects.map((project, i) => (
        <video
          key={project.id}
          ref={(el) => { refs.current[i] = el; }}
          src={project.carouselVideo ?? project.coverVideo}
          muted
          autoPlay={i === 0}
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
