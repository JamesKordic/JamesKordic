import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS, getProject, ARTIST } from '@/lib/projects';
import { CaseSection } from '@/components/case-section';
import { ProjectSwitcher } from '@/components/project-switcher';
import { ProjectSidebar } from '@/components/project-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { deWidow } from '@/lib/typography';

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getProject(params.slug);
  if (!p) return {};
  return {
    title: `${p.title} — ${ARTIST}`,
    description: p.desc.slice(0, 160),
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const p = getProject(params.slug);
  if (!p) notFound();

  const idx = PROJECTS.findIndex((x) => x.id === p.id);
  const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <SiteHeader />

      {/* Split screen — menu takes the left quarter, the work the right
          three quarters, edge to edge. Stacks to one column below lg. */}
      <div className="flex-1 lg:grid lg:grid-cols-[1fr_3fr]">
        {/* Always-open project menu — sticky within its full-height column */}
        <ProjectSidebar currentId={p.id} />

        {/* The work — min-w-0 so wide media (carousels) can't blow the grid open */}
        <div className="view-anim min-w-0 px-6 py-10 sm:px-8 lg:py-12">
      {/* Floating switcher — the mobile stand-in for the sidebar */}
      <ProjectSwitcher currentId={p.id} />

      {/* Back — the sidebar carries this link from lg up */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-accent transition-colors mb-9 lg:hidden"
      >
        ← All work
      </Link>

      {/* Hero */}
      <header className="pb-10 border-b border-line">
        <h1 className="font-display font-semibold text-[clamp(38px,5.5vw,76px)] leading-[1.04] tracking-[-0.025em] mb-5">
          {p.title}
        </h1>
        <div className="text-[15px] text-text font-medium">{p.blurb}</div>
      </header>

      {/* Overview — centered between the header hairline and its own hairline */}
      <section className="py-14 lg:py-16 border-b border-line">
        <h2 className="font-display font-normal text-[clamp(26px,3.5vw,40px)] tracking-[-0.5px] leading-[1.08] mb-6">
          Overview
        </h2>
        <p className="text-[17px] leading-[1.7] text-text/85 max-w-[760px] whitespace-pre-line">
          {deWidow(p.desc)}
        </p>
      </section>

      {/* Case study sections */}
      {p.sections.map((sec, i) => (
        <CaseSection key={i} section={sec} index={i} />
      ))}

      {/* Prev / Next */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-14">
        <Link
          href={`/work/${prev.id}`}
          className="group flex items-center gap-4 border border-line px-5 py-4 hover:border-accent transition-colors"
        >
          <div className="w-[60px] h-[60px] overflow-hidden flex-none bg-panel-2 relative">
            <Image src={prev.cover} alt="" fill sizes="60px" className="object-cover" />
          </div>
          <div>
            <div className="text-[11px] tracking-[0.1em] uppercase text-muted-2">Previous</div>
            <div className="font-display text-[18px] mt-0.5 group-hover:text-accent transition-colors">
              {prev.title}
            </div>
          </div>
        </Link>
        <Link
          href={`/work/${next.id}`}
          className="group flex items-center gap-4 border border-line px-5 py-4 hover:border-accent transition-colors sm:flex-row-reverse sm:text-right"
        >
          <div className="w-[60px] h-[60px] overflow-hidden flex-none bg-panel-2 relative">
            <Image src={next.cover} alt="" fill sizes="60px" className="object-cover" />
          </div>
          <div>
            <div className="text-[11px] tracking-[0.1em] uppercase text-muted-2">Next</div>
            <div className="font-display text-[18px] mt-0.5 group-hover:text-accent transition-colors">
              {next.title}
            </div>
          </div>
        </Link>
      </div>

      <div className="pt-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] font-semibold border border-text rounded-full px-5 py-2.5 hover:bg-text hover:text-bg transition-colors"
        >
          ← Back to all work
        </Link>
      </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
