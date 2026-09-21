import { HomeReel } from '@/components/home-reel';
import { HomeWorkGrid } from '@/components/home-work-grid';
import { PageFooter } from '@/components/page-footer';
import { SiteHeader } from '@/components/site-header';
import { PROJECTS } from '@/lib/projects';
import { BLOCK_PB, BLOCK_PT, GUTTER_X, SECTION_T } from '@/lib/spacing';

/** Home — one line about the work, the reel, then the projects. */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-[17px] leading-[1.6] text-text">
      <SiteHeader />

      <main className={`w-full ${GUTTER_X}`}>
        <section className={`${BLOCK_PT} ${BLOCK_PB}`}>
          <h1 className="max-w-[24ch] text-[clamp(30px,4.6vw,64px)] font-medium leading-[1.12] tracking-[-0.025em]">
            James Kordic is a Graphic &amp; Motion Designer based in NYC.
          </h1>
        </section>

        <HomeReel projects={PROJECTS.filter((p) => p.carouselVideo ?? p.coverVideo)} />

        <section id="work" className={`${SECTION_T} scroll-mt-24`}>
          <HomeWorkGrid projects={PROJECTS} />
        </section>
      </main>

      <PageFooter />
    </div>
  );
}
