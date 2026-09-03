import Link from 'next/link';

/** Compact contact CTA used in place of a conventional footer. */
export function PageFooter() {
  return (
    <footer id="contact" className="-mt-px border-t border-line bg-bg text-text">
      <Link
        href="/contact"
        className="group relative block overflow-hidden"
      >
        <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out group-hover:scale-x-100" />
        <span className="relative z-10 grid min-h-[220px] grid-cols-[1fr_92px] sm:min-h-[290px] sm:grid-cols-[1fr_150px]">
          <span className="flex items-center overflow-hidden px-5 py-10 sm:px-7">
            <span className="font-display text-[clamp(56px,11vw,164px)] font-semibold uppercase leading-[0.8] tracking-[-0.075em] transition-all duration-500 group-hover:translate-x-3 group-hover:text-accent-ink group-hover:tracking-[-0.065em]">
              Let&apos;s make something
            </span>
          </span>
          <span className="flex items-center justify-center border-l border-line transition-colors duration-500 group-hover:border-accent-ink/45">
            <span className="flex h-14 w-14 items-center justify-center border border-line text-3xl transition-all duration-500 group-hover:-rotate-45 group-hover:border-accent-ink group-hover:text-accent-ink sm:h-20 sm:w-20 sm:text-5xl">
              →
            </span>
          </span>
        </span>
      </Link>
    </footer>
  );
}
