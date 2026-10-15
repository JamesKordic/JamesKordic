import type { Project } from './projects';

export type CaseStudyStory = {
  brief: string;
  problem: string;
  insight: string;
  designIntent: string;
  outcome: string;
};

export const CASE_STUDY_SECTIONS = [
  { id: 'brief', title: 'The Brief', key: 'brief' },
  { id: 'problem', title: 'Problem', key: 'problem' },
  { id: 'insight', title: 'Insight', key: 'insight' },
  { id: 'design-intent', title: 'Design Intent', key: 'designIntent' },
  { id: 'outcome', title: 'Outcome', key: 'outcome' },
] as const;

const STORIES: Partial<Record<string, CaseStudyStory>> = {
  'guns-n-roses': {
    brief:
      "Through The Syndicate, I supported the Guns N’ Roses social team with video editing and motion graphics. The work promoted tours, music, and milestones through vertical content drawn from the band’s performances and visual history.",
    problem:
      "The content needed to feel immediately recognizable as Guns N’ Roses while working within a contemporary social feed. Live footage, archival imagery, captions, and promotional messages had to come together in short, focused edits.",
    insight:
      "The band’s performances and archive provided the starting point. Keeping those recognizable images at the center let pacing and typography adapt the material to a vertical format without losing its connection to the band.",
    designIntent:
      "I paired sharp cuts with hard-cut typography and clear captions, using motion to reinforce the energy of the footage. Each edit focused on a tour moment, a musical highlight, or a message for fans.",
    outcome:
      "I delivered vertical reels and promotional motion content, from sourcing and editing performance clips to captioning and polishing existing cuts. The selected work shows those treatments applied across tour promotion and fan-facing social videos.",
  },
  'taco-bell': {
    brief:
      "Feed The Beat is Taco Bell’s program for spotlighting emerging musicians. Through The Syndicate, I designed lineup announcements and vertical motion assets that introduced artists across a recurring series of campaign releases.",
    problem:
      "Each artist brought different photography, colors, and visual character. The campaign needed to accommodate that variety while keeping the Feed The Beat identity clear across lineup posts, individual artist features, and vertical reels.",
    insight:
      "A consistent brand frame could hold the campaign together while the artist content supplied the variation. Separating fixed brand elements from interchangeable photography, names, and colorways made the recurring announcements a template problem rather than a fresh layout each time.",
    designIntent:
      "I built reusable templates around the Taco Bell and Feed The Beat marks, then adapted artist photography, type, and color within them. I carried the same structure into motion and prepared versions for different social formats.",
    outcome:
      "The work included lineup promotion, artist announcement reels, and reusable vertical templates populated across multiple sets of musicians. Distinct colorways differentiated each set while the shared layout kept the campaign visually connected.",
  },
  adults: {
    brief:
      "For the launch of FX’s Adults, The Syndicate turned laundromats in New York City and Los Angeles into music-driven pop-ups. Working alongside Sarah Whitty and Molly Brooks, I developed graphic and motion assets within the show’s existing brand system.",
    problem:
      "The activation needed creative for physical spaces, social feeds, and animated screens across two markets. Menus, banners, cast portraits, and game graphics had to feel connected despite their very different sizes and uses.",
    insight:
      "The cast and the show’s established visual language offered a consistent starting point. Carrying the same character treatment, typography, and color across applications connected the practical event materials to the launch campaign.",
    designIntent:
      "I adapted the brand to animated signage, on-screen questions for the Reality Check game, cast imagery, menus, and promotional graphics. Pre-production mockups and file preparation helped translate the designs from individual layouts into event applications.",
    outcome:
      "I contributed motion, print, and social creative for the Suds and Sounds activation, including animated screens, cast polaroids, announcements, menus, banners, and mockups. My role also covered production setup, finishing, and preparing deliverables for review.",
  },
  'the-syndicate': {
    brief:
      "During my internship and freelance contract at The Syndicate, I supported music, entertainment, and conference clients with graphic and motion design. This selection brings together work for MNRK Heavy, Consensus by CoinDesk, Craig Ferguson, Indie Week, and Killphonic Records.",
    problem:
      "Moving between clients meant changing audiences, identities, and formats. A comedy clip, a record announcement, and a conference speaker graphic each needed a distinct treatment while remaining practical to adapt across a campaign.",
    insight:
      "Each client’s existing identity provided the starting point, while the content determined the emphasis. Performance footage called for editing and pacing; artist and conference announcements needed clear information structures that could repeat without losing their character.",
    designIntent:
      "Working with the creative team, I edited social clips, developed modular layouts, and animated promotional assets. I adapted artist imagery, speaker details, sponsor information, and event dates into materials suited to their individual platforms and uses.",
    outcome:
      "The selected work includes vertical comedy clips, music release promotion, artist social campaigns, event signage, and conference motion graphics. Across those assignments, I helped take source content through design, animation, format adaptations, and production-ready delivery.",
  },
  wwimf: {
    brief:
      "WWIMF, the World Wide Interactive Music Festival, is a conceptual festival I developed for my senior capstone at RIT. I explored what a festival could look like if its audience helped shape the experience rather than simply watching it.",
    problem:
      "The idea needed to work as a complete festival identity, spanning stages, interactive concepts, merchandise, and promotion. It also needed a physical presentation for the 2025 RIT Graphic Design Capstone Show, where those different pieces could be understood together.",
    insight:
      "Music and participation became the identity’s organizing ideas. Visualizer bars connected the graphics to sound, while a secondary hand mark connected them to interaction; the same elements could carry through static design, objects, and motion.",
    designIntent:
      "I built the identity first, then extended it into stage studies, participatory wearables, campaign graphics, merchandise, and animation. A shared type system, palette, and visualizer motif gave each application a connection to the larger festival concept.",
    outcome:
      "I presented WWIMF at Fusion, RIT’s 2025 Graphic Design Capstone Show, with animation loops, printed posters, an information panel, and a printed art book. The festival, stages, and interactive systems remain concepts; the exhibition brought the designed identity into a physical setting.",
  },
};

/** Existing project content remains the fallback for any future case study. */
export function getCaseStudyStory(project: Project): CaseStudyStory {
  const story = STORIES[project.id];
  if (story) return story;

  const description = project.desc;
  return {
    brief: project.brief?.lead.trim() || description,
    problem: project.brief?.body[0]?.trim() || description,
    insight: project.approach?.intro.trim() || project.brief?.body[1]?.trim() || description,
    designIntent: project.approach?.steps.map((step) => step.body.trim()).filter(Boolean).join(' ') || project.approach?.intro.trim() || description,
    outcome: project.recap?.headline.trim() || description,
  };
}
