import Link from 'next/link';
import type { Project } from '@/lib/projects';
import { BLOCK_GAP_Y, GAP_X } from '@/lib/spacing';

/**
 * Homepage project grid — three across on desktop, two on tablet, one on
 * phones. Every tile is the same 16:9 frame and the cover fills it edge to
 * edge. Under it, in the homepage's Swiss style: a heavy black rule, the
 * title in bold Inter beside an arrow, the one-line description, and the
 * disciplines as a bold uppercase line.
 *
 * On hover the rule, title and arrow all turn red together and the arrow
 * swings from ↗ to →.
 */
export function HomeWorkGrid({ projects }: { projects: Project[] }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${GAP_X} ${BLOCK_GAP_Y}`}>
      {projects.map((project) => (
        <Link key={project.id} href={`/work/${project.id}`} className="group block">
          <div className="relative aspect-video overflow-hidden bg-text/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover}
              alt={`${project.title} project cover`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>

          <div className="mt-4 border-t-2 border-text pt-3 transition-colors duration-300 group-hover:border-accent">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-[clamp(24px,2.2vw,32px)] font-bold leading-[1.05] tracking-[-0.04em] transition-colors duration-300 group-hover:text-accent">
                {project.title}
              </h3>
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="mt-1.5 h-5 w-5 shrink-0 -rotate-45 transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-0 group-hover:text-accent motion-reduce:transition-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              >
                <path d="M2 8h11.5M8.5 3 13.5 8l-5 5" />
              </svg>
            </div>

            <p className="mt-1.5 text-[15px] leading-snug text-muted">{project.blurb}</p>

            {/* Three at most, so the line never wraps on desktop. */}
            <p className="mt-4 text-[11px] font-semibold uppercase leading-tight tracking-[0.06em]">
              {project.tags.slice(0, 3).join(' · ')}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
