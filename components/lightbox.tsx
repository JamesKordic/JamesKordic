'use client';

import Image from 'next/image';
import { useLightbox } from '@/lib/lightbox-context';
import { BackIcon, ForwardIcon } from './icons';

export function Lightbox() {
  const { items, index, open, close, step } = useLightbox();

  if (!open || items.length === 0) return null;
  const it = items[index];

  return (
    <div
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
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        className="fixed top-4 right-4 sm:top-6 sm:right-7 z-[210] w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md ring-1 ring-white/30 flex items-center justify-center text-white text-2xl leading-none transition-colors shadow-[0_4px_14px_-2px_rgba(0,0,0,0.5)]"
        style={{
          top: 'max(1rem, env(safe-area-inset-top))',
          right: 'max(1rem, env(safe-area-inset-right))',
        }}
        aria-label="Close"
      >
        ×
      </button>

      {items.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="fixed top-1/2 left-3 sm:left-6 -translate-y-1/2 z-[210] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md ring-1 ring-white/30 flex items-center justify-center text-white transition-colors shadow-[0_4px_14px_-2px_rgba(0,0,0,0.5)]"
            aria-label="Previous"
          >
            <BackIcon className="w-[22px] h-[22px]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="fixed top-1/2 right-3 sm:right-6 -translate-y-1/2 z-[210] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md ring-1 ring-white/30 flex items-center justify-center text-white transition-colors shadow-[0_4px_14px_-2px_rgba(0,0,0,0.5)]"
            aria-label="Next"
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
            className="max-w-[96vw] max-h-[90vh] rounded-lg shadow-[0_24px_60px_-14px_rgba(0,0,0,0.7)]"
          />
        ) : it.type === 'image' ? (
          // Using a regular <img> in the lightbox so we don't fight next/image sizing
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={it.src}
            alt=""
            className="max-w-[96vw] max-h-[90vh] rounded-lg shadow-[0_24px_60px_-14px_rgba(0,0,0,0.7)]"
          />
        ) : null}
      </div>

      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[210] text-white/70 text-[12px] sm:text-[13px] tabular-nums px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md">
        {index + 1} / {items.length}
      </div>
    </div>
  );
}
