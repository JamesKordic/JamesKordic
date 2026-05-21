'use client';

import { useState } from 'react';

/**
 * Embeds external interactive content (like the FlipHTML5 WWIMF book).
 * Shows a poster/preview state until the user clicks to load,
 * then swaps in an iframe. This pattern:
 *  - Keeps the case study page fast (no auto-loaded third-party iframes)
 *  - Lets the user choose to open the heavy embed
 *  - Always offers a "Open in new tab" fallback link
 *
 * Props:
 *  - src: URL to embed
 *  - aspect: CSS aspect-ratio
 *  - label: text shown on the open-in-new-tab link
 */
export function EmbedFrame({
  src,
  aspect = '16/9',
  label = 'Open in new tab →',
}: {
  src: string;
  aspect?: string;
  label?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="relative w-full rounded-lg overflow-hidden bg-bg group"
      style={{ aspectRatio: aspect }}
    >
      {loaded ? (
        <iframe
          src={src}
          className="absolute inset-0 w-full h-full border-0"
          allow="fullscreen"
          title="Embedded content"
        />
      ) : (
        <button
          onClick={() => setLoaded(true)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 hover:bg-elev/30 transition-colors"
        >
          {/* Aurora gradient backdrop */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                'radial-gradient(circle at 30% 40%, rgba(255,45,138,0.4), transparent 60%), radial-gradient(circle at 70% 60%, rgba(34,211,238,0.4), transparent 60%)',
            }}
            aria-hidden
          />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-accent via-cyan to-magenta flex items-center justify-center shadow-[0_8px_32px_-4px_rgba(0,0,0,0.6)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-accent-ink">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <div className="relative text-center">
            <div className="font-display font-bold text-[22px] tracking-[-0.01em]">
              Click to open the book
            </div>
            <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted mt-2">
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
        className="absolute top-3 right-3 z-10 font-mono text-[10px] tracking-[0.14em] uppercase bg-bg/80 backdrop-blur-md text-text px-3 py-1.5 rounded-full hover:bg-accent hover:text-accent-ink transition-colors"
      >
        {label}
      </a>
    </div>
  );
}
