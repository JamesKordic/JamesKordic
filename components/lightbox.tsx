'use client';

import { useEffect, useRef } from 'react';
import { useLightbox } from '@/lib/lightbox-context';
import { BackIcon, ForwardIcon } from './icons';

export function Lightbox() {
  const { items, index, open, close, step } = useLightbox();
  const closeRef = useRef<HTMLButtonElement>(null);

  // Move focus into the viewer when it opens, and hand it back to whatever
  // opened it (the image tile) when it closes.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => opener?.focus();
  }, [open]);

  if (!open || items.length === 0) return null;
  const it = items[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 bg-[rgba(0,0,0,0.94)] z-[200] flex items-center justify-center p-4 sm:p-10 animate-fadein"
      onClick={close}
    >
      {/* Close button — fixed positioning, lifted to z-[210] so it always
       *  sits above the image content (which lives in a sibling div at
       *  the parent's stacking context). On mobile, tall vertical images
       *  fill the screen at max-h-[90vh] / max-w-[96vw] and would
       *  otherwise render on top of any controls that don't have a
       *  higher z-index than the image.
       *
       *  Background uses a denser fill (40% white + backdrop-blur) and a
       *  hairline border so the button stays legible against bright OR
       *  dark image content — both can show through the lightbox dimmer. */}
      <button
        ref={closeRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        className="fixed top-4 right-4 sm:top-6 sm:right-7 z-[210] w-11 h-11 rounded-full bg-accent hover:bg-accent-deep flex items-center justify-center text-accent-ink transition-colors shadow-[0_4px_14px_-2px_rgba(0,0,0,0.5)]"
        style={{
          top: 'max(1rem, env(safe-area-inset-top))',
          right: 'max(1rem, env(safe-area-inset-right))',
        }}
        aria-label="Close"
      >
        {/* Drawn rather than typed: the × glyph sits off-centre in its own
            line box, so it never lands in the middle of the circle. */}
        <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
        </svg>
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="fixed top-1/2 left-3 sm:left-6 -translate-y-1/2 z-[210] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-accent hover:bg-accent-deep flex items-center justify-center text-accent-ink transition-colors shadow-[0_4px_14px_-2px_rgba(0,0,0,0.5)]"
            aria-label="Previous image"
          >
            <BackIcon className="w-[22px] h-[22px]" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="fixed top-1/2 right-3 sm:right-6 -translate-y-1/2 z-[210] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-accent hover:bg-accent-deep flex items-center justify-center text-accent-ink transition-colors shadow-[0_4px_14px_-2px_rgba(0,0,0,0.5)]"
            aria-label="Next image"
          >
            <ForwardIcon className="w-[22px] h-[22px]" />
          </button>
        </>
      )}

      <div
        className="max-w-[min(1400px,96vw)] max-h-[90vh] flex items-center justify-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {it.type === 'video' ? (
          <video
            src={it.src}
            controls
            autoPlay
            playsInline
            className="max-w-[96vw] max-h-[90vh] shadow-[0_24px_60px_-14px_rgba(0,0,0,0.7)]"
          />
        ) : it.type === 'image' ? (
          // Using a regular <img> in the lightbox so we don't fight next/image sizing
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={it.src}
            alt=""
            className="max-w-[96vw] max-h-[90vh] shadow-[0_24px_60px_-14px_rgba(0,0,0,0.7)]"
          />
        ) : null}
      </div>

      <div aria-live="polite" className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[210] text-white/70 text-[12px] sm:text-[13px] tabular-nums px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md">
        {index + 1} / {items.length}
      </div>
    </div>
  );
}
