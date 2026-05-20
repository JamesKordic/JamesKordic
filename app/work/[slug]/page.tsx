import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS, getProject, ARTIST } from '@/lib/projects';
import { CaseSection } from '@/components/case-section';
import { ProjectActions } from '@/components/project-actions';

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
  const trackNumber = String(idx + 1).padStart(2, '0');

  return (
    <div>
      {/* HERO — editorial layout */}
      <section
        className="relative px-4 lg:px-8 pt-20 lg:pt-24 pb-12 lg:pb-16 overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${p.themeColor}26 0%, transparent 60%)`,
        }}
      >
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted flex items-center gap-3 mb-6">
          <span>TRACK {trackNumber}</span>
          <span>·</span>
          <span>{p.client.toUpperCase()}</span>
          <span>·</span>
          <span>{p.date}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-end">
          {/* Big title */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <h1 className="display-bleed font-display font-light tracking-[-0.035em] leading-[0.88] text-[56px] sm:text-[88px] lg:text-[120px] xl:text-[140px]">
              {p.title}
            </h1>
            <div className="mt-6 max-w-2xl text-[15px] lg:text-[17px] leading-[1.55] text-ink-3 whitespace-pre-line">
              {p.desc}
            </div>
          </div>

          {/* Cover + actions */}
          <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col items-start lg:items-end gap-4">
            <div className="w-full max-w-[280px] aspect-[4/5] relative overflow-hidden bg-paper-3 shadow-[0_20px_60px_-20px_rgba(26,20,16,0.4)]">
              <Image
                src={p.cover}
                alt={`${p.title} cover`}
                fill
                sizes="280px"
                priority
                className="object-cover"
              />
            </div>
            <ProjectActions id={p.id} />
          </div>
        </div>
      </section>

      {/* META STRIP — like vinyl liner notes */}
      <section className="px-4 lg:px-8 border-y border-ink/15 bg-paper-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 py-6">
          <MetaItem label="Client" value={p.client} />
          <MetaItem label="Date" value={p.date} />
          <MetaItem label="Role" value={p.role} />
          <MetaItem label="Disciplines" value={p.tags.join(' / ')} />
        </div>
      </section>

      {/* CASE STUDY SECTIONS */}
      <div className="px-4 lg:px-8 pt-12 pb-12">
        {p.sections.map((sec, i) => (
          <CaseSection key={i} section={sec} index={i} total={p.sections.length} />
        ))}
      </div>

      {/* PREV / NEXT */}
      <section className="px-4 lg:px-8 pb-12">
        <div className="border-t border-ink/15 grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/15">
          <Link
            href={`/work/${prev.id}`}
            className="bg-paper hover:bg-paper-2 transition-colors p-6 group"
          >
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-3">
              ← Previous
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 flex-none overflow-hidden bg-paper-3 relative">
                <Image src={prev.cover} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold text-[20px] tracking-[-0.01em] leading-tight truncate group-hover:text-coral transition-colors">
                  {prev.title}
                </div>
                <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted mt-1">
                  {prev.tags[0]}
                </div>
              </div>
            </div>
          </Link>
          <Link
            href={`/work/${next.id}`}
            className="bg-paper hover:bg-paper-2 transition-colors p-6 group sm:text-right"
          >
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-3">
              Next →
            </div>
            <div className="flex items-center gap-4 sm:flex-row-reverse">
              <div className="w-16 h-20 flex-none overflow-hidden bg-paper-3 relative">
                <Image src={next.cover} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold text-[20px] tracking-[-0.01em] leading-tight truncate group-hover:text-coral transition-colors">
                  {next.title}
                </div>
                <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted mt-1">
                  {next.tags[0]}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Back to catalog */}
      <div className="text-center pb-12">
        <Link
          href="/"
          className="inline-block font-mono text-[11px] tracking-[0.2em] uppercase link-underline"
        >
          ← Back to catalog
        </Link>
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted mb-2">
        {label}
      </div>
      <div className="font-display font-medium text-[16px] lg:text-[18px] tracking-[-0.01em] leading-tight">
        {value}
      </div>
    </div>
  );
}
