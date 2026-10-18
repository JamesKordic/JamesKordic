import type { Project } from './projects';

// Original project-page contributions, paired with each project's overview.
const CONTRIBUTIONS: Record<string, string> = {
  'guns-n-roses':
    "I edited dynamic, platform-ready social videos and created promotional motion graphics, blending pacing, visual energy, and storytelling to amplify the band's presence and deepen fan engagement. My work also included sourcing and editing clips from live performances, adding captions to reels, and polishing existing edits. Whether the content promoted a tour or celebrated a milestone, the goal was always the same: build excitement and keep fans coming back.",
  'taco-bell':
    "Working within Taco Bell's Feed The Beat brand system, I designed lineup promotional assets and built reusable vertical templates that could flex across dozens of artists. I sourced and placed artist photography, adapted color and typography to each release, animated motion pieces, and prepared platform-ready exports. The goal was to keep every post distinct to the artist while making the full campaign feel cohesive at scroll speed.",
  adults:
    "Working directly within the show's brand system alongside Sarah Whitty and Molly Brooks, I designed event creative across physical and digital touchpoints. I also played a key role in production—setting up files, applying finishing touches, assembling pre-production materials, and preparing stakeholder-ready deliverables.",
  'the-syndicate':
    'Working alongside the creative team, I designed and animated assets for clients including MNRK Heavy, Consensus by CoinDesk, Craig Ferguson, Indie Week, and Killphonic Records. My work included editing social clips, building modular campaign systems, creating speaker and sponsor graphics, adapting assets across platforms, and preparing files for production. I often took projects from rough content through polished, ready-to-publish deliverables.',
  wwimf:
    'I led every part of the project from concept through final exhibition. I developed the strategy and visual identity, designed stage environments and participatory interactions, created the campaign and motion system, produced merchandise and physical touchpoints, and brought the full experience together for the 2025 RIT Graphic Design Capstone Show. The goal was to make a fictional festival feel detailed, cohesive, and believable enough to exist.',
};

export function getProjectIntroduction(project: Project) {
  return {
    overview: project.brief?.lead || project.desc,
    role: CONTRIBUTIONS[project.id] || project.role,
  };
}
