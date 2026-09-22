import Link from 'next/link';
import type { Project } from '@/lib/projects';
import { BLOCK_GAP_Y, GAP_X } from '@/lib/spacing';

/**
 * Homepage project grid — three across on desktop, two on tablet, one on
 * phones. Every tile is the same 16:9 frame and the cover fills it edge to
 * edge; the caption sits under a hairline: title, then a one-line
 * description.
 */
export function HomeWorkGrid({ projects }: { projects: Project[] }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${GAP_X} ${BLOCK_GAP_Y}`}>
      {projects.map((project) => (
        <Link key={project.id} href={`/work/${project.id}`} className="group block">
          <div className="relative aspect-video overflow-hidden bg-panel">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover}
              alt={`${project.title} project cover`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>

          <div className="mt-4 border-t border-line pt-3">
            <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.01em] transition-colors duration-300 group-hover:text-accent">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_1px]">
                {project.title}
              </span>
            </h3>
            <p className="mt-1 text-[15px] leading-snug text-muted">{project.blurb}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
