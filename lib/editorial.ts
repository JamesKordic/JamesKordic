import type { Media, Project, Section, AspectRatio } from './projects';
import { TACO_ARTISTS } from './portfolio';

export type EditorialProject = {
  hero: Section;
  sections: Section[];
  archive: Section[];
  role: string;
  brief: string;
  credits: string;
  delivery: string;
  /** Optional line naming which tools made which parts of the work.
   *  Rendered under Credits & scope. An art director will wonder about
   *  generated imagery whether or not you bring it up — saying it plainly
   *  costs nothing, and being quietly suspected of it costs the project. */
  tooling?: string;
};
export function flattenMedia(section: Section): Media[] {
  return section.layout?.type === 'mixed' ? section.layout.rows.flatMap(row => row.media.map(media => ({ ...media, aspect: media.aspect ?? row.aspect }))) : section.media;
}
function gallery(title: string, media: Media[], cols: 1 | 2 | 3 | 4, aspect: AspectRatio, context?: string): Section {
  return { title, context, media, layout: { type: 'uniform', cols, aspect } };
}
export function getEditorial(project: Project): EditorialProject {
  const find = (title: string) => {
    const section = project.sections.find(s => s.title === title);
    if (!section) throw new Error(`Missing section ${project.id}: ${title}`);
    return section;
  };
  const pick = (title: string, count: number, cols: 1 | 2 | 3 | 4, aspect: AspectRatio, context?: string) => {
    const section = find(title);
    return gallery(title, flattenMedia(section).slice(0, count), cols, aspect, context ?? section.context);
  };
  let result: Omit<EditorialProject, 'archive'>;
  switch (project.id) {
    case 'taco-bell': {
      /* The range IS the argument on this project — one template carrying a
       * whole roster. Both reel sets are promoted into the main narrative
       * rather than left in the collapsed archive, where the proof of the
       * claim was invisible to anyone who didn't go looking. */
      const roster = [
        ...flattenMedia(find('Vertical Reel Set 1')),
        ...flattenMedia(find('Vertical Reel Set 2')),
        ...flattenMedia(find('Vertical Reel Set 3')),
      ];
      result = {
        hero: gallery('Feed the Beat — selected artists', TACO_ARTISTS.map(artist => ({ type: 'image', src: artist.src, alt: `${artist.name} — Feed the Beat Class of 2025`, caption: artist.name })), 3, '9/16'),
        brief: 'Keep a diverse roster of emerging artists distinct while making every announcement recognizable as Taco Bell’s Feed the Beat. The campaign needed to work repeatedly across artist photographs, colorways, and vertical social formats.',
        role: 'Working within the existing Feed the Beat brand system, I designed lineup assets and reusable vertical templates, placed artist photography, adapted color and typography, animated motion pieces, and prepared platform-ready exports.',
        credits: 'Created at The Syndicate within Taco Bell’s supplied Feed the Beat identity. My contribution covered campaign design, template development, motion, and production; artist photography and existing brand artwork were supplied assets.',
        delivery: 'A reusable artist template system, lineup announcements, and promotional motion assets for the Class of 2025 campaign.',
        sections: [
          {
            title: `One template, ${roster.length} artists`,
            context:
              'The same vertical frame, rebuilt for every act on the Class of 2025 roster. Photography, crop, and palette change with each artist; the Feed the Beat zone never moves. Scroll the row — the system is the point.',
            media: roster,
            layout: { type: 'carousel', aspect: '9/16', visible: 4 },
          },
          pick('Lineup Promotion Posts', 3, 3, '4/5', 'The full roster announcement, a coming-soon motion piece, and campaign packaging photography show how the identity carries across formats.'),
        ],
      };
      break;
    }
    case 'adults':
      result = {
        hero: gallery('Suds and Sounds — Culver City activation', [{ type: 'image', src: '/projects/adults/culver-city-cover.jpg', alt: 'FX Adults Suds and Sounds event inside a laundromat', caption: 'Suds and Sounds, Culver City — event documentation.' }], 1, '16/9'),
        brief: 'The Syndicate transformed neighborhood laundromats in New York and Los Angeles into pop-ups for FX’s Adults. The creative had to bring the show’s identity into spaces used for daytime community events and evening music.',
        role: 'Working alongside Sarah Whitty and Molly Brooks, I designed event creative within the show’s brand system, including menus, signage, and animated screens. I also prepared production files, pre-production materials, and stakeholder deliverables.',
        credits: 'Agency: The Syndicate. Creative collaborators: Sarah Whitty and Molly Brooks. FX’s show identity and cast imagery were existing brand assets. Event photography and the recap film document the team’s activation.',
        delivery: 'Physical and digital event creative, pre-production mockups, and production-ready materials supporting the show’s launch activations.',
        sections: [
          pick('Suds and Sounds', 4, 2, '4/5', 'Bar menus and event signage designed within the Adults identity. Showing the flat artwork makes the hierarchy and layout visible before installation.'),
          pick('Animated Screens', 2, 2, '16/9'),
          pick('Pre-Production Mockups', 2, 2, '4/3', 'Pre-production visualizations used to communicate the laundromat installation concept. These are mockups, followed below by photographs of the activation.'),
          pick('Suds and Sounds Event', 3, 3, '3/4', 'The completed event environment, from exterior signage to graphics within the laundromat. Photographs document the wider team’s work.'),
          pick('Campaign Films', 1, 1, '16/9', 'Event recap documenting the Suds and Sounds activation. My contribution to the campaign was graphic design and production.'),
        ],
      };
      break;
    case 'guns-n-roses': {
      const media = flattenMedia(project.sections[0]);
      result = {
        hero: gallery('Selected social video & motion', media.slice(0, 3).map((item, i) => ({ ...item, caption: ['Music catalog reel · 1:06', 'Tour announcement · 0:12', 'Live performance reel · 0:16'][i] })), 3, '9/16'),
        brief: 'Create social content that connects the band’s musical history with current tours and performances. Each piece needed to remain recognizable in a vertical feed while making room for archival artwork and live footage.',
        role: 'I edited social videos and created promotional motion graphics, sourced and cut performance clips, added reel captions, and polished existing edits with The Syndicate’s social team.',
        credits: 'Created through The Syndicate for Guns N’ Roses. My work covered editing and promotional motion using existing band artwork, music, and performance footage.',
        delivery: 'Tour promotion, music catalog content, and live-performance edits prepared for social platforms. Created to support the band’s music, tour announcements, and fan community.',
        sections: [],
      };
      break;
    }
    case 'wwimf':
      result = {
        hero: gallery('WWIMF — the visual identity', [{ type: 'image', src: '/projects/wwimf/visual-identity-logos.png', alt: 'WWIMF wordmark with sound visualizer bars and a variable hand symbol', caption: 'A visualizer becomes a wordmark, a hand, and a variable identity.' }], 1, '16/9'),
        brief: 'What would a music festival look like if the audience helped shape the experience? I developed WWIMF as an independent RIT capstone, using that question to connect identity, environments, interaction concepts, and printed material.',
        role: 'I developed the concept and visual identity, designed stage and interaction concepts, created campaign graphics and motion, and produced the book and exhibition presentation for the 2025 RIT Graphic Design Capstone Show.',
        credits: 'Independent concept project, Rochester Institute of Technology, 2025. Concept, graphic design, motion, and exhibition by James Kordic. Artist images and environmental mockups illustrate a fictional festival; they do not imply artist participation or a built event.',
        tooling:
          'The stage environments and merchandise shots are visualizations, built with a mix of 3D and generative imagery. The identity, typography, layout, campaign artwork, motion, and the printed book are designed work.',
        delivery: 'An identity, campaign, merchandise and environment concepts, a printed art book, and a physical capstone exhibition.',
        sections: [
          pick('Instagram Posts', 4, 4, '1/1', 'The hand and visualizer bars frame the artist photography. A repeated structure lets each artist and color treatment change without losing the festival identity.'),
          pick('Stage Designs', 2, 2, '16/9', 'Conceptual stage environments exploring how the identity could become architecture, lighting, and digital scenery. These visual studies describe the intended experience.'),
          gallery('Participation, not just observation', flattenMedia(find('Interactive Elements')).slice(0, 3), 3, '16/9', 'The proposed interactions connect audience presence and gesture with light and visuals. Touch-responsive surfaces and motion-reactive installations would let attendees influence their surroundings. These are interaction concepts, not functioning prototypes.'),
          pick('Animations', 1, 1, '16/9', 'The visualizer motif translated into rhythmic motion, carrying the identity’s changing bars and color into an animated sequence.'),
          gallery('A shared identity, worn differently', flattenMedia(find('Merchandise')).slice(3), 3, '3/2', 'Wristband, tote, and shirt applications carry the same visualizer language into different materials and scales. Shown as merchandise visualizations.'),
          pick('Capstone Show Setup', 2, 2, '3/4', 'The concept’s physical presentation at RIT: printed material, motion, and the book brought together in one exhibition.'),
          {
            title: 'The festival, in print',
            context:
              'I wrote, designed, and printed an art book documenting the whole festival world — identity, environments, interaction, campaign, motion. Every spread is here, in order. Scroll the row to read it.',
            media: flattenMedia(find('WWIMF Book')),
            layout: { type: 'carousel', aspect: '3/4', visible: 4 },
          },
        ],
      };
      break;
    default:
      result = {
        hero: gallery('MNRK Heavy — social campaign applications', [{ type: 'image', src: '/projects/the-syndicate/mnrk-heavy-social-mockup.png', alt: 'MNRK Heavy social graphics presented across mobile screens', caption: 'MNRK Heavy — social campaign applications.' }], 1, '4/3'),
        brief: 'An agency’s work changes with each client: a record announcement, a comedy clip, or a conference speaker reveal. These selections show how I adapted content and format while working within distinct identities.',
        role: 'During my internship and freelance contract with The Syndicate, I designed campaign assets, edited social clips, created motion graphics, and prepared digital and print deliverables alongside the creative team.',
        credits: 'Agency: The Syndicate. Creative team included Molly Brooks and Sarah Whitty. Client identities, album artwork, artist photography, and performance footage are credited to their respective owners; my contributions are described with each selection.',
        delivery: 'Selected social graphics, edited clips, record promotions, and conference assets across multiple client campaigns.',
        sections: [
          pick('Killphonic Records', 1, 1, '16/9'),
          gallery('Craig Ferguson — social edits', [find('Craig Ferguson').media[0], find('Craig Ferguson').media[2]], 2, '9/16', 'Social clips I cut and designed, selecting moments from the shows and adapting them for vertical feeds.'),
          pick('MNRK Heavy — Social Media Posts', 3, 3, '1/1', 'Social campaign design for record anniversaries and giveaways, using each release’s existing album artwork within promotional layouts.'),
          pick('Consensus — Motion Graphics', 2, 2, '16/9', 'Motion graphics I created to promote conference programming, dates, and locations within the Consensus identity.'),
          pick('Consensus — Speaker Announcements', 2, 2, '16/9', 'Speaker announcement graphics combining names, roles, companies, and programming information in a repeatable layout.'),
          gallery('Indie Week — event graphics', [{ type: 'image', src: '/projects/the-syndicate/Indiemock.png', alt: 'Indie Week event graphics shown in context' }], 1, '2/1', 'Branded assets for speaker announcements, key dates, and on-site signage.'),
        ],
      };
  }
  const used = new Set([result.hero, ...result.sections].flatMap(flattenMedia).map(m => m.src));
  const archive = project.sections.map(section => {
    const media = flattenMedia(section).filter(m => !used.has(m.src));
    return { ...section, media, layout: { type: 'legacy' as const, cols: 3 as const }, cols: 3 as const };
  }).filter(section => section.media.length > 0);
  // Long brand sheets remain available without overwhelming the main narrative.
  const label = (section: Section): Section => ({ ...section, media: section.media.map((media, i) => ({ ...media, alt: media.alt || `${project.title} — ${section.title}, artwork ${i + 1}` })) });
  return { ...result, hero: label(result.hero), sections: result.sections.map(label), archive: archive.map(label) };
}
