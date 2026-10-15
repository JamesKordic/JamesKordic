import type { Media, Project, Section } from './projects';

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

/** Splits a section after its first row of media, so the page can open on
 *  one line of work and continue below the Overview / My role row. Grids
 *  break at their column count and mixed layouts at their first row; a
 *  feature grid or carousel already reads as a single line, as does any
 *  grid with only one row, so those come back whole with nothing after. */
function splitFirstLine(section: Section): [Section, Section | null] {
  const layout = section.layout;

  if (layout?.type === 'mixed') {
    const [first, ...rest] = layout.rows;
    return rest.length
      ? [
          { ...section, layout: { ...layout, rows: [first] } },
          { ...section, layout: { ...layout, rows: rest } },
        ]
      : [section, null];
  }

  const cols =
    layout?.type === 'uniform' || layout?.type === 'legacy'
      ? layout.cols
      : !layout
        ? section.cols
        : undefined;

  if (!cols || section.media.length <= cols) return [section, null];
  return [
    { ...section, media: section.media.slice(0, cols) },
    { ...section, media: section.media.slice(cols) },
  ];
}

export type ProjectPresentation = {
  hero: Media;
  gallerySections: Section[];
  archive: Section[];
};

/** Resolve the same opening visual and editorial sequence for a case and its preview. */
export function getProjectPresentation(project: Project): ProjectPresentation {
  const { visible, archive } = editorialSections(project);
  const [firstLine, firstRest] = visible.length ? splitFirstLine(visible[0]) : [null, null];
  const afterIntro = [...(firstRest ? [firstRest] : []), ...visible.slice(1)];
  const singleOpeningMedia = firstLine && firstLine.layout?.type !== 'mixed' && firstLine.media.length === 1 && firstLine.media[0].type !== 'embed'
    ? firstLine.media[0]
    : null;
  const hero: Media = singleOpeningMedia ?? (project.carouselVideo || project.coverVideo
    ? { type: 'video', src: project.carouselVideo ?? project.coverVideo!, poster: project.heroImage ?? project.cover, aspect: '16/9' }
    : { type: 'image', src: project.heroImage ?? project.cover, alt: `${project.title} campaign` });
  // A single opening visual becomes the hero itself. Multi-image openings
  // keep their entire original section after the introduction.
  const gallerySections = singleOpeningMedia ? afterIntro : visible;

  return { hero, gallerySections, archive };
}
