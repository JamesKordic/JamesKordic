import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PROJECTS, getProject, ARTIST } from '@/lib/projects';
import { SITE_TEXT } from '@/lib/site-text';
import { AboutProject } from '@/components/about-project';
import { CaseSection } from '@/components/case-section';
import { ProjectHeader } from '@/components/project-header';
import { PageFooter } from '@/components/page-footer';
import { StarRule } from '@/components/star-rule';
import { deWidow } from '@/lib/typography';
import { HEADING, LABEL } from '@/lib/ui';

const T = SITE_TEXT;

/** Challenge, Goal, and Results are held back until their copy is written.
 *  The data behind them is untouched in `projects.ts` — flip this to true and
 *  all three fill in from the same fields as before. */
const SHOW_FULL_STORY = false;

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

/**
 * Project page — a case study read top to bottom: the project named over its
 * headline, its write-up folded away behind a toggle, a full-width hero, the
 * work itself, and the projects either side.
 *
 * Not every project carries every part — `brief`, `approach`, and `recap` are
 * optional in the data, and a project with only sections still reads as a
 * complete page.
 */
export default function ProjectPage({ params }: { params: { slug: string } }) {
  const p = getProject(params.slug);
  if (!p) notFound();

  const idx = PROJECTS.findIndex((x) => x.id === p.id);
  const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  /* Credits — one line per value, the way a colophon lists them. Several
   * projects leave fields blank, so a label with nothing behind it is left
   * out rather than printed empty. */
  const lines = (value: string) =>
    value
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);

  const credits = [
    { label: 'Client', values: lines(p.client) },
    // Industry reads as one phrase rather than a list, so it isn't split.
    { label: 'Industry', values: p.industry ? [p.industry] : [] },
    { label: 'Deliverables', values: p.tags },
    { label: 'Role', values: lines(p.role) },
    { label: 'Team', values: p.team ?? [] },
  ].filter((c) => c.values.length);

  /* The narrative, in the order it should be read. Each entry is a heading and
   * the paragraphs under it; anything the project doesn't carry drops out. */
  /* The write-up, in the order it should be read. Four fixed headings —
   * what the project was, what stood in the way, what it set out to do, and
   * what came of it — each filled from the field that answers it. A project
   * missing one of those fields simply drops that heading. */
  type Part = { heading: string; body: string[]; bullets?: string[] };

  const story: Part[] = [
    { heading: 'Overview', body: [p.desc] },
    ...(SHOW_FULL_STORY && p.brief
      ? [{ heading: 'Challenge', body: [p.brief.lead, ...p.brief.body] }]
      : []),
    ...(SHOW_FULL_STORY && p.approach
      ? [
          {
            heading: 'Goal',
            body: [p.approach.intro],
            bullets: p.approach.steps.map((step) => `${step.title} — ${step.body}`),
          },
        ]
      : []),
    ...(SHOW_FULL_STORY && p.recap
      ? [
          {
            heading: 'Results',
            body: [p.recap.headline],
            bullets: p.recap.stats.map((stat) =>
              [stat.value, stat.unit, stat.label].filter(Boolean).join(' ')
            ),
          },
        ]
      : []),
    // A heading with nothing written under it is dropped, so a half-filled
    // project never shows a bare label.
  ].filter((part) => part.body.some((t) => t.trim()) || part.bullets?.length);

  return (
    <div className="min-h-screen bg-bg text-[15px] leading-[1.45] text-text sm:text-[17px]">
      <ProjectHeader />

      {/* Tucked between the header and the title with the same air on both
          sides; everything below moves up with it. */}
      {/* Flush under the header, then the page's usual gap below — trimmed by
          the 5.5px the title's own line box adds above its capitals, so the
          band reads even against the tighter gap under the disciplines line
          rather than merely measuring even. */}
      <StarRule className="mb-[37px] mt-0 lg:mb-[42px]" />

      {/* Title — the project named above the line that says what it was. The
          rule's margin sets the space above it, so its own padding only has to
          match that underneath. */}
      <div className="px-5 pb-10 sm:px-7 lg:pb-12">
        <h1 className="max-w-[22ch] text-[clamp(28px,3.6vw,46px)] leading-[1.08] tracking-[-0.03em]">
          {/* The project's name carries the line; what it was reads quieter
              beneath it. */}
          <span className="block">{p.title}</span>
          <span className="text-muted-2">{p.blurb}</span>
        </h1>

        <div className="pt-8 lg:pt-10">
          <AboutProject disciplines={p.tags.join(' · ')}>
            {/* Credits pinned to the left while the story runs beside them. */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[22%_1fr] lg:gap-10">
              <dl className="space-y-5 self-start lg:sticky lg:top-8">
                {credits.map((c) => (
                  <div key={c.label}>
                    <dt className={LABEL}>{c.label}</dt>
                    {c.values.map((value) => (
                      <dd key={value}>{value}</dd>
                    ))}
                  </div>
                ))}
              </dl>

              <div className="max-w-[640px] space-y-10">
                {story.map((part) => (
                  <div key={part.heading} className="space-y-4">
                    <h2 className={HEADING}>{part.heading}</h2>
                    {part.body.map((text, i) => (
                      <p key={i} className={i === 0 ? undefined : 'text-muted'}>
                        {deWidow(text)}
                      </p>
                    ))}
                    {part.bullets && (
                      <ul className="space-y-1 text-muted">
                        {part.bullets.map((line) => (
                          <li key={line}>• {deWidow(line)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </AboutProject>
        </div>
      </div>

      {/* Hero — the project's own cover, full width. */}
      <div className="px-5 sm:px-7">
        {/* `heroImage` wins over `coverVideo`: a project that names a still
            for its hero means it, and the video stays the thumbnail. */}
        <div className="relative aspect-[16/9] overflow-hidden bg-panel-2">
          {!p.heroImage && p.coverVideo ? (
            <video
              src={p.coverVideo}
              poster={p.cover}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.heroImage ?? p.cover}
              alt={p.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      {/* The work itself — unlabelled; the sections speak for it. Its own
          padding would stack on top of the first section's, leaving a gap over
          the opening text that no other text block has. */}
      <section>
        {p.sections.map((sec, i) => (
          <CaseSection key={i} section={sec} hideText={p.hideSectionText} />
        ))}
      </section>

      <StarRule className="my-10 sm:my-12" />

      {/* The way on in both directions — back to the previous project on the
          left, forward to the next on the right. */}
      <nav className="flex items-start justify-between gap-6 px-5 sm:px-7">
        <Link href={`/work/${prev.id}`} className="group/prev">
          <span className={`${LABEL} block`}>Previous project</span>
          <span className="mt-2 block text-[clamp(28px,3.6vw,46px)] leading-[1.08] tracking-[-0.03em] transition-colors group-hover/prev:text-accent">
            {prev.title}
          </span>
        </Link>

        <Link href={`/work/${next.id}`} className="group/next text-right">
          <span className={`${LABEL} block`}>Next project</span>
          <span className="mt-2 block text-[clamp(28px,3.6vw,46px)] leading-[1.08] tracking-[-0.03em] transition-colors group-hover/next:text-accent">
            {next.title}
          </span>
        </Link>
      </nav>

      <PageFooter />
    </div>
  );
}
