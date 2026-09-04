import { HomeProjectIndex } from '@/components/home-project-index';
import { HomeVideoCarousel } from '@/components/home-video-carousel';
import { PageFooter } from '@/components/page-footer';
import { SiteHeader } from '@/components/site-header';
import { PROJECTS } from '@/lib/projects';

/** Home — featured motion followed by the complete project index. */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-[15px] leading-[1.45] text-text sm:text-[17px]">
      <SiteHeader />

      <main>
        <HomeVideoCarousel projects={PROJECTS.filter((project) => project.coverVideo)} />
        <section id="work" className="scroll-mt-[60px]">
          <HomeProjectIndex projects={PROJECTS} />
        </section>
      </main>

      <PageFooter />
    </div>
  );
}
