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
      className="fixed inset-0 bg-[rgba(0,0,0,0.94)] z-[200] flex items-center justify-center p-10 animate-fadein"
      onClick={close}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        className="fixed top-6 right-7 w-11 h-11 rounded-full bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] flex items-center justify-center text-white text-2xl transition-colors"
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
            className="fixed top-1/2 left-6 -translate-y-1/2 w-12 h-12 rounded-full bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] flex items-center justify-center text-white transition-colors"
            aria-label="Previous"
          >
            <BackIcon className="w-[22px] h-[22px]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="fixed top-1/2 right-6 -translate-y-1/2 w-12 h-12 rounded-full bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] flex items-center justify-center text-white transition-colors"
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

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-[#aaa] text-[13px] tabular-nums">
        {index + 1} / {items.length}
      </div>
    </div>
  );
}
