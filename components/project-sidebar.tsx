import Link from 'next/link';
import { PROJECTS } from '@/lib/projects';

/**
 * Always-open project menu for case-study pages (desktop): the left quarter
 * of the split screen, a full-height hairline-bordered column whose inner
 * nav sticks below the site header while the case study scrolls past on the
 * right. Index + title per row, current project marked with the accent and
 * a left rule. Below lg the sidebar disappears and the floating
 * ProjectSwitcher pill takes over.
 */
export function ProjectSidebar({ currentId }: { currentId: string }) {
  return (
    <aside className="hidden border-r border-line lg:block">
      <nav aria-label="Projects" className="sticky top-[63px] px-6 py-10 sm:px-8 lg:py-12">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          Projects
        </div>

        <ul className="mt-6 space-y-1">
          {PROJECTS.map((p, i) => {
            const active = p.id === currentId;
            return (
              <li key={p.id}>
                <Link
                  href={`/work/${p.id}`}
                  aria-current={active ? 'page' : undefined}
                  className={`-ml-3 flex items-baseline gap-3.5 border-l-2 py-2 pl-3 transition-colors ${
                    active
                      ? 'border-accent text-accent'
                      : 'border-transparent text-muted hover:text-accent'
                  }`}
                >
                  <span
                    className={`text-[12px] tabular-nums ${
                      active ? 'text-accent' : 'text-muted-2'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-[17px] leading-snug tracking-[-0.2px]">
                    {p.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 border-t border-line pt-5">
          <Link
            href="/"
            className="text-[13px] text-muted transition-colors hover:text-accent"
          >
            ← All work
          </Link>
        </div>
      </nav>
    </aside>
  );
}
