import Link from 'next/link';
import { PROJECTS } from '@/lib/projects';
import { SiteHeader } from '@/components/site-header';
import { HomeVideoCarousel } from '@/components/home-video-carousel';

/** Home — a full-viewport moving project introduction. */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-[15px] leading-[1.45] text-text sm:text-[17px]">
      <SiteHeader />

      <HomeVideoCarousel projects={PROJECTS.filter((project) => project.coverVideo)} />

      <Link
        href="/work"
        className="group relative block overflow-hidden border-b border-line"
      >
        <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out group-hover:scale-x-100" />
        <span className="relative z-10 grid min-h-[220px] grid-cols-[1fr_92px] sm:min-h-[290px] sm:grid-cols-[1fr_150px]">
          <span className="flex items-center overflow-hidden px-5 py-10 sm:px-7">
            <span className="font-display text-[clamp(54px,11vw,170px)] font-semibold uppercase leading-[0.74] tracking-[-0.085em] transition-all duration-500 group-hover:translate-x-3 group-hover:text-accent-ink group-hover:tracking-[-0.065em]">
              See All Work
            </span>
          </span>
          <span className="flex items-center justify-center border-l border-line transition-colors duration-500 group-hover:border-accent-ink/45">
            <span className="flex h-14 w-14 items-center justify-center border border-line text-3xl transition-all duration-500 group-hover:-rotate-45 group-hover:border-accent-ink group-hover:text-accent-ink sm:h-20 sm:w-20 sm:text-5xl">
              →
            </span>
          </span>
        </span>
      </Link>
    </div>
  );
}
