import Link from 'next/link';
import type { Project } from '@/lib/projects';

export function HomeProjectIndex({ projects }: { projects: Project[] }) {
  const hasTwoCardFinalRow = projects.length % 3 === 2;
  const hasSingleCardFinalRowAtTablet = projects.length % 2 === 1;

  return (
    <div className="grid grid-cols-1 gap-px border-b border-line bg-line sm:grid-cols-2 md:grid-cols-6">
      {projects.map((project, index) => {
        const isWide = hasTwoCardFinalRow && index >= projects.length - 2;
        const isTabletWide = hasSingleCardFinalRowAtTablet && index === projects.length - 1;

        return (
          <ProjectCover
            key={project.id}
            project={project}
            isWide={isWide}
            isTabletWide={isTabletWide}
            className={`${isTabletWide ? 'sm:col-span-2' : ''} ${
              isWide ? 'md:col-span-3' : 'md:col-span-2'
            }`}
          />
        );
      })}
    </div>
  );
}

function ProjectCover({
  project,
  className,
  isWide,
  isTabletWide,
}: {
  project: Project;
  className: string;
  isWide: boolean;
  isTabletWide: boolean;
}) {
  return (
    <article className={`min-w-0 bg-bg ${className}`}>
      <Link
        href={`/work/${project.id}`}
        className="group flex h-full flex-col"
      >
        <div
          className={`relative aspect-[16/10] overflow-hidden bg-panel-2 ${
            isTabletWide ? 'sm:aspect-[12/5]' : ''
          } ${isWide ? 'md:aspect-[12/5]' : ''}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.cover}
            alt={`${project.title} project cover`}
            loading="lazy"
            className="h-full w-full scale-[1.01] object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.065] group-hover:contrast-[1.08]"
          />
          <span className="pointer-events-none absolute inset-0 bg-accent opacity-0 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-45" />
          <span className="pointer-events-none absolute -left-[40%] top-0 h-full w-[34%] -skew-x-12 bg-white/25 opacity-0 mix-blend-overlay transition-[transform,opacity] duration-700 ease-out group-hover:translate-x-[440%] group-hover:opacity-100" />
          <span className="pointer-events-none absolute inset-3 scale-[0.96] border border-white/70 opacity-0 transition-[transform,opacity] duration-500 ease-out group-hover:scale-100 group-hover:opacity-100" />
        </div>

        <div className="flex flex-1 items-start justify-between gap-5 border-t border-line px-4 py-5 sm:px-5 sm:py-6">
          <div className="min-w-0">
            <h2 className="font-display text-[clamp(28px,3.2vw,48px)] font-semibold uppercase leading-[0.88] tracking-[-0.055em] transition-colors group-hover:text-accent">
              {project.title}
            </h2>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted sm:text-[11px]">
              {project.blurb}
            </p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line text-lg transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
            ↗
          </span>
        </div>
      </Link>
    </article>
  );
}
