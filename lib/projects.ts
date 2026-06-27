// All project content sourced from jameskordic.com
// Assets are served from Framer's CDN; swap to local paths if you self-host.

/* ============ MEDIA TYPES ============ */
export type Media =
  | { type: 'image'; src: string; aspect?: AspectRatio }
  | {
      type: 'video';
      src: string;
      aspect?: AspectRatio;
      fit?: 'contain' | 'cover';
      /** Optional custom thumbnail URL shown before playback. If omitted,
       *  the player auto-captures the first frame of the video.
       *  Path can be absolute (https://...) or a project-relative path
       *  starting with `/` (e.g. `/posters/syndicate-hero.jpg` for an
       *  image in `/public/posters/`). */
      poster?: string;
    }
  | { type: 'embed'; src: string; aspect?: AspectRatio; label?: string };

/* Allowed aspect ratios — keeps the visual rhythm controllable */
export type AspectRatio =
  | '21/9'
  | '3/1'
  | '2/1'
  | '16/9'
  | '4/3'
  | '3/2'
  | '1/1'
  | '4/5'
  | '2/3'
  | '3/4'
  | '9/16'
  | '1/2';

/* ============ SECTION LAYOUTS ============ */

/* A "row" inside a mixed-layout section — its own column count + aspect.
 * Used when a section has images of different shapes that need grouping. */
export type GridRow = {
  cols: 1 | 2 | 3 | 4;
  aspect: AspectRatio;
  media: Media[];
};

/* Three layout flavors for the new system:
 *  - uniform: every tile shares one column count and aspect ratio (clean grid)
 *  - mixed: rows with different col/aspect combos for mixed media
 *  - legacy: the old `cols` number, used by projects not yet migrated
 */
export type Layout =
  | { type: 'uniform'; cols: 1 | 2 | 3 | 4; aspect: AspectRatio }
  | { type: 'mixed'; rows: GridRow[] }
  /** Horizontally scrolling row of fixed-width cards.
   *  - `aspect`: aspect ratio of each card
   *  - `visible`: how many cards fit in the viewport at desktop sizes
   *    (mobile shows fewer automatically; defaults to 4) */
  | { type: 'carousel'; aspect: AspectRatio; visible?: 2 | 3 | 4 | 5 }
  | { type: 'legacy'; cols: 1 | 2 | 3 | 4 };

export type Section = {
  eyebrow?: string;
  title: string;
  body?: string;
  /** Case-study intro paragraph — what the client needed / project context. */
  context?: string;
  /** Case-study intro paragraph — what the designer specifically did. */
  role?: string;
  /** Pull-quote callout at the end of the section. Lesson or insight learned. */
  fieldNote?: string;
  /** Media array — used when layout is uniform or for legacy projects. */
  media: Media[];
  /** New layout descriptor. If provided, takes precedence over `cols`. */
  layout?: Layout;
  /** @deprecated Use layout instead. Kept for backward compatibility. */
  cols?: 1 | 2 | 3 | 4;
};

export type ProjectKind = 'professional' | 'personal';

/** A single step in the project's design approach (case-study sections). */
export type ApproachStep = { label: string; title: string; body: string };

/** A stat shown in the recap (e.g. "~50 assets shipped"). */
export type RecapStat = { value: string; label: string; unit?: string };

export type Project = {
  id: string;
  kind: ProjectKind;
  title: string;
  cover: string;
  /** Optional still image shown as the project-page hero only. When set, the
   *  project page uses this instead of `cover`; `cover` is still used
   *  everywhere else (homepage card, thumbnails, prev/next, search, etc.). */
  heroImage?: string;
  /** Optional looping hero video shown on the project page only.
   *  The `cover` image is still used everywhere else (thumbnails,
   *  sidebar, prev/next, player bar, search) AND as this video's
   *  poster while it loads. */
  coverVideo?: string;
  themeColor: string;
  tags: string[];
  client: string;
  date: string;
  role: string;
  year: string;
  len: number;
  blurb: string;
  desc: string;
  /** Optional case-study sections — when present, render before the work. */
  brief?: { eyebrow?: string; lead: string; body: string[] };
  approach?: { eyebrow?: string; intro: string; steps: ApproachStep[] };
  /** Optional recap — stats shown at the end of the case study. */
  recap?: { eyebrow?: string; headline: string; stats: RecapStat[] };
  sections: Section[];
};

const FRAMER = 'https://framerusercontent.com';
const img = (id: string, w = 1200) => `${FRAMER}/images/${id}.png?width=${w}`;
const jpg = (id: string, w = 1200) => `${FRAMER}/images/${id}.jpg?width=${w}`;
const gif = (id: string, w = 540) => `${FRAMER}/images/${id}.gif?width=${w}`;
const vid = (id: string) => `${FRAMER}/assets/${id}.mp4`;

export const PROJECTS: Project[] = [
  {
    id: 'the-syndicate',
    kind: 'professional',
    title: 'The Syndicate',
    cover: '/covers/the-syndicate.jpg',
    coverVideo: '/projects/the-syndicate/hero.mp4',
    themeColor: '#3c3a4a',
    tags: ['Creative Direction', 'Marketing', 'Motion Design'],
    client: '',
    date: '',
    role: '',
    year: '2024–25',
    len: 262,
    blurb: 'Music & Entertainment Marketing',
    desc: "The Syndicate is a music and entertainment marketing agency, and this internship put me inside its day-to-day campaign work. I designed for indie and major label artists as well as TV, film, and comedy clients. I created digital assets, tour and promotional visuals, and event materials. The job, again and again, was to translate each artist's voice into design their audience would actually stop scrolling for, and to ship it at campaign speed.",
    sections: [
      {
        eyebrow: 'Music',
        title: "Guns N' Roses",
        context:
          "A set of reels I created for Guns N' Roses to promote tours, music, and fan engagement across multiple digital platforms.",
        // 3 vertical Reels — keep them small, 3 across
        media: [
          { type: 'video', src: vid('TAsErfe3Mav2ZPK82B8hoA7HANs'), aspect: '9/16', poster: '/posters/TAsErfe3Mav2ZPK82B8hoA7HANs.jpg'},
          { type: 'video', src: vid('c5CmANQj9sWEtQAUdOy0dVCRan8'), aspect: '9/16', poster: '/posters/c5CmANQj9sWEtQAUdOy0dVCRan8.jpg' },
          { type: 'video', src: vid('m4aBld36mXRoGXa41tRbBPqFMs'), aspect: '9/16', poster: '/posters/m4aBld36mXRoGXa41tRbBPqFMs.jpg' },
        ],
        layout: { type: 'uniform', cols: 3, aspect: '9/16' },
      },
      {
        eyebrow: 'Records',
        title: 'Killphonic Records',
        context:
          "A promotional video I created for Killphonic Records to announce Heart of Gold: The Songs of Neil Young Vol. 1. It introduces the featured artists and pushes pre-orders across digital platforms.",
        // Single horizontal promo video — full width 16:9
        media: [
          {
            type: 'video',
            src: vid('1bkwSiwMean5Ugrcj5THWu5rK8c'),
            aspect: '16/9',
            poster: '/posters/syndicate-killphonic.jpg',
          },
        ],
        layout: { type: 'uniform', cols: 1, aspect: '16/9' },
      },
      {
        eyebrow: 'Comedy',
        title: 'Craig Ferguson',
        context:
          "Social clips I cut and designed for Craig Ferguson, pulling the sharpest moments from his shows and reformatting them for vertical feeds.",
        // 4 vertical social clips — 4 across on desktop
        media: [
          { type: 'video', src: vid('AGvRC8ZeWglalhmRVoWrAenDbU'), aspect: '9/16' },
          { type: 'video', src: vid('5jQZz12hg4ZlEN4oGGfwnJ2suU'), aspect: '9/16' },
          { type: 'video', src: vid('taiJsfTcLbvOfzAFwxg20fxndg'), aspect: '9/16' },
          { type: 'video', src: vid('pld0kHhyrFuCBme5omkjWKygY'), aspect: '9/16' },
        ],
        layout: { type: 'uniform', cols: 4, aspect: '9/16' },
      },
      {
        eyebrow: 'Records',
        title: 'Last Gang Records',
        context:
          "Social posts I designed for Last Gang Records, spotlighting the label's music placements in video games, film, and other media.",
        // 3 vertical items in a single row at native 4:5.
        // The video source is 9:16 but rendered at 4:5 with cover-crop so
        // it matches the image heights — no letterbox bars on top/bottom.
        media: [
          { type: 'image', src: img('wLWX3ICDe3WN8RjmJIxv26KSk', 1400), aspect: '4/5' },
          { type: 'video', src: vid('IzzjPLgg8Yw88u4F4XjG4RHjyA'), aspect: '4/5', fit: 'cover' },
          { type: 'image', src: img('QR1zQdH6QNFmHzn0PT4PEGPCRM', 1400), aspect: '4/5' },
        ],
        layout: { type: 'uniform', cols: 3, aspect: '4/5' },
      },
      {
        eyebrow: 'Conference',
        title: 'Indie Week',
        context:
          "Branded assets I designed for Indie Week, covering speaker announcements, key dates, and on-site signage. The same system had to work in a feed before the conference and on a wall during it, so everything shares one type and color logic across digital and print.",
        media: [],
        // Mixed aspects — group into:
        //  Row 1: 4 squares (speaker cards, 1:1)
        //  Row 2: 3 tall (1:2 dates)
        //  Row 3: 2 ultra-wide banners (2:1)
        layout: {
          type: 'mixed',
          rows: [
            {
              cols: 4,
              aspect: '1/1',
              media: [
                { type: 'image', src: img('t9wBzTbxGRtzrWypXeSifrLDP5c', 1200) },
                { type: 'image', src: img('Vk51fq3cm2OrBYLhmQSlqKq5z8', 1200) },
                { type: 'image', src: img('aVZo4nkPsAAdNvYInRNp9p68A', 1200) },
                { type: 'image', src: img('jFTELYHXnNn9HzhnAm9AiUK5dk', 1200) },
              ],
            },
            {
              cols: 3,
              aspect: '1/2',
              media: [
                { type: 'image', src: img('LoQPSGaYQwziEdo7ydNpikCqoQ', 800) },
                { type: 'image', src: '/projects/the-syndicate/IndieWeek-Sign.png',  },
                { type: 'image', src: img('bpHcCcSIeuecSinBTOQMj2IHLm0', 800) },
              ],
            },
            {
              cols: 1,
              aspect: '2/1',
              media: [
                { type: 'image', src: img('uF0VkAU6tFzbjXtqEMY4iFihFm8', 2000) },
                { type: 'image', src: '/projects/the-syndicate/Indiemock.png',  },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: 'wwimf',
    kind: 'personal',
    title: 'WWIMF',
    cover: '/covers/wwimf.jpg',
    coverVideo: '/projects/wwimf/hero.mp4',
    themeColor: '#1d2f7a',
    tags: ['Concept Work', 'Branding', 'Interactive Design'],
    client: 'Senior Capstone',
    date: '2025',
    role: 'Graphic Design, Motion Design',
    year: '2025',
    len: 268,
    blurb: 'Interactive Music Festival Concept',
    desc: "WWIMF, the World Wide Interactive Music Festival, is a conceptual festival I built as my senior capstone at RIT. It started with a question: what would a festival look like if the audience became more than just spectators? Over a year, I answered that by building the complete brand: identity, stage environments, wearable tech, merchandise, marketing, motion, and a printed art book. I treated the festival as if it were real and designed everything it would need.",
    brief: {
      eyebrow: 'The Brief',
      lead: "What if a festival could be co-authored by its audience, not just attended by them? WWIMF is a year-long capstone exploring that question through brand, environment, and technology.",
      body: [
        'WWIMF is a conceptual global festival where music, visual art, and emerging tech converge with active guest participation. Audiences become contributors through immersive environments, interactive stages, and participatory wearables that influence what they see and hear in real time.',
        'The project had to deliver as a complete brand system, spanning identity, environment design, merchandise, marketing, motion, and a printed art book, and stand up as a public-facing presentation at Fusion: the 2025 RIT Graphic Design Capstone show.',
      ],
    },
    approach: {
      eyebrow: 'The Approach',
      intro: 'Capstone work lives or dies on cohesion. I built WWIMF as a system from the inside out: identity first, then environments and objects designed against the identity, then marketing built against the environments. Every artifact had to feel like it came from the same festival.',
      steps: [
        { label: 'Step 01', title: 'Identify', body: 'Build the logo, type system, and visualizer motif that everything else inherits.' },
        { label: 'Step 02', title: 'Inhabit', body: 'Design the physical stages and interactive elements the brand would live in.' },
        { label: 'Step 03', title: 'Wear', body: 'Translate the brand into merchandise and wearable tech for participation.' },
        { label: 'Step 04', title: 'Promote', body: 'Build the posters, social, and OOH that pull people toward the festival.' },
        { label: 'Step 05', title: 'Bind', body: 'Print everything into a single art book to anchor the brand in physical form.' },
      ],
    },
    recap: {
      eyebrow: 'The Recap',
      headline: "A festival that doesn't exist, built like it does.",
      stats: [
        { value: '1', label: 'Designed Festival' },
        { value: '28', label: 'Page art book', unit: 'PP' },
        { value: '01', label: 'Capstone show' },
        { value: '12', label: 'Months of build', unit: 'MO' },
      ],
    },
    sections: [
      {
        eyebrow: '01',
        title: 'Visual Identity',
        context: "Everything in WWIMF starts from the same idea: the music should be visible in the brand itself, not just implied around it. The identity also had to survive everywhere the festival would live, from screens and signage to wristbands and a printed book, without losing its sense of motion.",
        role: "I designed the primary wordmark, a secondary hand-mark, the type system, and the color palette. The most important decision turned out to be the modular visualizer bars, which end up in nearly every artifact that follows.",
        body: "The wordmark is built around a music visualizer: bars rise and fall through the letterforms, so the logo reads like a track mid-play. The secondary mark is where the festival's whole premise lives. It merges those same bars with the shape of a hand, the simplest symbol I could find for participation, and it turns the visualizer from something you watch into something you play. A hand reaching into the music is exactly what WWIMF asks of its audience, so the logo isn't just decorating the idea of interactivity; it's demonstrating it. And because the bars inside the hand are modular, the mark can be redrawn endlessly without breaking the system, the same way no two audience interactions at the festival would ever look alike.\n\nFor type, I paired Cityburn with Courier New. Cityburn brings the loud, contemporary energy; Courier New grounds it with a structured, almost DAW-like technical feel. The palette is deliberately unconventional, full of high-energy combinations that feel closer to a stage rig than a corporate style guide. Every element was tested across digital and print before anything else got built on top of it.",
        fieldNote: 'The visualizer bars became the load-bearing element of the whole system. Once they existed, every subsequent decision, from stage lighting to merch patterns to poster type, pointed back to them.',
        media: [{ type: 'image', src: img('UUebmgTykuRmwaxxSRK1LIPuAk', 1800) }],
        layout: {
          type: 'uniform',
          cols: 1,
          aspect: '9/16',
        },
      },
      {
        eyebrow: '02',
        title: 'Stage Designs',
        context: "If the premise is a festival the audience helps perform, a standard stage facing a standard crowd undermines it before the first set. The architecture itself had to do some of the inviting.",
        role: "I concepted four stage typologies (biomorphic structures, projection-mapped facades, light-reactive frames, and stages that wrap around the audience) and rendered each as a photoreal mockup for the capstone show.",
        body: "These studies explore how far a performance space can lean toward the crowd: structures that respond to movement, lighting that behaves like a participant, and layouts that put people inside the show rather than in front of it. I treated each render as a proof of concept, close enough to real that you could stand in front of it and argue about how to build it.",
        media: [
          { type: 'image', src: img('o97WGHUpa9ixF0VWB0k5MSLrfoo', 1600) },
          { type: 'image', src: img('qPQ3eQuaNTjJmIixnjmhqBpwd6Q', 1600) },
          { type: 'image', src: img('NqkfXXGcBQuZLkaeZfem9RJfaio', 1600) },
          { type: 'image', src: img('WDPbozH0bp0WOLB1FBBUKKZuhYM', 1600) },
        ],
        layout: {
          type: 'uniform',
          cols: 2,
          aspect: '16/9',
        },
      },
      {
        eyebrow: '03',
        title: 'Interactive Elements',
        context: "\"Interactive festival\" stays an abstraction until there's something you can actually hold. This is the part of the project where participation becomes physical.",
        role: "I designed the smart wristbands, a glow-in-the-dark pen system, and touch-responsive surfaces, plus the visual language they share, so picking up a pen feels like the same brand as wearing the wristband.",
        body: "The wristband is the core of the kit: a wearable that lets guests influence the visuals and effects of a live set in real time. The pens are lower-tech but just as deliberate; they let people draw on the festival itself, leaving marks that accumulate over the weekend. The boldest concept is the under-stage view, an area built directly beneath the performance where guests watch the show from even closer than the front row, with the performers right above them. It flips the usual geometry of a concert: instead of looking up at a distant stage, you're inside it. Combined with touch-responsive walls and tunnels, these elements turn attendance into a kind of authorship: the festival looks different at the end of the night because of who was there.",
        fieldNote: 'Designing for participation means designing the affordance, not the object. The wristband isn\'t a wristband; it\'s a permission slip to influence the show.',
        media: [
          { type: 'image', src: img('aybJsg9p5A56xYuv6JKk8bLvM', 1600) },
          { type: 'image', src: img('Mgx0cinXenRjsIoslHuYLr8mg', 1600) },
          { type: 'image', src: img('X1jzFS77jaBBcIrnTQECBv9rvSU', 1600) },
          { type: 'image', src: '/projects/wwimf/interactive-pen-new.png' },
        ],
        layout: { type: 'uniform', cols: 2, aspect: '16/9' },
      },
      {
        eyebrow: '04',
        title: 'Merchandise',
        context: "Merch is where a brand gets stress-tested. It has to read as flat artwork and survive being worn, stuffed in a bag, and rained on, with fabric, paper, and plastic all pulling from the same identity.",
        role: "I designed the merch family of tote, shirt, and printed wristband, using the visualizer-bar pattern as the connective tissue so the pieces read as a set rather than three one-offs.",
        body: "Each piece carries the bars differently: wrapped tight around the wristband, blown up large on the tote, run across the back of the shirt. The test I kept coming back to was simple: could you recognize WWIMF from across a field by pattern alone?",
        media: [
          { type: 'image', src: '/projects/wwimf/merch-wristband-new.png' },
         { type: 'image', src: '/projects/wwimf/Totebag-cooler.png',  },
          { type: 'image', src: img('SrsSN7QpTyN8chUaACfrkQqLA', 1800) },
          { type: 'image', src: '/projects/wwimf/wristband_on_someones_wrist.png',  },
          { type: 'image', src: '/projects/wwimf/Totebag_on_persons_arm.png',  },
          { type: 'image', src: '/projects/wwimf/person_wearing_back_of_shirt.png',  },
          
        ],
        layout: { type: 'uniform', cols: 3, aspect: '3/2' },
      },
      {
        eyebrow: '05',
        title: 'Instagram Posts',
        context: "Before a first festival exists, social media has to do two jobs at once: announce the lineup and prove the visual world is real before anyone has ever stood in it.",
        role: "I built an artist-spotlight template flexible enough to carry any genre while staying unmistakably WWIMF: same grid, same type, swap the artist and the color block.",
        body: "The series introduces artists joining the lineup, pairing photography with bold type and the visualizer pattern. Keeping the structure fixed lets the artists themselves provide the variety, so the feed stays cohesive no matter who gets announced next.",
        media: [
          { type: 'image', src: img('NXZFs92bNHiD1jXMWJevPDU') },
          { type: 'image', src: img('Y2ye6xXMz2HALEAzxNW0wpr4VA') },
          { type: 'image', src: img('Mkx7TGojidK6CkPMAJMAwgTc3Q') },
          { type: 'image', src: img('E9fpj1LaWmYKoK5PcryvoyJGdo') },
        ],
        layout: {
          type: 'uniform',
          cols: 4,
          aspect: '1/1',
        },
      },
      {
        eyebrow: '06',
        title: 'Marketing',
        context: "The daily lineup posters had to work as schedules you could read at a glance and as artwork people would actually want to keep after the weekend was over.",
        role: "I designed three posters around a shared grid: one per day, color-coded, with the visualizer pattern receding into background texture and the artist names doing the typographic heavy lifting.",
        body: "Each poster organizes a full day of performances without going quiet: the hierarchy holds at street distance, and the details reward a closer read. They were built to live everywhere at once, across festival grounds, social feeds, and citywide print.",
        media: [
          { type: 'image', src: img('z95EhHshRBIBeZfkAkZ1bhkEONU', 1400) },
          { type: 'image', src: img('vuKP1K8MvNVJo8MiWI9lybFOvA', 1400) },
          { type: 'image', src: img('1QuHHwmXoPDzzL9rlzo4N6nrE', 1400) },
        ],
        layout: {
          type: 'uniform',
          cols: 3,
          aspect: '2/3',
        },
      },
      {
        eyebrow: '07',
        title: 'Marketing Visualization',
        context: "A poster that only ever lives on a screen hasn't proven anything. These mockups put the campaign out in the city, on bus shelters, subway panels, and plywood walls, to see if it survives.",
        role: "I composited the lineup posters into photographed urban environments, choosing surfaces that match the festival's tone: street-level, a little chaotic, very public.",
        body: "Seeing the work at scale, surrounded by real visual noise, was the honest test of the system. The bold type and day color-coding hold up in high-traffic settings, and the campaign starts doing what festival marketing actually has to do: catch someone mid-commute and make them look up the lineup.",
        media: [
          { type: 'image', src: img('W2IZkcmxISHxaNSOWQ9F9Hv8', 1800) },
          { type: 'image', src: img('IBOdBrAVsLSNJPOK9RmgTbBuW8g', 1800) },
          { type: 'image', src: img('1IoQANhAdu3stz4VErq3a1UlXg', 1800) },
          { type: 'image', src: jpg('YmYwKaLbrN1SU5XyaipJcTVn4ow', 2000) },
        ],
        layout: {
          type: 'uniform',
          cols: 2,
          aspect: '3/2',
        },
      },
      {
        eyebrow: '08',
        title: 'Animations',
        context: "A visualizer that doesn't move is just a pattern. The bars needed to come to life as motion pieces the festival could run across screens, stage visuals, and social.",
        role: "I animated the visualizer system as audio-reactive motion, tuning the timing to feel rhythmic without being literally beat-matched, since the music it sits behind will always vary.",
        body: "The animations pulse, shift, and respond the way a crowd does, carrying the brand's waveform pattern and color gradients into motion. This was also the brand's proof of concept: the identity wasn't borrowing the look of a music visualizer anymore; it was behaving like one.",
        media: [{ type: 'video', src: vid('Pl1quVl6bu6Uo42E8OOl05tDSjc'), aspect: '16/9', poster: '/posters/Pl1quVl6bu6Uo42E8OOl05tDSjc.jpg'  }],
        layout: {
          type: 'uniform',
          cols: 1,
          aspect: '16/9',
        },
      },
      {
        eyebrow: '09',
        title: 'Capstone Show Setup',
        context: "Fusion is RIT's senior capstone show, and it gave WWIMF its one chance to exist physically. The booth had to translate a screen-based brand into a space people walk past in seconds.",
        role: "I designed the booth: dual-screen animation loops, printed lineup posters, an info panel, and the WWIMF book on a plinth. I treated it as a small-scale stand-in for the festival itself.",
        body: "A booth gets maybe eight seconds of someone's attention. The screens earn the stop, the posters hold it, and the book is there for anyone who wants to go deep. The conversations it started at the show were the closest the festival ever came to having a real audience, which, for a project about participation, felt like the right ending.",
        fieldNote: 'A booth at a capstone show has eight seconds to communicate before someone walks past. Solve that and you can defend the whole rest of the project in the conversation it earns you.',
        media: [
          { type: 'image', src: img('Qy3WsjTQu7UQBnFGQ7BRQtxQT3Q', 1400) },
          { type: 'image', src: img('PmQD3v5WO4MKgqwtUDsCMoQGYw', 1400) },
        ],
        layout: {
          type: 'uniform',
          cols: 2,
          aspect: '3/4',
        },
      },
      {
        eyebrow: '10',
        title: 'WWIMF Book',
        context: "Every part of the project needed a permanent home: one object where the identity, the environments, the interactive systems, and the case for the festival's existence could sit together.",
        role: "I wrote, designed, and printed the art book that doubles as the brand's bible: identity, environments, interactive systems, marketing, and motion stills, all in one volume.",
        body: "The book is the project's final word, part brand guide and part world-building document. It walks through how the festival looks, how it behaves, and why it should exist. Flipping through it is the closest thing to attending WWIMF; you can read it cover to cover below.",
        media: [
          {
            type: 'embed',
            src: 'https://online.fliphtml5.com/gwqwl/oqte/index.html',
            aspect: '16/9',
            label: 'Open in new tab →',
          },
        ],
        layout: {
          type: 'uniform',
          cols: 1,
          aspect: '16/9',
        },
      },
    ],
  },
  {
    id: 'taco-bell',
    kind: 'professional',
    title: 'Taco Bell',
    cover: img('WJoqOnXjeHEhfNWLt27wGXvkTwg', 800),
    coverVideo: '/projects/taco-bell/hero.mp4',
    themeColor: '#7a2e8a',
    tags: ['Creative Direction', 'Marketing', 'Motion Design'],
    client: 'Taco Bell',
    date: '2024–2025',
    role: 'Graphic Design, Motion Design',
    year: '2024–25',
    len: 188,
    blurb: 'Feed the Beat Campaign',
    desc: "Feed The Beat is Taco Bell's program for spotlighting emerging musicians, and I spent a year designing its social campaigns. Every drop introduced a new batch of artists across genres, and every asset had to do two jobs at once: feel like Taco Bell at first glance and like the artist at second glance. The real work was building a visual system strong enough to carry roughly fifty artists without ever looking like a template.",
    brief: {
      eyebrow: 'The Brief',
      lead: "Feed The Beat is Taco Bell's ongoing platform for spotlighting emerging artists. The work had to feel like Taco Bell on first glance and like the artist on second glance. Both, every time, at scroll speed.",
      body: [
        "Every drop introduced a new batch of artists across genres: indie rock, pop, hip-hop, electronic. The design had to flex enough to honor each artist's identity while staying recognizably Feed The Beat at a thumbnail size, on a vertical feed, in three seconds.",
        "Output was high-volume and recurring: six campaign sets, around 50 individual assets, plus a longer-form motion piece. The system mattered more than any single post. Once the template was right, the work was about applying it consistently across artists without losing energy.",
      ],
    },
    approach: {
      eyebrow: 'The Approach',
      intro: "Volume work needs a system. I designed Feed The Beat as a kit, not a campaign: a shared frame artists could be dropped into without redesigning the world each time. Then I refined the kit across six drops as I learned what landed.",
      steps: [
        { label: 'Step 01', title: 'Frame', body: 'Lock the brand zone (Taco Bell mark, Feed The Beat lock-up, safe areas) before touching the artist content.' },
        { label: 'Step 02', title: 'Flex', body: "Build artist swap-in layers that adapt to portrait, full-body, or text-driven coverage." },
        { label: 'Step 03', title: 'Color', body: 'Pull a 2–3 color palette from each artist\'s own world, never the same palette twice in a row.' },
        { label: 'Step 04', title: 'Ship', body: 'Export per platform from a single source file: Reels, Stories, feed, all from one comp.' },
        { label: 'Step 05', title: 'Refine', body: 'Each drop pulls one lesson from the last: type sizing, contrast, motion timing.' },
      ],
    },
    recap: {
      eyebrow: 'The Recap',
      headline: 'Roughly 50 artists, one kit, one voice.',
      stats: [
        { value: '~50+', label: 'Social assets shipped' },
        { value: '05+', label: 'Campaign drops' },
        { value: '100+', label: 'Tacos Consumed' },
        { value: '12', label: 'Months in market', unit: 'MO' },
      ],
    },
    sections: [
      // 1. THE VIDEO + FLANKING STILLS — now the lead section, carries the
      //    "Feed The Beat" heading and the canonical description.
      {
        eyebrow: 'Feed The Beat',
        title: 'Feed The Beat',
        context:
          "Feed The Beat introduces new artists in batches, and these are the social campaigns that did it. I designed each drop as a kit: a locked Taco Bell frame with swap-in artist layers, so roughly fifty musicians could move through the system without it ever reading as a template. Beyond the social sets, I designed the motion graphic that hypes up the roster, built a poster carrying the names of every artist on it, and helped with the packaging side of the program as well. The carousels below show the campaign sets, grouped by their shared color palettes.",
        media: [],
        layout: {
          type: 'mixed',
          rows: [
            {
              cols: 3,
              aspect: '4/5',
              media: [
                { type: 'image', src: jpg('o8quG272pFPMvf5cGvKIhFf76g', 1000) },
                { type: 'video', src: vid('mapIVkLme38jlUiMsbxlEfisFBM'), aspect: '4/5' },
                { type: 'image', src: jpg('jR0AhbZQNHyeAdnAvvlkDFuPdM', 1000) },
              ],
            },
          ],
        },
      },
      // 2. HERO IMAGE — sits directly under the video section
      {
        title: '',
        media: [{ type: 'image', src: jpg('63aOXKIxowYxm2ZkN1iAs800E', 2000) }],
        layout: { type: 'uniform', cols: 1, aspect: '16/9' },
      },
      // 3-5. CAROUSELS — three merged carousels combining color-matched
      //      campaign sets (live site had 6 carousels; these merge the
      //      paired sets that share the same color palette).
      //
      // Carousel 1: sets 1 + 4 merged (16 images)
      {
        title: '',
        media: [
          { type: 'image', src: img('WJoqOnXjeHEhfNWLt27wGXvkTwg', 800) },
          { type: 'image', src: img('QinypJ6EZZl2PxsikGi8LxH7rI', 800) },
          { type: 'image', src: img('MIC8H4bXAQm2mNj9Y65agGW1Eg', 800) },
          { type: 'image', src: img('OTL7uPOcESMtqS94Z9Duez3zug', 800) },
          { type: 'image', src: img('KxxjaeQYhjNg9bmWNo37hm7Bk', 800) },
          { type: 'image', src: img('xULBx27t9CKcxctPJyrnOlQmZs', 800) },
          { type: 'image', src: img('dYZN9PqZAH7rsAjoNfm0X3Hy31s', 800) },
          { type: 'image', src: img('1L08UResr99bfGx0dyyscmyJSQ', 800) },
          { type: 'image', src: img('DTFgtKaf4W0ASJj3wRA6M0SAO2g', 800) },
          { type: 'image', src: img('RM0qw0GFu2HlsXykQ0S9SN817Y0', 800) },
          { type: 'image', src: img('4m7nvTUPJ5Peaoz12wByOsoPCpI', 800) },
          { type: 'image', src: img('J9KtP6tfhZVpKU7xrWzP9IPMqXc', 800) },
          { type: 'image', src: img('jKjWueHE4Qq4hrExfticcZtsbto', 800) },
          { type: 'image', src: img('L6HHywidixyksaKzUfdvPuuKt4', 800) },
          { type: 'image', src: img('nROXYm5aRxay6E93SF25CUAlluM', 800) },
          { type: 'image', src: img('dtArTiIFnI8H31tLKnOQdEs0Ukg', 800) },
        ],
        layout: { type: 'carousel', aspect: '9/16', visible: 4 },
      },
      // Carousel 2: sets 2 + 5 merged (13 images)
      {
        title: '',
        media: [
          { type: 'image', src: img('CpK6sL4Ca8n0g1rDyovBAbI7M4', 800) },
          { type: 'image', src: img('vNUDzO04xvQcoZ9krMjzUziqKw', 800) },
          { type: 'image', src: img('GTaoryMjDqdt31bStBwjD1VNDk', 800) },
          { type: 'image', src: img('Ix9O7siEQORLQAOyXkyevV4pQ', 800) },
          { type: 'image', src: img('lsqIP4Lmt9l3Aff7VWi3m2yfQUk', 800) },
          { type: 'image', src: img('A8EahCbmUoBL3FSikxxGMmScgYM', 800) },
          { type: 'image', src: img('n50FkjKb5qEuOIoSihuzXUug9c', 800) },
          { type: 'image', src: img('PgLX3uOS9zFNRWIqAO3eKdOjDKQ', 800) },
          { type: 'image', src: img('U9yieMsonoNFbXxxRhdDD3nJU8', 800) },
          { type: 'image', src: img('E5LVEfeGnVTR9wVe7N25BPkGhjg', 800) },
          { type: 'image', src: img('cRemDfF3RljOX0QrmABTv0wWyM', 800) },
          { type: 'image', src: img('DiNhNyzDj4dRND3tzhRg2C1Qt4', 800) },
          { type: 'image', src: img('8cqX82V4hFSm3N8oshOdb4deG9I', 800) },
        ],
        layout: { type: 'carousel', aspect: '9/16', visible: 4 },
      },
      // Carousel 3: sets 3 + 6 merged (16 images)
      {
        title: '',
        media: [
          { type: 'image', src: img('FaBFN1wAQD4SBQtyw4qBlTm9Vug', 800) },
          { type: 'image', src: img('LRzQBS1vj7Nk6N8NLk4DSVSDn8', 800) },
          { type: 'image', src: img('dcw5lrjVDnbGdfipQrRzEMWCM', 800) },
          { type: 'image', src: img('BJIBErSrjVqsJvO2oiPEZH3VVEY', 800) },
          { type: 'image', src: img('SAHMpheWMzMBJzFuYI2tV0KOQZg', 800) },
          { type: 'image', src: img('kI7MFEv683x0Cqh63prYiop0pdQ', 800) },
          { type: 'image', src: img('3zB4NalMAvLAnX4J7ij9b8HA', 800) },
          { type: 'image', src: img('KfcTXKzUHayaCDqEkz6XZwM3d4', 800) },
          { type: 'image', src: img('xy2xZpnFgQQHFiIGVmxJrQYYfl0', 800) },
          { type: 'image', src: img('Kw7ngQ5sLaXnk71XhDg8wJrDbLg', 800) },
          { type: 'image', src: img('nCMHVbIk2Zmwp5NtxYsW2KOdou0', 800) },
          { type: 'image', src: img('oBBd5u58gvFVMkGlD2jLgyvESM', 800) },
          { type: 'image', src: img('RJfyF6atwlrtcti388DVw6QOF4', 800) },
          { type: 'image', src: img('y8EbHgYsErOqcRLp6PDoMOWZNh0', 800) },
          { type: 'image', src: img('qaZqsMfiEtGdHdHkQqxH0hAZnQk', 800) },
          { type: 'image', src: img('17gJFO5wLMLh4iHXnJCgkww8mw', 800) },
        ],
        layout: { type: 'carousel', aspect: '9/16', visible: 4 },
      },
    ],
  },
  {
    id: 'mnrk-heavy',
    kind: 'professional',
    title: 'MNRK Heavy',
    cover: '/covers/mnrk-heavy.jpg',
    coverVideo: '/projects/mnrk-heavy/hero.mp4',
    themeColor: '#7a0e0e',
    tags: ['Creative Direction', 'Social Media', 'Marketing'],
    client: 'MNRK Heavy',
    date: '2024–2025',
    role: 'Graphic Design, Motion Design',
    year: '2024–25',
    len: 201,
    blurb: 'Social Media Design for a Metal Label',
    desc: "MNRK Heavy is a metal and hard rock label with a roster that takes its visuals as seriously as its riffs. I designed a steady stream of social content for the label: anniversary posts, release announcements, artist spotlights, and banner artwork across platforms. The job was matching the intensity of the music without drowning out the individual bands underneath it.",
    brief: {
      eyebrow: 'The Brief',
      lead: "MNRK Heavy needed a steady stream of social design that could sit next to album covers from Lowheaven, Lamb of God, and the rest of the roster without ever looking lighter than the music it was promoting.",
      body: [
        "Heavy music has a distinctive visual culture: high contrast, texture-heavy, type that wants to be a logo. The challenge wasn't inventing that look; it was producing enough of it to keep up with a multi-artist label's release cadence without flattening the bands' individual identities.",
        "Outputs spanned anniversary milestones, release-week stories, artist-spotlight series, and full-bleed header artwork for cross-platform branding. Every piece had to read as MNRK Heavy and as the specific artist underneath it.",
      ],
    },
    approach: {
      eyebrow: 'The Approach',
      intro: "I treated each artist as its own visual world inside an MNRK Heavy frame. Type, texture, and color shifted between Lowheaven and an anniversary post; the label's framing stayed consistent, from the placement of the MNRK mark to the treatment of release info.",
      steps: [
        { label: 'Step 01', title: 'Intake', body: 'Release date, format (single/EP/album), artist visual references.' },
        { label: 'Step 02', title: 'Visual', body: 'Pull the texture and palette directly from the artist\'s cover art.' },
        { label: 'Step 03', title: 'Frame', body: 'Apply MNRK\'s framing rules (mark placement, release info, CTA) last.' },
        { label: 'Step 04', title: 'Cut', body: 'Build all platform variants from one master comp.' },
        { label: 'Step 05', title: 'Animate', body: 'Where the format allows, add a short motion treatment for Stories.' },
      ],
    },
    recap: {
      eyebrow: 'The Recap',
      headline: 'Heavy music. Heavy output.',
      stats: [
        { value: '10+', label: 'Artist campaigns' },
        { value: '01', label: 'Animated promo' },
        { value: '02', label: 'Carousel systems' },
        { value: '04', label: 'Thanksgiving meals' },
      ],
    },
    sections: [
      {
        eyebrow: 'Social & Promo',
        title: 'Social Media & Promotional Design',
        context:
          "The full range of social design I produced for MNRK Heavy: anniversary milestones, story-format release promos, album announcements, artist spotlights, and cross-platform banner artwork. Heavy music has its own visual culture, so every piece leans into high contrast and texture while pulling its palette from the artist's own album art. The label's frame stays consistent; the worlds inside it change with each band.",
        media: [
          { type: 'image', src: img('9XqPreXztmx0ZFPcME8FfCynnVA', 1080) },
          { type: 'image', src: img('7Qjm7UkhPslMPlb3HtRA64T1QE', 1080) },
          { type: 'image', src: img('xA6rDRB3b4PRoj1L2MANFaoWVCo', 1080) },
        ],
        layout: { type: 'uniform', cols: 3, aspect: '1/1' },
      },
      // Continuation media — vertical story-format release promos
      {
        title: '',
        media: [
          { type: 'image', src: img('9UI8emR67MioNNc1UoERq8vMz0', 800) },
          { type: 'image', src: img('SgEyMzySbt9AZN27bElzAGXEmE', 800) },
          { type: 'image', src: img('apktAu1lcj3lC6YY3hUbyyvyLw', 800) },
        ],
        layout: { type: 'uniform', cols: 3, aspect: '9/16' },
      },
      // Lowheaven trio — two stills flanking a vertical video
      {
        title: '',
        media: [
          { type: 'image', src: img('NMFZUWif8OdwlGY2I1fN82EFbM', 800) },
          { type: 'video', src: vid('FK55AYBGIvyG941MP5Y6r210WQ'), aspect: '9/16' },
          { type: 'image', src: img('Rd92Lba8D84FH3MGc4kcfvfVjXU', 800) },
        ],
        layout: { type: 'uniform', cols: 3, aspect: '9/16' },
      },
      // Portrait release announcements — 4-up
      {
        title: '',
        media: [
          { type: 'image', src: img('ehNHhSGMI7HnTwITsjX9yhvXU4', 1000) },
          { type: 'image', src: img('HMVx8iZd2TefUWO8Vz6jRNfXXY', 1000) },
          { type: 'image', src: img('yPZFXNjclLlWDlt68KG5yKV8tLA', 1000) },
          { type: 'image', src: img('PPdTtg6dUObxX4DSpZNpuvop8', 1000) },
        ],
        layout: { type: 'uniform', cols: 4, aspect: '4/5' },
      },
      // Ultra-wide header banners — 3:1 ratio
      {
        title: '',
        media: [
          { type: 'image', src: img('q67CSkcAjKBKwr5vmOJvUNJMvg', 2000) },
          { type: 'image', src: img('r5HqxivM3ZGsL1vwlto2nKbRPMo', 2000) },
        ],
        layout: { type: 'uniform', cols: 1, aspect: '3/1' },
      },
    ],
  },
  {
    id: 'consensus',
    kind: 'professional',
    title: 'Consensus',
    cover: '/covers/consensus.jpg',
    coverVideo: '/projects/consensus/hero.mp4',
    themeColor: '#0e2e7a',
    tags: ['Creative Direction', 'Motion Design', 'Conference'],
    client: 'CoinDesk',
    date: '2024–2025',
    role: 'Graphic Design, Motion Design',
    year: '2024–25',
    len: 236,
    blurb: 'Conference Creative & Motion',
    desc: "Consensus by CoinDesk is one of the biggest conferences in crypto, and this work helped build the anticipation that fills it. I created the pre-event creative: animated promos spotlighting speakers and themes, stills to promote those same speakers, and partner-brand party announcements signaling its scale. Three different kinds of asset, one visual identity, all pointed at the same goal of getting people through the doors.",
    brief: {
      eyebrow: 'The Brief',
      lead: "Consensus is CoinDesk's flagship conference, the biggest stage in crypto. The pre-event creative had to feel as serious as a Wall Street keynote and as urgent as a tech launch, all while pushing through a crowded feed.",
      body: [
        "Three asset families: animated promotional pieces highlighting speakers and themes, photographic stills showing the event in motion, and partner-brand cards positioning sponsors against the Consensus identity.",
        "Everything had to read as one event despite being made of three different visual logics (motion, photography, and flat brand work) and had to ladder up to the conference's premium positioning.",
      ],
    },
    approach: {
      eyebrow: 'The Approach',
      intro: 'Conference creative is anticipation-building. The work isn\'t about the event yet; it\'s about making the audience want to be there. I built around three rhythms: motion to create urgency, stills to ground the event in reality, and partner cards to signal scale.',
      steps: [
        { label: 'Step 01', title: 'Anchor', body: 'Lock the Consensus visual language (type, color, motion timing) before producing any individual piece.' },
        { label: 'Step 02', title: 'Motion', body: 'Build the animated promos around speaker reveals and date countdowns.' },
        { label: 'Step 03', title: 'Still', body: 'Compose the photographic visuals to ground the event in a real space.' },
        { label: 'Step 04', title: 'Partner', body: "Design brand-partner cards that honor each sponsor without flattening the event identity." },
        { label: 'Step 05', title: 'Ship', body: 'Cut everything to platform specs and hand off for the rolling pre-event launch.' },
      ],
    },
    recap: {
      eyebrow: 'The Recap',
      headline: 'Pre-conference creative, built to land at scale.',
      stats: [
        { value: '05', label: 'Animated pieces' },
        { value: '04', label: 'Event stills' },
        { value: '02', label: 'Partner cards' },
        { value: '01', label: 'Major conference' },
      ],
    },
    sections: [
      {
        eyebrow: 'Conference Creative',
        title: 'Pre-Event Creative for Consensus',
        context:
          "Everything here was built to make the conference feel inevitable. The motion pieces announce speakers and themes with countdown urgency, the stills promote those same speakers in the event's visual language, and the partner-brand party announcements put sponsor names inside the Consensus identity without flattening either one. Together they ran across social and digital channels in the weeks leading up to the event.",
        // 5 conference promo videos at 16:9
        media: [
          { type: 'video', src: vid('FGmZ7d1wogIeSBmBUxRHuAypA'), aspect: '16/9', poster: '/posters/FGmZ7d1wogIeSBmBUxRHuAypA.jpg' },
          { type: 'video', src: vid('EHi0hyhlfrDou6eTi3ve8ZqNehQ'), aspect: '16/9', poster: '/posters/EHi0hyhlfrDou6eTi3ve8ZqNehQ.jpg' },
          { type: 'video', src: vid('JXI1YO5u54PI8cgTPim0MIRPWw'), aspect: '16/9', poster: '/posters/JXI1YO5u54PI8cgTPim0MIRPWw.jpg' },
          { type: 'video', src: vid('TmWj5VaGCOyES6xO7LWChbAUg'), aspect: '16/9', poster: '/posters/TmWj5VaGCOyES6xO7LWChbAUg.jpg' },
          { type: 'video', src: vid('gew2hxLBzCIYTzlbMQidZYIcPig'), aspect: '16/9', poster: '/posters/gew2hxLBzCIYTzlbMQidZYIcPig.jpg' },
        ],
        layout: { type: 'uniform', cols: 2, aspect: '16/9' },
      },
      // Continuation media — photographic stills at 16:9
      {
        title: '',
        media: [
          { type: 'image', src: img('bfBUPwtLvvm6QWSoaVBGhuEezw', 1600) },
          { type: 'image', src: img('A9M3tgXxg68c2DqXVP5B7peoU0', 1600) },
          { type: 'image', src: img('dx1avfE7wpVXQcWyAoPMfs5VvtM', 1600) },
          { type: 'image', src: img('i3rhojTMqhgewbPs8LOR4Ewi9c', 1600) },
        ],
        layout: { type: 'uniform', cols: 2, aspect: '16/9' },
      },
      // Partner brand cards — square format
      {
        title: '',
        media: [
          { type: 'image', src: img('hccJPn12kNmnUnlQCi3wpIp7dUI', 1600) },
          { type: 'image', src: img('IGB6zWcaQxm6ReXNgvoF3LOt8', 1600) },
        ],
        layout: { type: 'uniform', cols: 2, aspect: '1/1' },
      },
    ],
  },
  {
    id: 'adults',
    kind: 'professional',
    title: 'Adults on FX',
    cover: '/covers/adults.jpg',
    coverVideo: '/projects/adults/hero.mp4',
    themeColor: '#7a1a14',
    tags: ['Creative Direction', 'Interactive Design', 'Marketing'],
    client: 'FX',
    date: '2024–2025',
    role: 'Graphic Design, Motion Design',
    year: '2024–25',
    len: 177,
    blurb: 'Series Launch Campaign',
    desc: "Adults is an FX comedy about a group of twenty-somethings figuring it out together in New York, and this campaign carried its launch. I designed across every surface a series premiere touches: animated screens, reality check game video questions, polaroid prints, cast announcements, menus, posters, banners, and real world mockup examples.",
    brief: {
      eyebrow: 'The Brief',
      lead: "Adults is a new FX series following a chosen-family of young roommates navigating their twenties in New York. The campaign had to translate its sharp, character-driven tone across every surface a show launch touches.",
      body: [
        "The asset families spanned motion to print: animated screens, video questions for the show's reality check game, polaroid prints, cast announcements establishing the ensemble, menus, posters, ultra-wide banners, and real world mockups showing the work in place.",
        "The whole system had to feel like one show. Whether you saw Adults on a banner, in your story feed, or printed on a menu, the brand had to land instantly: same color logic, same type, same ensemble framing.",
      ],
    },
    approach: {
      eyebrow: 'The Approach',
      intro: "Series launches are surface-multiplication problems. The character work is the source of truth. Get the cast positioned and styled right, and every downstream asset (animated screens, menus, posters, banners) inherits from that. Bottom of the stack are the real world mockups: proof the system holds up outside a feed.",
      steps: [
        { label: 'Step 01', title: 'Cast', body: 'Establish each cast member in the announcement art with one consistent treatment.' },
        { label: 'Step 02', title: 'Motion', body: "Build the animated screens and the reality check game's video questions to match the still treatment." },
        { label: 'Step 03', title: 'Polaroid', body: 'Translate the cast into polaroid prints and feed-ready social pieces.' },
        { label: 'Step 04', title: 'Print', body: 'Compose the ensemble into menus and posters for paid and press use.' },
        { label: 'Step 05', title: 'OOH', body: 'Stretch the system to ultra-wide banners and prove it with real world mockups.' },
      ],
    },
    recap: {
      eyebrow: 'The Recap',
      headline: 'One show, six surfaces, one voice.',
      stats: [
        { value: '04', label: 'Animated pieces' },
        { value: '12', label: 'Character + social posts' },
        { value: '04', label: 'Menus + posters' },
        { value: '01', label: 'Show release' },
      ],
    },
    sections: [
      {
        eyebrow: 'Launch Campaign',
        title: 'Launch Campaign',
        context:
          "The full launch system for Adults, starting with the animated screens and video questions from the show's reality check game. From there the campaign fans out into cast announcements that establish the ensemble, polaroid prints, menus, posters, banners, and real world mockups that show the work in place. One tone carries through all of it: sharp, young, and a little chaotic, just like the show.",
        // 4 series trailers at 16:9 — 2 across
        media: [
          { type: 'video', src: vid('Yw37NLO1xKxuLc3BFLZZzWkgQc'), aspect: '16/9', poster: '/posters/Yw37NLO1xKxuLc3BFLZZzWkgQc.jpg' },
          { type: 'video', src: vid('XaZegHDXqqcBixPkXhxX95UQzI'), aspect: '16/9', poster: '/posters/XaZegHDXqqcBixPkXhxX95UQzI.jpg' },
          { type: 'video', src: vid('GloFwqsAum9l3DuM2l44DzuPqcQ'), aspect: '16/9', poster: '/posters/GloFwqsAum9l3DuM2l44DzuPqcQ.jpg' },
          { type: 'video', src: vid('UVgNZoOfRtVKhXN11dlMQJP3Ck'), aspect: '16/9', poster: '/posters/UVgNZoOfRtVKhXN11dlMQJP3Ck.jpg' },
        ],
        layout: { type: 'uniform', cols: 2, aspect: '16/9' },
      },
      // Continuation media — 6-character key art at 4:5
      {
        title: '',
        media: [
          { type: 'image', src: img('sKtr7uRzmThZzKQB0Y4tvdWaAkY', 1000) },
          { type: 'image', src: img('RsyuUFxNSyuC3LfDBe67S2O2l2U', 1000) },
          { type: 'image', src: img('PeeDGfayS7QFYm02uJq5Z29l4U', 1000) },
          { type: 'image', src: img('3rRkPKA1b3sV9QO6RmVXlnu2Spk', 1000) },
          { type: 'image', src: img('Z8qmaK1cRwlqHtyDL8UBb368ozU', 1000) },
          { type: 'image', src: img('hqH68JMyyN6H3h4uce2PGhBq04w', 1000) },
        ],
        layout: { type: 'uniform', cols: 3, aspect: '4/5' },
      },
      // Social posts — 6 at 4:5
      {
        title: '',
        media: [
          { type: 'image', src: jpg('pAGwmQHK4M9NgVDsrOOtKUazUM', 1000) },
          { type: 'image', src: jpg('BnguCFt7PUDPd5DTfJTRVwvEQY', 1000) },
          { type: 'image', src: jpg('iUmjyP55AFisJnCTnYXBo0vL9hg', 1000) },
          { type: 'image', src: jpg('BzCMNFj21LOzgOSGaxJ1qJWpEI', 1000) },
          { type: 'image', src: jpg('7XqztdMWYiYeAl6SGvhg1NyaS4', 1000) },
          { type: 'image', src: jpg('TfIIDZZnzqyKxG0VR93DdliRlA', 1000) },
        ],
        layout: { type: 'uniform', cols: 3, aspect: '4/5' },
      },
      // Theatrical posters — 4 tall posters at 4:5
      {
        title: '',
        media: [
          { type: 'image', src: img('kWR3a7VWmOGOLt89uoLR3ik37hM', 1500) },
          { type: 'image', src: img('CrPZChQ4g0OQ4xC6ksAsCyUKB2s', 1500) },
          { type: 'image', src: img('ulIDLVuokoqOYdcaKpnA26UCk1Y', 1500) },
          { type: 'image', src: img('5YQDoENbVCTRKFQd2BoJjFGHJWg', 1500) },
        ],
        layout: { type: 'uniform', cols: 2, aspect: '4/5' },
      },
      // Out-of-home — ultra-wide banners + city panels
      {
        title: '',
        media: [],
        layout: {
          type: 'mixed',
          rows: [
            {
              cols: 1,
              aspect: '3/1',
              media: [
                { type: 'image', src: img('z0afQQwRMQKAw09abIdxjsfMb8', 2000) },
                { type: 'image', src: img('sprEA0UyYz69wnpzHP7eaTwWd0', 2000) },
                { type: 'image', src: img('bOjBtqPB9WtPirF6EOC9NiBYT8', 2000) },
              ],
            },
            {
              cols: 2,
              aspect: '4/3',
              media: [
                { type: 'image', src: img('muOmxaxZ80jgcao1BHqovSS9J4', 1600) },
                { type: 'image', src: img('1RlPb2BIqGyHycFXXRiRFrggqc', 1600) },
                { type: 'image', src: img('c708fzNSRlPXXhM9CZyhxxAs72Y', 1600) },
                { type: 'image', src: img('TClLg2aOR9Kwk0OOuXBiYS1x6I', 1600) },
              ],
            },
          ],
        },
      },
      // Sticker set — 3 small square pieces
      {
        title: '',
        media: [
          { type: 'image', src: img('9ZD5RETiuyP0dfDMRgRfC00j9SQ', 800) },
          { type: 'image', src: img('6sWKyIr98rlHBt0xBlKoMOOM6c', 800) },
          { type: 'image', src: img('OA0jQ6JMkcnNBZOE1RFM7hN0E7M', 800) },
        ],
        layout: { type: 'uniform', cols: 3, aspect: '1/1' },
      },
    ],
  },
  {
    id: 'voltage',
    kind: 'personal',
    title: 'Voltage',
    cover: '/covers/voltage.jpg',
    coverVideo: '/projects/voltage/hero.mp4',
    themeColor: '#7a6a0e',
    tags: ['Concept Work', 'Branding', 'Packaging'],
    client: 'Rochester Institute of Technology',
    date: '2024–2025',
    role: 'Graphic Design, Motion Design, 3D Design',
    year: '2024–25',
    len: 189,
    blurb: 'Beverage Brand & 3D Packaging',
    desc: "Voltage is a conceptual energy drink that mixes lemonade with energy-drink intensity. The idea started with a fact I liked too much to let go: lemons hold real electrical potential. From there I built the entire brand, from naming and identity through packaging, 3D product renders, marketing, and a launch video. The goal was to fill a genuine gap on the shelf, a flavor-forward energy drink that feels bright instead of aggressive, and to prove I could carry a product brand from end to end.",
    brief: {
      eyebrow: 'The Brief',
      lead: "Voltage is a self-initiated beverage brand merging lemonade with energy-drink intensity. The project is part identity exercise, part 3D challenge, and part marketing studio, built to prove the whole product cycle from logo to billboard.",
      body: [
        "The opportunity: a brand category (energy drinks) where the design language is loud, masculine, and visually exhausting. Voltage carves out a different position (bright, citrus-led, electric) and a different aesthetic (clean type, a custom circuit-board pattern, color-coded flavors).",
        "Output spanned identity (logo, type, color), packaging (four flavor labels), 3D production (Blender renders + animated rotations + process documentation), and marketing (posters, OOH mockups, promotional video). One brand, top to bottom.",
      ],
    },
    approach: {
      eyebrow: 'The Approach',
      intro: "Voltage was built as a vertical pipeline where every stage feeds the next. Identity locks the visual rules, packaging applies them to the product, 3D production turns the product into renders, and marketing pushes the renders into the world. Each stage proves the one before it.",
      steps: [
        { label: 'Step 01', title: 'Brand', body: 'Logo, type, color, circuit-board pattern. Lock the identity before anything else.' },
        { label: 'Step 02', title: 'Label', body: 'Apply the identity to four flavor labels, color-coded for instant shelf recognition.' },
        { label: 'Step 03', title: '3D', body: 'Build the can in Blender, render each flavor, animate looping product rotations.' },
        { label: 'Step 04', title: 'Market', body: 'Compose marketing posters using the 3D renders as the product hero.' },
        { label: 'Step 05', title: 'Pitch', body: 'Visualize the brand in real-world urban environments and close with a promo video.' },
      ],
    },
    recap: {
      eyebrow: 'The Recap',
      headline: 'A full beverage brand, designed inside-out.',
      stats: [
        { value: '04', label: 'Flavor labels' },
        { value: '04', label: '3D Blender renders' },
        { value: '04', label: 'Marketing posters' },
        { value: '01', label: 'Promo video' },
      ],
    },
    sections: [
      {
        eyebrow: '01',
        title: 'Visual Identity',
        context: "A beverage brand's identity has to work three ways at once: as a logo, as a label wrapped around a can, and as a 3D render under studio lighting. Every type and color decision here had to survive all three.",
        role: "I designed the wordmark with a lightning bolt built into the L, paired Azo Sans with Azo Sans Uber for the type system, and created the circuit-board pattern that becomes the brand's connective texture across everything that follows.",
        fieldNote: "The bolt in the L isn't the joke; it's the wordmark's structural anchor. Once that idea existed, every other Voltage decision pointed back to it.",
        body: "The logotype uses heavy geometric letterforms with sharp angles and strong contrast, built to read as power and clarity rather than caffeine jitters. The bolt in the \"L\" is a quiet double reference: the energy theme, and the lemon the whole brand runs on.\n\nAzo Sans and Azo Sans Uber carry the type system, and a stylized circuit-board pattern runs underneath everything, reinforcing the tagline at the center of the brand: \"Shockingly Refreshing.\"",
        // Tall 9:16 brand sheet — single column
        media: [{ type: 'image', src: img('JE4wdFyL0g8XA0wKwjzvL7Fr6Kw', 1800) }],
        layout: { type: 'uniform', cols: 1, aspect: '9/16' },
      },
      {
        eyebrow: '02',
        title: 'Can Labels',
        context: "Energy-drink shelf space is brutally competitive; a label has to register from across the aisle. Color does most of that work, and the type has to land at thumbnail size.",
        role: "I designed four flavor labels (Strawberry, Blueberry, Peach, and Lemon) on a shared circuit-board base, each with its own palette. Same template, four entirely different shelf reads.",
        body: "Each label combines bold typography, a vibrant flavor palette, and the electrified citrus theme. Hold any two cans side by side and they're unmistakably siblings; from across the aisle, the color tells you which one you're reaching for.",
        // 4 labels at 4:3 landscape
        media: [
          { type: 'image', src: img('b0RISJkOQ06NfekAq9PGK7niGY', 1600) },
          { type: 'image', src: img('ugnmRQVWw3CWozlQbyR55DGsv0', 1600) },
          { type: 'image', src: img('BlYdM6ZKjZiJsbZyeZctpvL0Uuo', 1600) },
          { type: 'image', src: img('jcHMRddOVC9QjKlsc7tv0eFpeQ', 1600) },
        ],
        layout: { type: 'uniform', cols: 2, aspect: '4/3' },
      },
      {
        eyebrow: '03',
        title: '3D Can Models',
        context: "The marketing needed photoreal product imagery, and there was no real can to photograph. 3D was the only path that offered both control and quality.",
        role: "I modeled the can in Blender, applied each flavor label, then lit and rendered four production-quality hero shots. The materials (metallic finish, label print texture, condensation) are built to hold up under close inspection.",
        body: "Each render features a different flavor: Lemonade, Strawberry Lemonade, Blueberry Lemonade, and Peach Lemonade. Beyond showing the product, the renders prove the pipeline. These are the same label files from the previous section, wrapped onto a can that doesn't exist, lit like it does.",
        // 4 Blender renders at 16:9
        media: [
          { type: 'image', src: img('DQoikkO2pmXgGZqK0C4JXpTXjY4', 1600) },
          { type: 'image', src: img('Ae5O0G0pqUGLMwDJwXCyFkWCIo', 1600) },
          { type: 'image', src: img('ixUsn96PqPUOQxPypggvH1hY2s', 1600) },
          { type: 'image', src: img('KVXSJK40riHyu7o3HrJWOc8no', 1600) },
        ],
        layout: { type: 'uniform', cols: 2, aspect: '16/9' },
      },
      {
        eyebrow: '04',
        title: '3D Model Process',
        context: "On personal work, process documentation is part of the deliverable. It proves the technical claim and shows the build underneath the render.",
        role: "I captured the in-Blender setup at four stages (modeling, UVs, materials, lighting) so the documentation reads as a build log rather than a finished gallery.",
        fieldNote: 'Showing process is its own design problem. I took the screenshots, then composed them as if they were finished artwork.',
        body: "Screenshots from inside Blender, showing the can before the lighting flatters it. This is the honest part of 3D work: the geometry, the UV layout, and the scene setup that the final renders are built on.",
        // 4 Blender screenshots — 16:9 close enough (4064×2334 ≈ 16:9.2)
        media: [
          { type: 'image', src: img('KUvAzmVSKQrKSfNJ68gGGnY3W1g', 1800) },
          { type: 'image', src: img('beqAjn3BjrgHM8zEyckPaytyDzw', 1800) },
          { type: 'image', src: img('81whZzcoHGxIRSiltaiQzOwaKb0', 1800) },
          { type: 'image', src: img('9A34yn7ONpdUb0xICguoU7pQcc', 1800) },
        ],
        layout: { type: 'uniform', cols: 2, aspect: '16/9' },
      },
      {
        eyebrow: '05',
        title: '3D Animations',
        context: "Looping product animations are the social currency of beverage brands: a few seconds, a full rotation, label legible at every angle.",
        role: "I animated four looping can rotations, one per flavor, lit each one so the label stays readable through the full spin, and rendered them as GIFs for native feed performance.",
        body: "Four looping rotations built in Blender, one per flavor. They showcase the label detail, the typography, and the metallic finish in exactly the format social feeds reward.",
        // 4 looping GIFs at 1:1
        media: [
          { type: 'image', src: gif('6idmvhzQMhJJb5FmolwQjv0Uk') },
          { type: 'image', src: gif('59FXvX8bHcz6aiYEV5VFhLsuMPc') },
          { type: 'image', src: gif('oZaJB5BOn9vdJrwj5dwKAAUg4') },
          { type: 'image', src: gif('dTUDXX9UJw9CA4Vr6hVEyPiFX6g') },
        ],
        layout: { type: 'uniform', cols: 4, aspect: '1/1' },
      },
      {
        eyebrow: '06',
        title: 'Marketing',
        context: "The marketing posters had to use the 3D renders as their hero product, proof that the brand pipeline actually works end to end.",
        role: "I composed four promotional posters with the renders layered over the circuit-board pattern, each one leading with a single flavor as the hero.",
        body: "Each poster pairs one flavor's can with its palette and the circuit-board texture. By this point in the project every element already existed; the posters are the system showing off.",
        // 4 tall posters at 2:3 (3300×5100)
        media: [
          { type: 'image', src: jpg('E8Yv14zoATUufB8yRHLhbxXD0', 1400) },
          { type: 'image', src: jpg('EqdZfJalSYUE7xatLqGFI9E1yrw', 1400) },
          { type: 'image', src: jpg('wuZV97Vl9FmsIR6e0nFmxrtuZwY', 1400) },
          { type: 'image', src: jpg('X1ibuLh4fLYjxyDyBDOKk6dRAw', 1400) },
        ],
        layout: { type: 'uniform', cols: 4, aspect: '2/3' },
      },
      {
        eyebrow: '07',
        title: 'Marketing Visualization',
        context: 'A poster in isolation is a design exercise. A poster on a bus shelter is a brand. The mockups had to prove the marketing system would survive contact with the city.',
        role: "I composited the posters into four real-world environments (outdoor walls, cafés, transit, sidewalks), choosing each surface to match Voltage's downtown, slightly electric tone.",
        body: "The campaign placed where it would actually live: sidewalks, subway stations, cafés, and outdoor walls. Seeing the posters surrounded by real visual noise was the final check that the brand reads at street speed.",
        // 4 mockups in a 2x2 grid at 16:9
        // Note: the last image is natively 4:3 but renders cleanly cover-cropped to 16:9
        media: [
          { type: 'image', src: img('IpI82P0dP2tZgXSG9I6Mks1IJtE', 1600) },
          { type: 'image', src: img('zbcLbTwFqnwn06TRxdXhryWLLo', 1600) },
          { type: 'image', src: img('4GlJStWiYO5TRCWEog9C5UOq0', 1600) },
          { type: 'image', src: img('B0dJI8FyWq9UYskJ7JsR3oWxVgI', 1800) },
        ],
        layout: { type: 'uniform', cols: 2, aspect: '16/9' },
      },
      {
        eyebrow: '08',
        title: 'Promotional Video',
        context: "The brand needed a single closing piece: something that pulled the whole project together in thirty seconds.",
        role: "I edited and animated the launch promo with kinetic type, 3D cans on rotation, the circuit pattern in motion, and an electronic soundtrack. The whole brand pipeline on display in one continuous video.",
        fieldNote: "A launch video isn't a separate deliverable; it's a compression of everything else you made. I made it last so it could pull from everywhere.",
        body: "A short-form launch video introducing Voltage: 3D cans, kinetic typography, and a pulsing electronic soundtrack. Every asset in it comes from earlier in the project, which was exactly the point.",
        // Promotional video at 16:9
        media: [{ type: 'video', src: vid('lt6cuzs8UMkuQy4AWDxo3d5Djpo'), aspect: '16/9', poster: '/posters/lt6cuzs8UMkuQy4AWDxo3d5Djpo.jpg' }],
        layout: { type: 'uniform', cols: 1, aspect: '16/9' },
      },
    ],
  },
];

export const POPULAR = ['the-syndicate', 'wwimf', 'taco-bell', 'mnrk-heavy', 'consensus'];

export const CATEGORIES = [
  { name: 'Motion Design', c: '#d8392c' },
  { name: 'Creative Direction', c: '#2e6bff' },
  { name: 'Branding', c: '#b0408f' },
  { name: 'Interactive Design', c: '#1f9d6b' },
  { name: 'Packaging', c: '#c98a3c' },
  { name: '3D Design', c: '#7a4fd0' },
  { name: 'Concept Work', c: '#3c8fa0' },
  { name: 'Marketing', c: '#e25a26' },
];

// Artist name. Re-exported from SITE_TEXT so the name lives in one place
// (lib/site-text.ts) and everything else that imports `ARTIST` still works.
import { SITE_TEXT } from './site-text';
export const ARTIST = SITE_TEXT.artist.name;

export const getProject = (id: string) => PROJECTS.find((p) => p.id === id);

export const fmtTime = (s: number) => {
  const m = Math.floor(s / 60);
  const r = Math.round(s % 60);
  return m + ':' + String(r).padStart(2, '0');
};
