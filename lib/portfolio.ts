import { PROJECTS } from './projects';

export const SELECTED_PROJECTS = ['taco-bell', 'adults', 'guns-n-roses', 'wwimf', 'the-syndicate'].map(id => {
  const project = PROJECTS.find(p => p.id === id);
  if (!project) throw new Error(`Missing selected project: ${id}`);
  return project;
});

export const PROJECT_PRESENTATION: Record<string, { title: string; caption: string; discipline: string; headline: string; intro: string }> = {
  'taco-bell': { title: 'Taco Bell — Feed the Beat', caption: 'Many artists. One recognizable campaign.', discipline: 'Campaign design / Motion', headline: 'Many artists.\nOne recognizable campaign.', intro: 'Reusable social templates and motion for Taco Bell’s emerging-artist program, created with The Syndicate.' },
  adults: { title: 'Adults on FX', caption: 'A show launch, brought into the real world.', discipline: 'Event graphics / Production', headline: 'An everyday place.\nAn unexpected experience.', intro: 'Event graphics and production for Suds and Sounds, a series of laundromat pop-ups celebrating FX’s Adults.' },
  'guns-n-roses': { title: 'Guns N’ Roses', caption: 'Rock history, made for the feed.', discipline: 'Video editing / Motion', headline: 'Rock history.\nPresent-tense energy.', intro: 'Social video and promotional motion created with The Syndicate for Guns N’ Roses’ music, tours, and fan community.' },
  wwimf: { title: 'WWIMF', caption: 'A festival shaped by the people inside it.', discipline: 'Identity / Independent concept', headline: 'An audience that\nbecomes part of the show.', intro: 'World Wide Interactive Music Festival: an independent identity and experience concept developed for my RIT senior capstone.' },
  'the-syndicate': { title: 'Selected entertainment work', caption: 'Music, comedy, and culture with The Syndicate.', discipline: 'Graphic design / Motion', headline: 'Different audiences.\nA feel for each one.', intro: 'Selected graphic and motion design for artists, record labels, comedy, and conferences, created with The Syndicate.' },
};

export const TACO_ARTISTS = [
  { name: 'Julia Wolf', src: 'https://framerusercontent.com/images/nROXYm5aRxay6E93SF25CUAlluM.png?width=800' },
  { name: 'Rocket', src: 'https://framerusercontent.com/images/GTaoryMjDqdt31bStBwjD1VNDk.png?width=800' },
  { name: 'Master Peace', src: 'https://framerusercontent.com/images/FaBFN1wAQD4SBQtyw4qBlTm9Vug.png?width=800' },
];
