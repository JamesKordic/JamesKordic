import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS, getProject, ARTIST } from '@/lib/projects';
import { CaseSection } from '@/components/case-section';

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
    <div>
      {/* Hero */}
      <header className="relative flex flex-col lg:flex-row items-start lg:items-end gap-5 lg:gap-8 px-6 lg:px-10 pt-20 lg:pt-24 pb-10 lg:pb-12 overflow-hidden">
        {/* Per-project mesh gradient backdrop (uses themeColor) */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background: `radial-gradient(ellipse at 15% 20%, ${p.themeColor}77 0%, transparent 50%), radial-gradient(ellipse at 85% 30%, rgba(34,211,238,0.25) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(139,92,246,0.20) 0%, transparent 60%), linear-gradient(180deg, ${p.themeColor}22 0%, transparent 80%)`,
          }}
        />
        <div className="relative z-10 w-[170px] h-[170px] lg:w-[226px] lg:h-[226px] flex-none rounded-lg overflow-hidden shadow-[0_24px_50px_-14px_rgba(0,0,0,0.8)] bg-panel-2">
          {/* If the project has a coverVideo, render it on top of the
              cover image. The image still loads first (acts as a poster)
              so there's never an empty box. The video is muted + looped
              + autoplay — silent ambient hero, not interactive. */}
          <Image src={p.cover} alt={`${p.title} cover`} fill sizes="226px" className="object-cover" priority />
          {p.coverVideo && (
            <video
              src={p.coverVideo}
              poster={p.cover}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={`${p.title} cover video`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>
        <div className="relative z-10 min-w-0 flex-1">
          <div className="text-[12px] font-bold tracking-[0.05em] uppercase">
            Case Study · {p.tags[0]}
          </div>
          <h1 className="font-display font-extrabold leading-[0.96] tracking-[-0.03em] mt-4 mb-5 text-[38px] sm:text-[56px] lg:text-[76px]">
            {p.title}
          </h1>
          <div className="flex items-center gap-[7px] flex-wrap text-[13.5px] font-medium">
            <span className="font-bold">{ARTIST}</span>
            <span className="w-1 h-1 rounded-full bg-muted inline-block" />
            <span>{p.blurb}</span>
            <span className="w-1 h-1 rounded-full bg-muted inline-block" />
            <span className="text-muted">{p.year}</span>
            <span className="w-1 h-1 rounded-full bg-muted inline-block" />
            <span className="text-muted">
              {p.sections.length} section{p.sections.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </header>

      <div className="px-6 lg:px-10 pb-10">
        {/* Overview */}
        <section className="pt-2 pb-10 lg:pb-12 border-b border-line">
          <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-muted-2 mb-4">
            Overview
          </div>
          <p className="text-[17px] leading-[1.65] text-[#e2dfd6] max-w-[760px] whitespace-pre-line">
            {p.desc}
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
            className="bg-panel rounded-[9px] px-5 py-[18px] flex items-center gap-[14px] hover:bg-elev transition-colors"
          >
            <div className="w-[60px] h-[60px] rounded-[5px] overflow-hidden flex-none bg-panel-2 relative">
              <Image src={prev.cover} alt="" fill sizes="60px" className="object-cover" />
            </div>
            <div>
              <div className="text-[11px] tracking-[0.1em] uppercase text-muted-2">
                Previous Project
              </div>
              <div className="font-display font-bold text-[17px] tracking-[-0.01em] mt-[3px]">
                {prev.title}
              </div>
            </div>
          </Link>
          <Link
            href={`/work/${next.id}`}
            className="bg-panel rounded-[9px] px-5 py-[18px] flex items-center gap-[14px] hover:bg-elev transition-colors sm:flex-row-reverse sm:text-right"
          >
            <div className="w-[60px] h-[60px] rounded-[5px] overflow-hidden flex-none bg-panel-2 relative">
              <Image src={next.cover} alt="" fill sizes="60px" className="object-cover" />
            </div>
            <div>
              <div className="text-[11px] tracking-[0.1em] uppercase text-muted-2">
                Next Project
              </div>
              <div className="font-display font-bold text-[17px] tracking-[-0.01em] mt-[3px]">
                {next.title}
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center pt-12 pb-6">
          <Link
            href="/"
            className="font-bold text-[13px] tracking-[0.04em] uppercase border-[1.5px] border-[#5a5a5e] hover:border-text rounded-[30px] px-[18px] py-[9px] hover:scale-[1.04] inline-block transition-all"
          >
            ← Back to All Works
          </Link>
        </div>
      </div>
    </div>
  );
}
