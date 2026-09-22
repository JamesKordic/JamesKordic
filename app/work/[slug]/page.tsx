import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PROJECTS, getProject, ARTIST, type Project, type Section } from '@/lib/projects';
import { CaseSection } from '@/components/case-section';
import { SiteHeader } from '@/components/site-header';
import { PageFooter } from '@/components/page-footer';
import { SITE_TEXT } from '@/lib/site-text';
import { BLOCK_PT, BLOCK_T, GAP, GUTTER_X, RULE_PY, SECTION_T, STACK, TIGHT } from '@/lib/spacing';

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
    const [campaignFilm, eventPhotography] = project.sections;

    return {
      visible: [campaignFilm, eventPhotography],
      archive: [],
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

    const removedVisibleItems = new Set([
      3, 5, 9, 11, 12, 13, 14, 15, 16, 17, 19,
    ]);
    let visibleItemNumber = 0;

    sections = sections
      .map((section) => {
        if (section.layout?.type === 'mixed') {
          const rows = section.layout.rows
            .map((row) => ({
              ...row,
              media: row.media.filter(() => {
                visibleItemNumber += 1;
                return !removedVisibleItems.has(visibleItemNumber);
              }),
            }))
            .filter((row) => row.media.length > 0);

          return { ...section, layout: { ...section.layout, rows } };
        }

        return {
          ...section,
          media: section.media.filter(() => {
            visibleItemNumber += 1;
            return !removedVisibleItems.has(visibleItemNumber);
          }),
        };
      })
      .filter((section) => (
        section.layout?.type === 'mixed'
          ? section.layout.rows.some((row) => row.media.length > 0)
          : section.media.length > 0
      ));

    const remainingMedia = sections.flatMap((section) => (
      section.layout?.type === 'mixed'
        ? section.layout.rows.flatMap((row) => row.media)
        : section.media
    ));
    const finalPair = remainingMedia.slice(7).map((media, index) => ({
      ...media,
      aspect: index === 0 ? '16/9' as const : '1/1' as const,
    }));
    const socialVideos = remainingMedia.slice(1, 4);
    [socialVideos[0], socialVideos[1]] = [socialVideos[1], socialVideos[0]];

    sections = [
      {
        title: 'The Syndicate Sizzle Reel',
        media: remainingMedia.slice(0, 1),
        layout: { type: 'uniform', cols: 1, aspect: '16/9' },
      },
      {
        title: 'Social Video',
        media: socialVideos,
        layout: { type: 'feature-grid', featuredIndex: 2 },
      },
      {
        title: 'Social Campaigns',
        media: remainingMedia.slice(4, 7),
        layout: { type: 'uniform', cols: 3, aspect: '9/16' },
      },
      {
        title: 'MNRK Heavy Mockups',
        media: [
          {
            type: 'image',
            src: '/projects/the-syndicate/mnrk-heavy-social-mockup.png',
            aspect: '4/3',
          },
          {
            type: 'image',
            src: '/projects/the-syndicate/mnrk-heavy-band-mockup.png',
            aspect: '4/3',
          },
        ],
        layout: { type: 'uniform', cols: 2, aspect: '4/3' },
      },
      {
        title: 'Conference Creative',
        media: finalPair,
        layout: { type: 'feature-grid', featuredIndex: 0 },
      },
    ].filter((section) => section.media.length > 0) as Section[];
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
    <div className="min-h-screen bg-bg text-[17px] leading-[1.6] text-text">
      <SiteHeader />

      <main className={`w-full ${GUTTER_X} ${BLOCK_PT}`}>
        <Link href="/#work" className="inline-block text-[15px] text-muted transition-colors hover:text-accent">
          ← All work
        </Link>
        <h1 className={`${STACK} text-[clamp(34px,5.4vw,62px)] font-semibold leading-[1.05] tracking-[-0.03em]`}>
          {p.title}
        </h1>
        <p className={`${STACK} max-w-[60ch] text-[clamp(18px,1.9vw,21px)] leading-[1.5]`}>{summary}</p>

        <dl className={`${BLOCK_T} grid grid-cols-2 ${GAP} border-y border-line ${RULE_PY} text-[15px] md:grid-cols-4`}>
          <div>
            <dt className="text-[13.5px] font-medium text-muted">Client</dt>
            <dd>{p.client}{detail.agency ? ` — via ${detail.agency}` : ''}</dd>
          </div>
          <div>
            <dt className="text-[13.5px] font-medium text-muted">Role</dt>
            <dd>{p.role}</dd>
          </div>
          <div>
            <dt className="text-[13.5px] font-medium text-muted">Year</dt>
            <dd>{p.date || p.year}</dd>
          </div>
          <div>
            <dt className="text-[13.5px] font-medium text-muted">Tools</dt>
            <dd>{detail.tools.join(', ')}</dd>
          </div>
        </dl>

        <section className={`${BLOCK_T} max-w-[62ch]`}>
          <h2 className="text-[22px] font-semibold tracking-[-0.01em]">My role</h2>
          <p className={`${TIGHT} text-muted`}>{detail.contribution}</p>
        </section>

        {visible.map((sec, i) => (
          <div key={i} className={BLOCK_T}>
            <h2 className="text-[22px] font-semibold tracking-[-0.01em]">{sec.title}</h2>
            <CaseSection section={sec} />
          </div>
        ))}

        {archive.length > 0 && (
          <details className={`group ${BLOCK_T} border-y border-line`}>
            <summary className="flex cursor-pointer list-none items-center justify-between py-5 sm:py-6 text-[clamp(20px,2.6vw,28px)] font-semibold tracking-[-0.02em] transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
              {archiveLabel}
              <span className="text-muted transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="pb-12 sm:pb-16">
              {archive.map((sec, i) => (
                <div key={i} className={BLOCK_T}>
                  <h3 className="text-[19px] font-semibold tracking-[-0.01em]">{sec.title}</h3>
                  <CaseSection section={sec} />
                </div>
              ))}
            </div>
          </details>
        )}

        {p.id === 'the-syndicate' && (
          <p className={`${BLOCK_T} text-[clamp(22px,3vw,32px)] font-medium tracking-[-0.02em]`}>
            Want to see more?{' '}
            <a href={`mailto:${SITE_TEXT.contact.email}`} className="text-accent underline underline-offset-4 hover:text-text">
              Get in touch.
            </a>
          </p>
        )}

        <nav aria-label="More projects" className={`${SECTION_T} grid grid-cols-2 ${GAP} border-y border-line ${RULE_PY}`}>
          <Link href={`/work/${prev.id}`} className="group">
            <span className="block text-[15px] text-muted">Previous project</span>
            <span className="text-[clamp(20px,3vw,32px)] font-semibold tracking-[-0.02em] transition-colors group-hover:text-accent">
              ← {prev.title}
            </span>
          </Link>
          <Link href={`/work/${next.id}`} className="group text-right">
            <span className="block text-[15px] text-muted">Next project</span>
            <span className="text-[clamp(20px,3vw,32px)] font-semibold tracking-[-0.02em] transition-colors group-hover:text-accent">
              {next.title} →
            </span>
          </Link>
        </nav>
      </main>

      <PageFooter />
    </div>
  );
}
