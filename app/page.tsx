import { HomeIndex } from '@/components/home-index';
import { HomeReel } from '@/components/home-reel';
import { PageFooter } from '@/components/page-footer';
import { SiteHeader } from '@/components/site-header';
import { PROJECTS } from '@/lib/projects';
import { GUTTER_X, LABEL, SECTION_PT } from '@/lib/spacing';
import { HERO } from '@/lib/type';

/**
 * Home — dark and cinematic. The reel fills the first screen with the one
 * line about the work set over it, then the projects run as an index: one
 * large row each, the cover floating beside the cursor on hover.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-[17px] leading-[1.6] text-text">
      <SiteHeader />

      {/* Starts below the header rather than running under it. */}
      <section className="relative aspect-[4/3] overflow-hidden sm:aspect-auto sm:h-[min(84svh,56.25vw)]">
        <HomeReel
          projects={PROJECTS.filter((p) => p.carouselVideo ?? p.coverVideo)}
          className="absolute inset-0 overflow-hidden bg-[#111]"
        />
        {/* Darkens the foot of the frame for the headline and fades the video
            into the page below. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-bg/30"
        />

      </section>

      <main className={`w-full ${GUTTER_X}`}>
        {/* The headline crosses the foot of the reel: the first line sits
            over the video, the second carries on past its bottom edge. It
            lives outside the reel because that section clips its contents.
            The 1.6em lift is what keeps the second line clear of the fold on
            a short laptop window — below the reel there is only about
            (16% of the window height - 65px) to play with. */}
        {/* The cue sits on the headline's last line, so the two share a
            baseline across the width of the page. Hidden on phones, where
            there's no room beside the headline and the work is already in
            view below the reel. */}
        {/* The lift lives on the headline, not this row: `em` here would
            resolve against the 17px body size instead of the headline's. */}
        <div className="relative z-10 flex items-end justify-between gap-8">
          <h1 className={`-mt-[1.6em] max-w-[30ch] text-white ${HERO}`}>
            James Kordic is a Graphic &amp; Motion Designer based in NYC.
          </h1>

          <a
            href="#work"
            className="hidden shrink-0 items-center gap-2 pb-[0.18em] text-[13px] text-white/70 transition-colors hover:text-white sm:flex"
          >
            Scroll down
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="scroll-cue-arrow h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2.5v11M3.5 9 8 13.5 12.5 9" />
            </svg>
          </a>
        </div>

        <section id="work" aria-labelledby="selected-works" className={`scroll-mt-24 ${SECTION_PT}`}>
          <h2 id="selected-works" className={`pb-5 ${LABEL}`}>
            Selected Works
          </h2>

          <HomeIndex projects={PROJECTS} />
        </section>
      </main>

      <PageFooter />
    </div>
  );
}
