import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PROJECTS, getProject, ARTIST, type Project, type Section } from '@/lib/projects';
import { CaseSection } from '@/components/case-section';
import { SiteHeader } from '@/components/site-header';
import { PageFooter } from '@/components/page-footer';
import { LABEL } from '@/lib/ui';

type ProjectDetail = {
  agency?: string;
  tools: string[];
  contribution: string;
};

const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  'guns-n-roses': {
    agency: 'The Syndicate',
    tools: ['After Effects', 'Photoshop', 'Premiere Pro'],
    contribution:
      "I edited dynamic, platform-ready social videos and created promotional motion graphics, blending pacing, visual energy, and storytelling to amplify the band's presence and deepen fan engagement. My work also included sourcing and editing clips from live performances, adding captions to reels, and polishing existing edits. Whether the content promoted a tour or celebrated a milestone, the goal was always the same: build excitement and keep fans coming back.",
  },
  'taco-bell': {
    agency: 'The Syndicate',
    tools: ['After Effects', 'Photoshop', 'Illustrator'],
    contribution:
      "Working within Taco Bell's Feed The Beat brand system, I designed lineup promotional assets and built reusable vertical templates that could flex across dozens of artists. I sourced and placed artist photography, adapted color and typography to each release, animated motion pieces, and prepared platform-ready exports. The goal was to keep every post distinct to the artist while making the full campaign feel cohesive at scroll speed.",
  },
  adults: {
    agency: 'The Syndicate',
    tools: ['After Effects', 'Photoshop', 'Illustrator'],
    contribution:
      "Working directly within the show's brand system alongside Sarah Whitty and Molly Brooks, I designed event creative across physical and digital touchpoints. I also played a key role in production—setting up files, applying finishing touches, assembling pre-production materials, and preparing stakeholder-ready deliverables.",
  },
  'the-syndicate': {
    tools: ['After Effects', 'Photoshop', 'Illustrator'],
    contribution:
      'Working alongside the creative team, I designed and animated assets for clients including MNRK Heavy, Consensus by CoinDesk, Craig Ferguson, Indie Week, and Killphonic Records. My work included editing social clips, building modular campaign systems, creating speaker and sponsor graphics, adapting assets across platforms, and preparing files for production. I often took projects from rough content through polished, ready-to-publish deliverables.',
  },
  wwimf: {
    tools: ['After Effects', 'Illustrator', 'Photoshop', 'Figma'],
    contribution:
      'I led every part of the project from concept through final exhibition. I developed the strategy and visual identity, designed stage environments and participatory interactions, created the campaign and motion system, produced merchandise and physical touchpoints, and brought the full experience together for the 2025 RIT Graphic Design Capstone Show. The goal was to make a fictional festival feel detailed, cohesive, and believable enough to exist.',
  },
  consensus: {
    agency: 'The Syndicate',
    tools: ['After Effects', 'Photoshop', 'Illustrator'],
    contribution:
      'Created modular motion assets adapting the conference identity across speakers, dates, sponsors, locations, and programming.',
  },
  voltage: {
    tools: ['Blender', 'After Effects', 'Photoshop', 'Illustrator'],
    contribution:
      'Built a beverage brand from the naming and circuit-board identity through packaging, 3D product visualization, motion, and campaign applications.',
  },
  'mnrk-heavy': {
    agency: 'The Syndicate',
    tools: ['After Effects', 'Photoshop', 'Illustrator'],
    contribution:
      'Built a flexible social toolkit that translated each artist’s release artwork into label-consistent announcements, platform variants, and motion pieces.',
  },
};

function limitSection(section: Section, limit = 6): Section {
  if (section.layout?.type !== 'mixed') {
    return { ...section, media: section.media.slice(0, limit) };
  }

  let remaining = limit;
  const rows = section.layout.rows
    .map((row) => {
      const media = row.media.slice(0, remaining);
      remaining -= media.length;
      return { ...row, media };
    })
    .filter((row) => row.media.length);

  return { ...section, layout: { ...section.layout, rows } };
}

function editorialSections(project: Project): { visible: Section[]; archive: Section[] } {
  if (project.id === 'taco-bell') {
    const [lineup, firstSet, secondSet, thirdSet, ...rest] = project.sections;
    const featuredSet: Section = {
      ...firstSet,
      media: [firstSet.media[14], secondSet.media[2], thirdSet.media[0]],
      layout: { type: 'uniform', cols: 3, aspect: '9/16' },
    };
    const archivedFirstSet: Section = {
      ...firstSet,
      title: 'Additional Artist Executions',
      media: firstSet.media.filter((_, index) => index !== 14),
    };
    const archivedSecondSet: Section = {
      ...secondSet,
      media: secondSet.media.filter((_, index) => index !== 2),
    };
    const archivedThirdSet: Section = {
      ...thirdSet,
      media: thirdSet.media.slice(1),
    };

    return {
      visible: [limitSection(lineup, 3), featuredSet],
      archive: [archivedFirstSet, archivedSecondSet, archivedThirdSet, ...rest],
    };
  }

  if (project.id === 'adults') {
    const [campaignFilm, eventPhotography, ...campaignArchive] = project.sections;

    return {
      visible: [campaignFilm, eventPhotography],
      archive: campaignArchive,
    };
  }

  let sections = project.sections.map((section) => (
    project.id === 'guns-n-roses' ? section : limitSection(section)
  ));
  if (project.id === 'the-syndicate') {
    const removedItems = new Set([
      6, 7, 8, 9, 10, 11, 12, 13, 14,
      21, 22, 23, 24,
      27, 30, 32, 34, 35,
    ]);
    let itemNumber = 0;

    sections = sections
      .map((section) => {
        if (section.layout?.type === 'mixed') {
          const rows = section.layout.rows
            .map((row) => ({
              ...row,
              media: row.media.filter(() => {
                itemNumber += 1;
                return !removedItems.has(itemNumber);
              }),
            }))
            .filter((row) => row.media.length > 0);

          return { ...section, layout: { ...section.layout, rows } };
        }

        return {
          ...section,
          media: section.media.filter(() => {
            itemNumber += 1;
            return !removedItems.has(itemNumber);
          }),
        };
      })
      .filter((section) => (
        section.layout?.type === 'mixed'
          ? section.layout.rows.some((row) => row.media.length > 0)
          : section.media.length > 0
      ));

    const motionIndex = sections.findIndex((section) => section.title === 'Consensus — Motion Graphics');
    const speakerIndex = sections.findIndex((section) => section.title === 'Consensus — Speaker Announcements');
    if (motionIndex >= 0 && speakerIndex >= 0) {
      sections[motionIndex] = {
        ...sections[motionIndex],
        media: [...sections[motionIndex].media, ...sections[speakerIndex].media],
      };
      sections = sections.filter((_, index) => index !== speakerIndex);
    }

    const craigIndex = sections.findIndex((section) => section.title === 'Craig Ferguson');
    const killphonicIndex = sections.findIndex((section) => section.title === 'Killphonic Records');
    if (craigIndex >= 0 && killphonicIndex >= 0 && craigIndex > killphonicIndex) {
      const [craigSection] = sections.splice(craigIndex, 1);
      sections.splice(killphonicIndex, 0, craigSection);
    }

    if (project.carouselVideo) {
      sections = [
        {
          title: 'The Syndicate Sizzle Reel',
          media: [
            {
              type: 'video',
              src: project.carouselVideo,
              aspect: '16/9',
              poster: '/posters/the-syndicate-sizzle-reel.jpg',
            },
          ],
          layout: { type: 'uniform', cols: 1, aspect: '16/9' },
        },
        ...sections,
      ];
    }
  }

  if (project.id === 'wwimf') {
    const byTitle = new Map(sections.map((section) => [section.title, section]));
    const chapter = (title: string, eyebrow: string) => {
      const section = byTitle.get(title);
      return section ? { ...section, eyebrow } : null;
    };
    const arranged: Array<Section | null> = [
      chapter('Visual Identity', '01 / The System'),
      chapter('Stage Designs', '02 / The Festival'),
      chapter('Interactive Elements', '02 / The Festival'),
      chapter('Instagram Posts', '03 / The Campaign'),
      chapter('Marketing', '03 / The Campaign'),
      chapter('Marketing Visualization', '03 / The Campaign'),
      chapter('Animations', '03 / The Campaign'),
      chapter('Merchandise', '04 / The Experience'),
      chapter('Capstone Show Setup', '04 / The Experience'),
      chapter('WWIMF Book', '04 / The Experience'),
    ];
    sections = arranged.filter((section): section is Section => section !== null);
  }

  return { visible: sections, archive: [] };
}

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
 * headline, its write-up, the work itself, and the projects either side.
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
  const detail = PROJECT_DETAILS[p.id];
  const { visible, archive } = editorialSections(p);
  const summary = p.brief?.lead || p.desc;
  const archiveLabel = p.id === 'adults' ? 'What I worked on' : 'View full campaign archive';

  return (
    <div className="min-h-screen bg-bg text-[15px] leading-[1.45] text-text sm:text-[17px]">
      <SiteHeader />

      <section className="border-b border-line">
        <div className="px-5 py-10 sm:px-7 sm:py-14 lg:py-16">
          <h1 className="max-w-[11ch] font-display text-[clamp(56px,11vw,164px)] font-semibold uppercase leading-[0.8] tracking-[-0.075em]">
            {p.title}
          </h1>
          <p className="mt-6 max-w-[720px] text-[clamp(18px,2.3vw,32px)] leading-[1.18] tracking-[-0.025em] text-muted">
            {p.blurb}{detail.agency ? ` | ${detail.agency}` : ''}
          </p>
        </div>

        <div className="grid border-t border-line lg:grid-cols-2">
          <div className="px-5 py-7 sm:px-7 sm:py-8 lg:pr-12">
            <p className={`${LABEL} mb-2 text-accent`}>Overview</p>
            <p className="max-w-[760px] text-[14px] leading-[1.5] sm:text-[16px]">
              {summary}
            </p>
          </div>
          <div className="border-t border-line px-5 py-7 sm:px-7 sm:py-8 lg:border-l lg:border-t-0 lg:pl-12">
            <p className={`${LABEL} mb-2 text-accent`}>My role</p>
            <p className="max-w-[760px] text-[14px] leading-[1.5] sm:text-[16px]">
              {detail.contribution}
            </p>
          </div>
        </div>
      </section>

      {/* The work itself — unlabelled; the sections speak for it. Its own
          padding would stack on top of the first section's, leaving a gap over
          the opening text that no other text block has. */}
      <section>
        {visible.map((sec, i) => (
          <CaseSection key={i} section={sec} />
        ))}

        {archive.length > 0 && (
          <details className="group/archive mt-10 border-y border-line sm:mt-12">
            <summary className="group/archive-trigger relative grid min-h-[140px] cursor-pointer list-none grid-cols-[1fr_92px] overflow-hidden [&::-webkit-details-marker]:hidden sm:min-h-[180px] sm:grid-cols-[1fr_150px]">
              <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out group-hover/archive-trigger:scale-x-100" />
              <span className="relative z-10 flex items-center overflow-hidden px-5 py-8 sm:px-7">
                <span className="font-display text-[clamp(36px,6vw,88px)] font-semibold uppercase leading-[0.82] tracking-[-0.065em] transition-all duration-500 group-hover/archive-trigger:translate-x-2 group-hover/archive-trigger:text-accent-ink">
                  {archiveLabel}
                </span>
              </span>
              <span className="relative z-10 flex items-center justify-center border-l border-line transition-colors duration-500 group-hover/archive-trigger:border-accent-ink/45">
                <span className="relative flex h-14 w-14 items-center justify-center border border-line transition-all duration-500 group-hover/archive-trigger:rotate-90 group-hover/archive-trigger:border-accent-ink group-hover/archive-trigger:text-accent-ink group-open/archive:rotate-45 sm:h-20 sm:w-20">
                  <span className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 bg-current sm:w-7" />
                  <span className="absolute left-1/2 top-1/2 h-5 w-px -translate-x-1/2 -translate-y-1/2 bg-current sm:h-7" />
                </span>
              </span>
            </summary>
            <div className="border-t border-line pb-10 sm:pb-12">
              {archive.map((sec, i) => (
                <CaseSection key={i} section={sec} />
              ))}
            </div>
          </details>
        )}
      </section>

      {/* The way on in both directions — back to the previous project on the
          left, forward to the next on the right. */}
      <nav className="mt-10 grid border-y border-line sm:mt-12 sm:grid-cols-2">
        <Link
          href={`/work/${prev.id}`}
          className="group/prev relative flex min-h-[240px] flex-col justify-between overflow-hidden border-b border-line px-5 py-6 sm:min-h-[300px] sm:border-b-0 sm:px-7 sm:py-8"
        >
          <span className="absolute inset-0 origin-right scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover/prev:scale-x-100" />
          <span className={`${LABEL} relative z-10 transition-colors group-hover/prev:text-accent-ink`}>
            Previous project
          </span>
          <span className="relative z-10 flex items-end justify-between gap-5">
            <span className="max-w-[10ch] text-[clamp(32px,4.5vw,68px)] font-semibold uppercase leading-[0.86] tracking-[-0.06em] transition-colors group-hover/prev:text-accent-ink">
              {prev.title}
            </span>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-line text-2xl transition-all group-hover/prev:-translate-x-1 group-hover/prev:border-accent-ink group-hover/prev:text-accent-ink sm:h-14 sm:w-14">
              ←
            </span>
          </span>
        </Link>

        <Link
          href={`/work/${next.id}`}
          className="group/next relative flex min-h-[240px] flex-col justify-between overflow-hidden px-5 py-6 text-right sm:min-h-[300px] sm:border-l sm:border-line sm:px-7 sm:py-8"
        >
          <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover/next:scale-x-100" />
          <span className={`${LABEL} relative z-10 transition-colors group-hover/next:text-accent-ink`}>
            Next project
          </span>
          <span className="relative z-10 flex flex-row-reverse items-end justify-between gap-5">
            <span className="max-w-[10ch] text-[clamp(32px,4.5vw,68px)] font-semibold uppercase leading-[0.86] tracking-[-0.06em] transition-colors group-hover/next:text-accent-ink">
              {next.title}
            </span>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-line text-2xl transition-all group-hover/next:translate-x-1 group-hover/next:border-accent-ink group-hover/next:text-accent-ink sm:h-14 sm:w-14">
              →
            </span>
          </span>
        </Link>
      </nav>

      <PageFooter />
    </div>
  );
}
