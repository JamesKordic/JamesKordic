import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS, getProject, ARTIST } from '@/lib/projects';
import { CaseSection } from '@/components/case-section';
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

  // Credits grid — only columns that actually have content, so projects
  // without a named client/role don't leave empty cells.
  const credits: { label: string; items: string[] }[] = [
    p.client && { label: 'Client', items: [p.client] },
    p.role && { label: 'Role', items: p.role.split(',').map((s) => s.trim()) },
    p.year && { label: 'Year', items: [p.year] },
    p.tags.length > 0 && { label: 'Disciplines', items: p.tags },
  ].filter(Boolean) as { label: string; items: string[] }[];

  return (
    <article className="mx-auto max-w-[1200px]">
      {/* Breadcrumb */}
      <p className="px-6 pt-5 text-[14px] font-medium text-muted">
        <Link href="/" className="hover:text-accent transition-colors">
          ← Work
        </Link>
        <span className="px-2">/</span>
        {p.tags.join(' · ')}
      </p>

      {/* Title + lede */}
      <section className="grid grid-cols-1 items-end gap-7 border-b border-line px-6 pb-14 pt-9 md:grid-cols-[1.6fr_1fr] md:gap-12">
        <h1 className="max-w-[14ch] text-[clamp(34px,5.4vw,76px)] font-semibold leading-[1.02] tracking-[-0.03em]">
          {p.title}
        </h1>
        <div className="text-[clamp(16px,1.5vw,20px)] leading-[1.45]">
          <span className="mb-3 block text-[12px] uppercase tracking-[0.09em] text-muted">
            About the project
          </span>
          {deWidow(p.blurb)}
        </div>
      </section>

      {/* Media sequence — full-bleed; reading blocks stay centered within. */}
      <div>
        {/* Hero — full-bleed cover */}
        <div className="relative aspect-[16/9] overflow-hidden bg-panel-2">
          <Image
            src={p.cover}
            alt={`${p.title} cover`}
            fill
            sizes="(max-width:1400px) 100vw, 1400px"
            className="object-cover"
            priority
          />
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
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>

        {/* Opening pull-quote — drawn from the brief, when present */}
        {p.brief?.lead && <PullQuote>{p.brief.lead}</PullQuote>}

        {/* Overview prose */}
        <div className="mx-auto max-w-[720px] px-6 py-6">
          <h3 className="mb-3.5 mt-0 text-[13px] uppercase tracking-[0.09em] text-accent">
            Overview
          </h3>
          <p className="whitespace-pre-line text-[17px] leading-[1.65] text-text/85">
            {deWidow(p.desc)}
          </p>
        </div>

        {/* Case-study sections (the real project media) */}
        <div className="px-6">
          {p.sections.map((sec, i) => (
            <CaseSection key={i} section={sec} index={i} />
          ))}
        </div>

        {/* Closing pull-quote — the recap headline, when present */}
        {p.recap?.headline && <PullQuote>{p.recap.headline}</PullQuote>}
      </div>

      {/* Credits */}
      <section className="mt-16 grid grid-cols-2 gap-8 border-t border-line px-6 py-12 md:grid-cols-4">
        {credits.map((c) => (
          <div key={c.label}>
            <h4 className="mb-3.5 text-[12px] uppercase tracking-[0.09em] text-muted">
              {c.label}
            </h4>
            <ul>
              {c.items.map((item) => (
                <li key={item} className="py-[3px] text-[15px] font-medium">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Prev / Next */}
      <nav className="grid grid-cols-1 border-t border-line sm:grid-cols-2">
        <Link
          href={`/work/${prev.id}`}
          className="group flex flex-col gap-2 px-6 py-12 transition-colors hover:bg-[#fafafa]"
        >
          <span className="text-[12px] uppercase tracking-[0.09em] text-muted">
            Previous
          </span>
          <span className="text-[clamp(22px,2.6vw,34px)] font-semibold tracking-[-0.02em] transition-colors group-hover:text-accent">
            {prev.title}
          </span>
        </Link>
        <Link
          href={`/work/${next.id}`}
          className="group flex flex-col gap-2 border-t border-line px-6 py-12 transition-colors hover:bg-[#fafafa] sm:items-end sm:border-l sm:border-t-0 sm:text-right"
        >
          <span className="text-[12px] uppercase tracking-[0.09em] text-muted">
            Next
          </span>
          <span className="text-[clamp(22px,2.6vw,34px)] font-semibold tracking-[-0.02em] transition-colors group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      </nav>
    </article>
  );
}

/**
 * Oversized editorial pull-quote with accent quotation marks, centered in a
 * 1000px measure. Mirrors the reference's `.quote` block.
 */
function PullQuote({ children }: { children: string }) {
  return (
    <blockquote className="mx-auto max-w-[1000px] px-6 py-[72px]">
      <p className="text-[clamp(24px,3.2vw,42px)] font-semibold leading-[1.12] tracking-[-0.02em]">
        <span className="text-accent">“</span>
        {deWidow(children)}
        <span className="text-accent">”</span>
      </p>
    </blockquote>
  );
}
