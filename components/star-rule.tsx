/**
 * A rule made of tiny four-point stars, used to part the featured project from
 * the rest of the work. It's a repeating background rather than a row of
 * characters, so the stars tile to any width, stay evenly spaced, and render
 * crisp at any resolution. Decorative only — hidden from screen readers.
 */
export function StarRule({ className = '' }: { className?: string }) {
  const star =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='12'%3E%3Cpath d='M13 1.4 L14 5 L17.6 6 L14 7 L13 10.6 L12 7 L8.4 6 L12 5 Z' fill='%23A3A3A3'/%3E%3C/svg%3E\")";

  return (
    <div
      aria-hidden
      className={`h-3 bg-repeat-x opacity-60 ${className}`}
      style={{ backgroundImage: star, backgroundSize: '26px 12px' }}
    />
  );
}
