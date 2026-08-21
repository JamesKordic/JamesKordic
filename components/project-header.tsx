'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SITE_TEXT } from '@/lib/site-text';
import { HEADING } from '@/lib/ui';
import { ContactDialog } from './contact-dialog';

const T = SITE_TEXT;

/** How far past the top before hiding is allowed — above this the header
 *  always shows, so a short page or a nudge never takes it away. */
const REVEAL_ZONE = 80;

/** Movement smaller than this is treated as jitter, not a change of
 *  direction; trackpads and rubber-banding produce a lot of it. */
const THRESHOLD = 6;

/**
 * The project page's header: sticky, and hidden while reading downward.
 * Scrolling back up brings it straight back, so the way out of the project is
 * always a flick away without it sitting over the work the whole time.
 */
export function ProjectHeader() {
  const [hidden, setHidden] = useState(false);
  /** The position the current direction is measured from. It only moves once
   *  the reader has travelled past the threshold, which is what stops small
   *  wobbles from toggling the header. */
  const anchor = useRef(0);

  useEffect(() => {
    anchor.current = window.scrollY;

    // Handled inline rather than inside requestAnimationFrame: the work is a
    // comparison and at most one state change, and scroll events are already
    // delivered at frame rate.
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - anchor.current;
      if (Math.abs(delta) < THRESHOLD) return;
      setHidden(delta > 0 && y > REVEAL_ZONE);
      anchor.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      // No entrance animation here: `view-anim` animates `transform`, the same
      // property the show/hide uses, and an animated value beats a class while
      // it runs — the header couldn't hide until the fade had finished.
      className={`sticky top-0 z-40 flex items-baseline justify-between gap-6 bg-bg px-5 pb-5 pt-6 transition-transform duration-300 motion-reduce:transition-none sm:px-7 sm:pt-7 lg:pb-6 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <h2 className={HEADING}>
        <Link href="/" className="transition-colors hover:text-accent">
          {T.artist.name}
        </Link>
      </h2>

      <nav className={`flex items-baseline gap-6 ${HEADING}`}>
        <Link href="/" className="transition-colors hover:text-accent">
          Work
        </Link>
        <ContactDialog className={`transition-colors hover:text-accent ${HEADING}`}>
          Contact
        </ContactDialog>
      </nav>
    </header>
  );
}
