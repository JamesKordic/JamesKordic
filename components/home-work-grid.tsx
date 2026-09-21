import Link from 'next/link';
import type { Project } from '@/lib/projects';
import { BLOCK_GAP_Y, GAP_X, STACK } from '@/lib/spacing';

/** Project grid — three across on desktop, two on tablet, one on phones. */
export function HomeWorkGrid({ projects }: { projects: Project[] }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${GAP_X} ${BLOCK_GAP_Y}`}>
      {projects.map((project) => (
        <Link key={project.id} href={`/work/${project.id}`} className="group block">
          <div className="relative aspect-[4/3] overflow-hidden bg-panel">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover}
              alt={`${project.title} project cover`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>
          <h3 className={`${STACK} text-[20px] font-semibold tracking-[-0.01em] transition-colors group-hover:text-accent`}>
            {project.title}
          </h3>
          <p className="mt-1 text-[16px] text-muted">{project.blurb}</p>
        </Link>
      ))}
    </div>
  );
}
