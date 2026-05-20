'use client';

import { useLightbox } from '@/lib/lightbox-context';

export function Lightbox() {
  const { items, index, open, close, step } = useLightbox();
  if (!open || items.length === 0) return null;
  const it = items[index];

  return (
    <div
      className="fixed inset-0 bg-ink/95 z-[200] flex items-center justify-center p-6 lg:p-12 animate-fadein"
      onClick={close}
    >
      <button
        onClick={(e) => { e.stopPropagation(); close(); }}
        className="fixed top-6 right-6 w-10 h-10 flex items-center justify-center text-paper font-mono text-[18px] hover:text-coral transition-colors z-10"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="fixed top-6 left-6 font-mono text-[10px] tracking-[0.2em] uppercase text-paper/70 z-10">
        IMG {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
      </div>

      {items.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            className="fixed top-1/2 left-4 -translate-y-1/2 text-paper hover:text-coral transition-colors z-10 font-display font-light text-[40px]"
            aria-label="Previous"
          >
            ←
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); step(1); }}
            className="fixed top-1/2 right-4 -translate-y-1/2 text-paper hover:text-coral transition-colors z-10 font-display font-light text-[40px]"
            aria-label="Next"
          >
            →
          </button>
        </>
      )}

      <div className="max-w-[min(1400px,96vw)] max-h-[88vh] flex items-center justify-center relative" onClick={(e) => e.stopPropagation()}>
        {it.type === 'video' ? (
          <video src={it.src} controls autoPlay playsInline className="max-w-[96vw] max-h-[88vh]" />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={it.src} alt="" className="max-w-[96vw] max-h-[88vh]" />
        )}
      </div>
    </div>
  );
}
