import { HomeProjectIndex } from '@/components/home-project-index';
import { PageFooter } from '@/components/page-footer';
import { SiteHeader } from '@/components/site-header';
import { PROJECTS } from '@/lib/projects';

/** Work — the complete project index, separated from the carousel homepage. */
export default function WorkPage() {
  return (
    <div className="min-h-screen bg-bg text-[15px] leading-[1.45] text-text sm:text-[17px]">
      <SiteHeader />

      <main>
        <div className="px-5 py-10 sm:px-7 sm:py-14 lg:py-16">
          <h1 className="font-display text-[clamp(56px,11vw,164px)] font-semibold uppercase leading-[0.8] tracking-[-0.075em]">
            Selected Works
          </h1>
        </div>
        <HomeProjectIndex projects={PROJECTS} />
      </main>

      <PageFooter />
    </div>
  );
}
