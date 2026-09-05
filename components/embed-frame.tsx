'use client';

import { useState } from 'react';

/**
 * Embeds external interactive content (like the FlipHTML5 WWIMF book).
 * By default shows a poster/preview state until the user clicks to load,
 * then swaps in an iframe. This pattern:
 *  - Keeps the case study page fast (no auto-loaded third-party iframes)
 *  - Lets the user choose to open the heavy embed
 *  - Always offers a "Open in new tab" fallback link
 *
 * With `autoload` the iframe mounts immediately (no overlay); its native
 * loading="lazy" still defers the actual fetch until it nears the viewport.
 *
 * Props:
 *  - src: URL to embed
 *  - aspect: CSS aspect-ratio
 *  - label: text shown on the open-in-new-tab link
 *  - autoload: skip the click-to-open overlay
 */
export function EmbedFrame({
  src,
  aspect = '16/9',
  label = 'Open in new tab →',
  autoload = false,
}: {
  src: string;
  aspect?: string;
  label?: string;
  autoload?: boolean;
}) {
  const [loaded, setLoaded] = useState(autoload);

  return (
    <div
      className="relative w-full overflow-hidden bg-bg group"
      style={{ aspectRatio: aspect }}
    >
      {loaded ? (
        <iframe
          src={src}
          loading="lazy"
          className="absolute inset-0 w-full h-full border-0"
          allow="fullscreen"
          title="Embedded content"
        />
      ) : (
        <button
          onClick={() => setLoaded(true)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-panel hover:bg-elev transition-colors"
        >
          <div className="relative w-20 h-20 rounded-full bg-accent flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-accent-ink">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <div className="relative text-center">
            <div className="font-display text-[24px] tracking-[-0.5px]">
              Click to open the book
            </div>
            <div className="text-[11px] tracking-[0.14em] uppercase text-muted mt-2">
              Interactive preview · FlipHTML5
            </div>
          </div>
        </button>
      )}

      {/* Open in new tab link — always visible */}
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="absolute top-3 right-3 z-10 text-[10px] tracking-[0.14em] uppercase bg-bg/85 backdrop-blur-md text-text px-3 py-1.5 rounded-full hover:bg-accent hover:text-accent-ink transition-colors"
      >
        {label}
      </a>
    </div>
  );
}
