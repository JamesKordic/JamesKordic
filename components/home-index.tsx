'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Project } from '@/lib/projects';
import { GAP_X } from '@/lib/spacing';
import { META, ROW_NAME } from '@/lib/type';

/**
 * Homepage project index — one full-width row per project: the cover first,
 * then the name, with the description and disciplines in their own column on
 * the right.
 *
 * The cover leads the row so the work reads before the name does. Hovering a
 * row fades the others back and zooms that cover inside its frame.
 *
 * The description only earns its own column from `xl` up; below that there
 * isn't enough width for a cover, a name at this size and a third column, so
 * it sits under the name instead.
 */
export function HomeIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <ul
      onMouseLeave={() => setActive(null)}
      className="border-b border-line"
    >
      {projects.map((project, i) => {
        const dimmed = active !== null && active !== i;
        return (
          <li key={project.id}>
            <Link
              href={`/work/${project.id}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className={`group grid grid-cols-1 ${GAP_X} gap-y-5 border-t border-line py-5 transition-opacity duration-300 focus-visible:outline-none sm:py-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)_auto] lg:items-center xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)_minmax(0,260px)_auto] 2xl:grid-cols-[minmax(0,520px)_minmax(0,1fr)_minmax(0,300px)_auto] ${
                dimmed ? 'lg:[@media(hover:hover)]:opacity-25' : ''
              }`}
            >
              <div className="relative aspect-video overflow-hidden bg-panel">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.cover}
                  alt={`${project.title} project cover`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>

              <div>
                <h3
                  className={`${ROW_NAME} transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 group-focus-visible:translate-x-3 group-focus-visible:text-accent motion-reduce:transition-none motion-reduce:group-hover:translate-x-0`}
                >
                  {project.title}
                </h3>

                {/* Under the name until the row is wide enough to carry a
                    column of its own. */}
                <div className={`mt-3 ${META} xl:hidden`}>
                  <p>{project.blurb}</p>
                  <p className="mt-1 text-muted">{project.tags.slice(0, 3).join(', ')}</p>
                </div>
              </div>

              <div className={`hidden ${META} xl:block`}>
                <p>{project.blurb}</p>
                <p className="mt-1 text-muted">{project.tags.slice(0, 3).join(', ')}</p>
              </div>

              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="hidden h-7 w-7 -rotate-45 text-muted transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-0 group-hover:text-accent motion-reduce:transition-none lg:block"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
              </svg>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
