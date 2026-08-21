'use client';

/**
 * Returns the page to the top. A button rather than an `#anchor` so the URL
 * doesn't pick up a hash, and it inherits the page's smooth scrolling.
 */
export function BackToTop({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={className}
    >
      Back to top
    </button>
  );
}
