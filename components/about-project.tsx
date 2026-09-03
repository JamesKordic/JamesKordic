'use client';

import { useState } from 'react';
import { BUTTON } from '@/lib/ui';

/**
 * The project's write-up, folded away behind a toggle. A case study opens on
 * its work rather than on paragraphs — the reader asks for the background when
 * they want it, and the page stays as visual as the work itself.
 *
 * Opening expands the write-up in place, beneath the toggle; the rest of the
 * page keeps its full width and simply moves down.
 */
export function AboutProject({
  disciplines,
  children,
}: {
  disciplines: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-6">
        <p className="text-muted">{disciplines}</p>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle project description"
          className={BUTTON}
        >
          Project info
          {/* Drawn rather than typed: `+` and `×` sit on the font's math axis,
              which is higher than the cap-height centre the label reads on, so
              a glyph never quite lines up beside it. A square SVG centres on
              the flex line exactly. */}
          <svg
            aria-hidden
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            // The button's padding is a pixel uneven, to lift the label off the
            // descender in "Project". The icon has no descender, so it takes
            // that pixel back and sits on the true centre.
            className="ml-2 h-3 w-3 shrink-0 translate-y-[1px]"
          >
            {open ? (
              <>
                <path d="M2.8 2.8 L9.2 9.2" />
                <path d="M9.2 2.8 L2.8 9.2" />
              </>
            ) : (
              <>
                <path d="M6 1.8 V10.2" />
                <path d="M1.8 6 H10.2" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Only a gap above — the title block's own bottom padding already gives
          whatever sits last here the same 40/48 the section text blocks use. */}
      {open && <div className="animate-fadein pt-5 lg:pt-6">{children}</div>}
    </>
  );
}
