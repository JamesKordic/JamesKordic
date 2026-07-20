'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PROJECTS } from '@/lib/projects';

/**
 * Floating project switcher for case-study pages: a fixed pill in the
 * bottom-right ("03 / 07 · Projects") that opens a panel listing every
 * project — thumbnail, title, index — on hover (or tap, for touch).
 * The current project is highlighted; clicking any row jumps straight
 * to that case study from wherever the reader is on the page.
 */
export function ProjectSwitcher({ currentId }: { currentId: string }) {
  const [open, setOpen] = useState(false);
  const idx = PROJECTS.findIndex((p) => p.id === currentId);

  return (
    <nav
      aria-label="Switch project"
      className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7 lg:hidden"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Panel — opens upward from the pill. The wrapper's padding (not a
          margin) forms the visual gap, so the mouse never crosses a dead
          zone travelling pill → panel; a margin there would fire the nav's
          mouseleave mid-journey and close the menu before it could be used. */}
      <div
        className={`absolute bottom-full right-0 pb-3 ${
          open ? '' : 'pointer-events-none'
        }`}
      >
        <div
          className={`w-[320px] border border-line bg-bg shadow-[0_24px_64px_-16px_rgba(0,0,0,0.25)] transition-all duration-200 ease-out ${
            open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
        <div className="border-b border-line px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-2">
          All projects
        </div>
        <ul className="max-h-[60vh] overflow-y-auto py-1">
          {PROJECTS.map((p, i) => {
            const active = p.id === currentId;
            return (
              <li key={p.id}>
                <Link
                  href={`/work/${p.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-panel ${
                    active ? 'text-accent' : ''
                  }`}
                >
                  <span className="h-10 w-10 flex-none overflow-hidden bg-panel-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.cover}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span className="min-w-0 flex-1 truncate font-display text-[15px] tracking-[-0.2px]">
                    {p.title}
                  </span>
                  <span className="text-[11px] tabular-nums text-muted-2">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        </div>
      </div>

      {/* Pill — hover (wrapper) opens for mouse users, and their clicks only
          ever open (mouseleave closes), so hover-then-click doesn't cancel
          itself. Touch/pen taps, which have no hover, toggle. Browsers whose
          click events carry no pointerType are treated as mouse. */}
      <button
        type="button"
        onClick={(e) => {
          const pointerType = (e.nativeEvent as PointerEvent).pointerType;
          if (pointerType === 'touch' || pointerType === 'pen') {
            setOpen((v) => !v);
          } else {
            setOpen(true);
          }
        }}
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-full border border-line bg-bg/90 px-4 py-2.5 text-[12px] font-semibold shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] backdrop-blur-md transition-colors hover:border-accent"
      >
        <span className="tabular-nums text-muted">
          {String(idx + 1).padStart(2, '0')} /{' '}
          {String(PROJECTS.length).padStart(2, '0')}
        </span>
        Projects
        <span
          aria-hidden
          className={`text-muted-2 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        >
          ▴
        </span>
      </button>
    </nav>
  );
}
