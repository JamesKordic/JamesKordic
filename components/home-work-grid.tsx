import Link from 'next/link';
import type { Project } from '@/lib/projects';

/** Two-column list of projects: image, name, one line. */
export function HomeWorkGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-11 md:grid-cols-2 sm:gap-x-8">
      {projects.map((project) => (
        <Link key={project.id} href={`/work/${project.id}`} className="group block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-panel">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover}
              alt={`${project.title} project cover`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>
          <h3 className="mt-3.5 text-[20px] font-semibold tracking-[-0.01em] transition-colors group-hover:text-accent">
            {project.title}
          </h3>
          <p className="text-[16px] text-muted">{project.blurb}</p>
        </Link>
      ))}
    </div>
  );
}
