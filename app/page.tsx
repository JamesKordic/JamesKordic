import { HomeReel } from '@/components/home-reel';
import { HomeWorkGrid } from '@/components/home-work-grid';
import { PageFooter } from '@/components/page-footer';
import { SiteHeader } from '@/components/site-header';
import { PROJECTS } from '@/lib/projects';

/** Home — one line about the work, the reel, then the projects. */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-[17px] leading-[1.6] text-text">
      <SiteHeader />

      <main className="w-full px-5 sm:px-8">
        <section className="pb-9 pt-16">
          <h1 className="max-w-[26ch] text-[clamp(30px,4.6vw,64px)] font-medium leading-[1.12] tracking-[-0.025em]">
            Graphic &amp; motion designer{' '}
            <span className="text-muted">
              — campaigns, social &amp; identity for music, entertainment, food &amp; tech.
            </span>
          </h1>
        </section>

        <HomeReel projects={PROJECTS.filter((p) => p.carouselVideo ?? p.coverVideo)} />

        <section id="work" className="scroll-mt-20">
          <h2 className="mb-5 mt-[72px] text-[15px] font-medium text-muted">Selected work</h2>
          <HomeWorkGrid projects={PROJECTS} />
        </section>
      </main>

      <PageFooter />
    </div>
  );
}
