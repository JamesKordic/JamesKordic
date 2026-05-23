// All project content sourced from jameskordic.com
// Assets are served from Framer's CDN; swap to local paths if you self-host.

/* ============ MEDIA TYPES ============ */
export type Media =
  | { type: 'image'; src: string; aspect?: AspectRatio }
  | { type: 'video'; src: string; aspect?: AspectRatio; fit?: 'contain' | 'cover' }
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
    themeColor: '#3c3a4a',
    tags: ['Creative Direction', 'Marketing', 'Motion Design'],
    client: 'The Syndicate',
    date: '2024–2025',
    role: 'Graphic Design, Motion Design',
    year: '2024–25',
    len: 262,
    blurb: 'Music & entertainment marketing',
    desc: 'A year inside an NYC music & entertainment marketing agency — designing across indie labels, major-label artists, comedy, and film. Five concurrent client tracks. Around 50 shipped assets. One person.',
    brief: {
      eyebrow: 'The Brief',
      lead: "The Syndicate represents artists and entertainment brands — its design team translates each one's distinct identity into campaign-ready assets at scroll velocity.",
      body: [
        "Over twelve months I worked across five concurrent client tracks: tour and release campaigns for Guns N' Roses, a promotional video for Killphonic Records, comedy social for Craig Ferguson, sync-licensing posts for Last Gang Records, and the full visual identity rollout for Indie Week's conference.",
        'Core problem: no two clients shared audience, tone, or format. A Guns N\' Roses Reel and a Last Gang sync post needed to feel like they came from entirely different worlds — while both being produced by the same person, in the same week, to a shared production schedule.',
      ],
    },
    approach: {
      eyebrow: 'The Approach',
      intro: 'To stay fast across five voices, I built a workflow that front-loaded reference and brand intake before opening a design file. Every client got the same five-step treatment, scaled to the size of the deliverable.',
      steps: [
        { label: 'Step 01', title: 'Intake', body: 'Brief, audience, surface, success metric — written down before anything else.' },
        { label: 'Step 02', title: 'Reference', body: "Fan-facing mood, not designer-facing. What does the artist's audience already love?" },
        { label: 'Step 03', title: 'Test', body: 'One 3-second motion test before committing to a direction. Cheap to throw away.' },
        { label: 'Step 04', title: 'Build', body: 'Format-correct specs from frame one — no last-minute reformatting for platform variants.' },
        { label: 'Step 05', title: 'Iterate', body: 'Variant pass for A/B testing and platform-specific fit (Reels, Shorts, TikTok, feed).' },
      ],
    },
    recap: {
      eyebrow: 'The Recap',
      headline: 'A year of shipping, not just designing.',
      stats: [
        { value: '~50', label: 'Assets shipped' },
        { value: '05', label: 'Concurrent clients' },
        { value: '12', label: 'Months', unit: 'MO' },
        { value: '02', label: 'Average turnaround', unit: 'WK' },
      ],
    },
    sections: [
      {
        eyebrow: 'Music',
        title: "Guns N' Roses",
        context: 'Short-form social content to promote the 2024 tour cycle and back-catalog releases. Assets needed to land instantly on TikTok, Reels, and Shorts — speed-readable, album-art-led, motion driven by the music.',
        role: 'Solo design and motion on this client track. Storyboarded each Reel, animated in After Effects, cut to track stems, exported per-platform specs.',
        fieldNote: 'Breakthrough: treating each Reel as a 3-second hook plus 27 seconds of payoff — not 30 even seconds. Engagement jumped once I stopped front-loading band names.',
        // 3 vertical Reels — keep them small, 3 across
        media: [
          { type: 'video', src: vid('TAsErfe3Mav2ZPK82B8hoA7HANs'), aspect: '9/16' },
          { type: 'video', src: vid('c5CmANQj9sWEtQAUdOy0dVCRan8'), aspect: '9/16' },
          { type: 'video', src: vid('m4aBld36mXRoGXa41tRbBPqFMs'), aspect: '9/16' },
        ],
        layout: { type: 'uniform', cols: 3, aspect: '9/16' },
      },
      {
        eyebrow: 'Records',
        title: 'Killphonic Records',
        context: 'Cross-platform promo for Heart of Gold: The Songs of Neil Young Vol. 1 — a covers compilation. The video had to celebrate ten featured artists equally while driving pre-orders across DSPs.',
        role: 'Motion design lead. Designed the typographic system, sequenced artist reveals to the lead single, built platform variants (1:1, 9:16, 16:9).',
        fieldNote: 'Ten artist credits in 45 seconds is a typographic problem, not a video one. Solved with a single grid the camera moved through.',
        // Single horizontal promo video — full width 16:9
        media: [{ type: 'video', src: vid('1bkwSiwMean5Ugrcj5THWu5rK8c'), aspect: '16/9' }],
        layout: { type: 'uniform', cols: 1, aspect: '16/9' },
      },
      {
        eyebrow: 'Comedy',
        title: 'Craig Ferguson',
        context: "Ongoing social content for the comedian's tour and podcast. Clip-curated, designed for repeatable weekly output across Instagram, TikTok, YouTube Shorts.",
        role: 'Design, motion, and edit. Built a reusable lower-third and intro system that the team could refill weekly without losing the on-brand feel.',
        fieldNote: 'The deliverable was less the individual clips, more the system — a kit the team could ship from for months without me.',
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
        context: 'Sync-placement announcements for Last Gang Records — spotlighting label music in games, film, and TV to drive industry awareness and listener discovery.',
        role: 'Static and motion social. Built a flexible template that could swap artist, work, and placement medium without redesigning each post from scratch.',
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
        context: "Full visual rollout for the multi-day music industry conference — speaker announcements, schedule cards, wayfinding signage, social countdowns, and on-site print collateral.",
        role: 'Design across digital and print. Took the existing brand framework and produced roughly 20 deliverables in two weeks ahead of the event.',
        fieldNote: 'Highest-volume project of the year. The brand framework already existed — my job was holding it together across 20 deliverables under deadline.',
        media: [],
        // Mixed aspects — group into:
        //  Row 1: 4 squares (speaker cards, 1:1)
        //  Row 2: 3 tall (1:2 dates)
        //  Row 3: 2 ultra-wide banners (2:1)
        //  Row 4: 4 mixed portraits (9:16, 2:3, 1:1)
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
                { type: 'image', src: img('oqbLVKzEb16nGxMiUuEI1Fo1U0', 800) },
                { type: 'image', src: img('bpHcCcSIeuecSinBTOQMj2IHLm0', 800) },
              ],
            },
            {
              cols: 1,
              aspect: '2/1',
              media: [
                { type: 'image', src: img('uF0VkAU6tFzbjXtqEMY4iFihFm8', 2000) },
                { type: 'image', src: img('mcC9plXqXvGp1TUSOqiiCfCrig', 2000) },
              ],
            },
            {
              cols: 3,
              aspect: '2/3',
              media: [
                { type: 'image', src: img('oBy0pJgzZloupGU62fc8PFXH5c', 1000) },
                { type: 'image', src: img('fNABELlafPtUG70DuR50mudCTaw', 1000) },
                { type: 'image', src: jpg('uUhmvQ8VocFRVIi9A401nWnuNc', 1000) },
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
    title: 'World Wide Interactive Music Festival',
    cover: '/covers/wwimf.jpg',
    themeColor: '#1d2f7a',
    tags: ['Concept Work', 'Branding', 'Interactive Design'],
    client: 'Senior Capstone',
    date: '2025',
    role: 'Graphic Design, Motion Design',
    year: '2025',
    len: 268,
    blurb: 'Capstone — branding & interactive',
    desc: 'A senior capstone reimagining what a global music festival could be when audiences stop being spectators and start being collaborators. Branding, stage design, wearables, marketing, and a 60-page art book — all built around one question: what if every guest left their fingerprint on the festival?',
    brief: {
      eyebrow: 'The Brief',
      lead: "What if a festival could be co-authored by its audience — not just attended by them? WWIMF is a year-long capstone exploring that question through brand, environment, and technology.",
      body: [
        'WWIMF is a conceptual global festival where music, visual art, and emerging tech converge with active guest participation. Audiences become contributors through immersive environments, interactive stages, and participatory wearables that influence what they see and hear in real time.',
        'The project had to deliver as a complete brand system — identity, environment design, merchandise, marketing, motion, and a printed art book — and stand up as a public-facing presentation at Fusion: the 2025 RIT Graphic Design Capstone show.',
      ],
    },
    approach: {
      eyebrow: 'The Approach',
      intro: 'Capstone work lives or dies on cohesion. I built WWIMF as a system from the inside out — identity first, then environments and objects designed against the identity, then marketing built against the environments. Every artifact had to feel like it came from the same festival.',
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
      headline: "A festival that doesn't exist — built like it does.",
      stats: [
        { value: '10', label: 'Brand artifacts' },
        { value: '60', label: 'Page art book', unit: 'PP' },
        { value: '01', label: 'Capstone show' },
        { value: '12', label: 'Months of build', unit: 'MO' },
      ],
    },
    sections: [
      {
        eyebrow: '01',
        title: 'Visual Identity',
        context: "The festival needed an identity that could read across screens, signage, wristbands, and printed booklets without losing its sense of motion. Music had to be present in the mark itself — not just implied by the surrounding design.",
        role: 'Built the primary wordmark, secondary hand-mark, type system (Cityburn + Courier New), and color palette. Designed the modular visualizer bars that show up in every other artifact downstream.',
        body: "The primary logo for WWIMF was built around two core themes: interactivity and music. Bars integrated into the wordmark represent a music visualizer, emphasizing the dynamic and immersive nature of sound central to the festival experience.\n\nA secondary logo extends this concept by combining the visualizer motif with the shape of a hand, a symbol of human interaction, creativity, and expression. The modular design of the bars within the hand allows for customization, reflecting the festival's adaptable and participatory spirit.\n\nWWIMF's typography blends Cityburn Regular with Courier New, creating a balance between experimental energy and technical precision. Cityburn adds a bold, contemporary edge, while Courier New brings a structured, analog feel connecting the identity to both music production and digital interaction. The color system is bold, abstract, and high-energy, using unconventional combinations to echo the festival's immersive and boundary-pushing character. The overall visual system is designed to be flexible, expressive, and suitable across both digital and physical environments.",
        fieldNote: 'The visualizer bars became the load-bearing element of the whole system. Once they existed, every subsequent decision — stage lighting, merch patterns, poster type — pointed back to them.',
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
        context: 'The festival needed environments that justified the participatory premise. A normal stage with a normal crowd in front of it wouldn\'t do — the architecture itself had to invite audience interaction.',
        role: "Concepted four distinct stage typologies — biomorphic structures, projection-mapped facades, light-reactive frames, and audience-immersive surrounds — and rendered them as photoreal mockups for the capstone show.",
        body: "This spread showcases how architecture, lighting, and digital media can fuse to create fully immersive performance spaces. Through a series of conceptual mock-ups and visual studies, we explore biomorphic structures, theatrical light displays, augmented stages, and reactive installations that invite festival-goers to shape, and be shaped by their surroundings. Each design underscores WWIMF's commitment to interactivity and multisensory engagement, offering a blueprint for redefining the relationship between music, space, and audience participation on a global scale.",
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
        context: 'The participation premise needed objects you could actually touch. Without physical artifacts, "interactive festival" stays an abstraction in a brand deck.',
        role: 'Designed the wearable tech (smart wristbands), the glow-in-the-dark pen system, and the touch-responsive surfaces — including the visual language they share, so an attendee picking up a pen feels the same brand they felt on the wristband.',
        body: "At WWIMF, interactivity is central to the experience, transforming attendees from passive spectators into active participants. From touch-responsive environments and immersive tunnels to motion-activated light displays and interactive stages that place audiences beneath the performance itself, every element is designed to react to presence, gesture, and movement.\n\nWearable tech like smart wristbands enables guests to influence live performances and trigger real-time effects. Glow-in-the-dark pens offer opportunities for spontaneous creativity, allowing attendees to leave their mark on the festival's physical environment. These tools, combined with collaborative interfaces, empower co-creation and personal expression.\n\nWWIMF reimagines the live music experience by making the audience an integral part of the performance, blurring the boundaries between art, technology, and human connection.",
        fieldNote: 'Designing for participation means designing the affordance, not the object. The wristband isn\'t a wristband — it\'s a permission slip to influence the show.',
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
        context: 'Festival merch has a unique pressure: it has to look good as a flat artwork AND survive being worn / carried / wristed at full volume. The same identity has to translate to fabric, paper, and plastic.',
        role: 'Designed the merch family — tote, shirt, and printed wristband — using the visualizer-bar pattern as the connective tissue so the pieces read as a set rather than three one-offs.',
        body: "WWIMF's merchandise extends the festival's identity into wearable and collectible pieces that blend function, fashion, and interactivity. This section showcases examples including a tote bag, shirt, and festival wristband — each designed to reflect the bold, immersive aesthetic of the event.",
        media: [
          { type: 'image', src: '/projects/wwimf/merch-wristband-new.png' },
          { type: 'image', src: img('xElnq0fSkrSMcOxT7PsQvfu0FbE', 1800) },
          { type: 'image', src: img('SrsSN7QpTyN8chUaACfrkQqLA', 1800) },
        ],
        layout: { type: 'uniform', cols: 3, aspect: '3/2' },
      },
      {
        eyebrow: '05',
        title: 'Instagram Posts',
        context: "Pre-festival social had to do two jobs at once: announce the lineup and prove the festival's visual world before anyone had ever been to it.",
        role: 'Designed an artist-spotlight template that could carry any genre while staying recognizably WWIMF — same grid, same type, swap the artist and the color block.',
        body: "A series of Instagram posts designed to spotlight new artists joining the WWIMF lineup. Each visual pairs dynamic imagery with bold typography to capture the energy and diversity of the festival's global soundscape.",
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
        context: 'The festival needed daily lineup posters that worked equally well as functional schedules and as decorative pieces fans would want to keep.',
        role: 'Designed three daily posters around a shared grid, color-coded by day, with the visualizer pattern reading as a low-key background texture and the artist names doing the heavy typographic lifting.',
        body: "Posters designed to showcase the WWIMF daily lineup, highlighting performance dates and featured artists. Each poster balances clarity and visual impact, using bold typography, color coding, and grid-based layouts to organize information while maintaining the festival's immersive aesthetic. These designs function both as promotional materials and informational tools, crafted to be displayed digitally and in print across festival spaces, social media, and citywide advertising. The goal: to communicate schedule details at a glance while reinforcing the identity of the WWIMF.",
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
        context: "A poster that lives only on a screen doesn't sell a festival. The visualizations had to prove the brand could survive in the city — bus shelters, subway panels, plywood walls.",
        role: 'Composited the lineup posters into photographed urban environments, choosing surfaces and contexts that matched the festival\'s tone (street-level, slightly chaotic, public).',
        body: "These urban mockups showcase how WWIMF's lineup posters function in real-world environments — integrated into cityscapes, transit stations, and public walls. The placements emphasize visibility, accessibility, and the posters' ability to stand out in diverse, high-traffic settings. Together, these visualizations present a cohesive strategy for extending festival branding beyond the digital space and into the streets, where curiosity, discovery, and engagement begin.",
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
        context: 'The visualizer bars existed as static elements in the brand sheet — but the whole point of a visualizer is movement. They needed to be brought to life as motion stings the festival could use across screens.',
        role: 'Animated the visualizer pattern as an audio-reactive system, tuned the timing to feel rhythmic without being literally beat-matched (the music it accompanies will vary).',
        body: "A series of animated visuals created to extend the WWIMF brand into motion. These animations bring the festival's identity to life through audio-reactive elements and dynamic transitions, mirroring the energy and interactivity at the heart of the event. Designed for use across screens, stage visuals, and social media, these animations reinforce the immersive nature of the festival. Visual motifs from the branding system, like the waveform-inspired pattern and bold color gradients, are animated to pulse, shift, and respond, echoing the rhythm of live music and crowd movement.",
        media: [{ type: 'video', src: vid('Pl1quVl6bu6Uo42E8OOl05tDSjc'), aspect: '16/9' }],
        layout: {
          type: 'uniform',
          cols: 1,
          aspect: '16/9',
        },
      },
      {
        eyebrow: '09',
        title: 'Capstone Show Setup',
        context: "Fusion is RIT's senior capstone show. WWIMF needed to translate from screen-based brand work into a physical exhibition space without losing its energy.",
        role: 'Designed the booth layout — dual-screen animation loops, printed lineup posters, info panel, and the WWIMF book on a plinth. Built the booth as a small-scale stand-in for the festival itself.',
        body: 'Presented at Fusion: 2025 RIT Graphic Design Capstone, this installation showcased the WWIMF brand through a multi-sensory display. The setup included dual-screen animated visuals, printed posters, a branded info poster, and the WWIMF book. This exhibition space served as both a culmination of my senior capstone project and a branded environment in itself, bringing the WWIMF concept to life through spatial design.',
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
        context: "The brand needed a permanent, physical home — somewhere the visual language, the world-building, and the case for the festival's existence could live together in one object.",
        role: "Wrote, designed, and printed a 60-page art book that doubles as the brand's bible: identity, environments, interactive systems, marketing, and motion stills, all in one volume.",
        body: 'This conceptual art book serves as the visual heart of the World Wide Interactive Music Festival brand. Designed to express the spirit of global creativity, connection, and innovation, the book weaves together branding elements, motion stills, interactive concepts, and festival-worldbuilding into one cohesive narrative.',
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
    blurb: 'Feed The Beat campaign',
    desc: "Long-running social design for Taco Bell's Feed The Beat program — the brand's emerging-artist platform. Roughly 50 artist spotlight assets, six campaign drops, one extending motion piece, and a template-driven workflow built to scale.",
    brief: {
      eyebrow: 'The Brief',
      lead: "Feed The Beat is Taco Bell's ongoing platform for spotlighting emerging artists. The work had to feel like Taco Bell on first glance and like the artist on second glance — both, every time, at scroll speed.",
      body: [
        "Every drop introduced a new batch of artists across genres — indie rock, pop, hip-hop, electronic. The design had to flex enough to honor each artist's identity while staying recognizably Feed The Beat at a thumbnail size, on a vertical feed, in three seconds.",
        "Output was high-volume and recurring: six campaign sets, around 50 individual assets, plus a longer-form motion piece. The system mattered more than any single post — once the template was right, the work was about applying it consistently across artists without losing energy.",
      ],
    },
    approach: {
      eyebrow: 'The Approach',
      intro: "Volume work needs a system. I designed Feed The Beat as a kit, not a campaign — a shared frame artists could be dropped into without redesigning the world each time. Then I refined the kit across six drops as I learned what landed.",
      steps: [
        { label: 'Step 01', title: 'Frame', body: 'Lock the brand zone (Taco Bell mark, Feed The Beat lock-up, safe areas) before touching the artist content.' },
        { label: 'Step 02', title: 'Flex', body: "Build artist swap-in layers that adapt to portrait, full-body, or text-driven coverage." },
        { label: 'Step 03', title: 'Color', body: 'Pull a 2–3 color palette from each artist\'s own world — never the same palette twice in a row.' },
        { label: 'Step 04', title: 'Ship', body: 'Export per platform from a single source file — Reels, Stories, feed, all from one comp.' },
        { label: 'Step 05', title: 'Refine', body: 'Each drop pulls one lesson from the last — type sizing, contrast, motion timing.' },
      ],
    },
    recap: {
      eyebrow: 'The Recap',
      headline: 'Roughly 50 artists, one kit, one voice.',
      stats: [
        { value: '~50', label: 'Social assets shipped' },
        { value: '06', label: 'Campaign drops' },
        { value: '01', label: 'Motion piece' },
        { value: '12', label: 'Months in market', unit: 'MO' },
      ],
    },
    sections: [
      {
        eyebrow: 'Feed The Beat',
        title: 'Social Campaign Set 01',
        context: "First drop set the template. The Feed The Beat brand zone, type system, and artist-frame logic that the next five sets would extend all got locked here.",
        role: "Designed the initial campaign kit (frame, type, color rules) and produced the first eight artist spotlight posts off of it. From this point on, future drops were template applications — the design work shifted from inventing to refining.",
        fieldNote: 'The win wasn\'t the eight posts. It was the kit underneath them — once that existed, every subsequent drop took a fraction of the time.',
        media: [
          { type: 'image', src: img('WJoqOnXjeHEhfNWLt27wGXvkTwg', 800) },
          { type: 'image', src: img('QinypJ6EZZl2PxsikGi8LxH7rI', 800) },
          { type: 'image', src: img('MIC8H4bXAQm2mNj9Y65agGW1Eg', 800) },
          { type: 'image', src: img('OTL7uPOcESMtqS94Z9Duez3zug', 800) },
          { type: 'image', src: img('KxxjaeQYhjNg9bmWNo37hm7Bk', 800) },
          { type: 'image', src: img('xULBx27t9CKcxctPJyrnOlQmZs', 800) },
          { type: 'image', src: img('dYZN9PqZAH7rsAjoNfm0X3Hy31s', 800) },
          { type: 'image', src: img('1L08UResr99bfGx0dyyscmyJSQ', 800) },
        ],
        layout: { type: 'uniform', cols: 4, aspect: '9/16' },
      },
      {
        eyebrow: 'Feed The Beat',
        title: 'Social Campaign Set 02',
        body: 'Second drop. The frame from Set 01 stays; the palette shifts to follow a new batch of artists.',
        media: [
          { type: 'image', src: img('CpK6sL4Ca8n0g1rDyovBAbI7M4', 800) },
          { type: 'image', src: img('vNUDzO04xvQcoZ9krMjzUziqKw', 800) },
          { type: 'image', src: img('GTaoryMjDqdt31bStBwjD1VNDk', 800) },
          { type: 'image', src: img('Ix9O7siEQORLQAOyXkyevV4pQ', 800) },
          { type: 'image', src: img('lsqIP4Lmt9l3Aff7VWi3m2yfQUk', 800) },
          { type: 'image', src: img('A8EahCbmUoBL3FSikxxGMmScgYM', 800) },
        ],
        layout: { type: 'uniform', cols: 3, aspect: '9/16' },
      },
      {
        eyebrow: 'Feed The Beat',
        title: 'Social Campaign Set 03',
        body: 'Third drop. By this point the type sizing and contrast rules had stabilized.',
        media: [
          { type: 'image', src: img('FaBFN1wAQD4SBQtyw4qBlTm9Vug', 800) },
          { type: 'image', src: img('LRzQBS1vj7Nk6N8NLk4DSVSDn8', 800) },
          { type: 'image', src: img('dcw5lrjVDnbGdfipQrRzEMWCM', 800) },
          { type: 'image', src: img('BJIBErSrjVqsJvO2oiPEZH3VVEY', 800) },
          { type: 'image', src: img('SAHMpheWMzMBJzFuYI2tV0KOQZg', 800) },
          { type: 'image', src: img('kI7MFEv683x0Cqh63prYiop0pdQ', 800) },
          { type: 'image', src: img('3zB4NalMAvLAnX4J7ij9b8HA', 800) },
          { type: 'image', src: img('KfcTXKzUHayaCDqEkz6XZwM3d4', 800) },
        ],
        layout: { type: 'uniform', cols: 4, aspect: '9/16' },
      },
      {
        eyebrow: 'Motion',
        title: 'Motion Promo',
        context: "Mid-campaign we needed something with motion — not a Reel built from stills, but a piece that justified the format. A breath in the middle of the static campaign feed.",
        role: 'Designed and animated the motion piece, plus the two paired stills that flank it on feed — so the trio reads as a single beat in the otherwise-still campaign.',
        body: 'Motion graphics extending the campaign across video formats.',
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
      {
        eyebrow: 'Feed The Beat',
        title: 'Social Campaign Set 04',
        body: 'Fourth drop. Layout refinements pulled from earlier engagement data — tighter artist crops, larger names.',
        media: [
          { type: 'image', src: img('DTFgtKaf4W0ASJj3wRA6M0SAO2g', 800) },
          { type: 'image', src: img('RM0qw0GFu2HlsXykQ0S9SN817Y0', 800) },
          { type: 'image', src: img('4m7nvTUPJ5Peaoz12wByOsoPCpI', 800) },
          { type: 'image', src: img('J9KtP6tfhZVpKU7xrWzP9IPMqXc', 800) },
          { type: 'image', src: img('jKjWueHE4Qq4hrExfticcZtsbto', 800) },
          { type: 'image', src: img('L6HHywidixyksaKzUfdvPuuKt4', 800) },
          { type: 'image', src: img('nROXYm5aRxay6E93SF25CUAlluM', 800) },
          { type: 'image', src: img('dtArTiIFnI8H31tLKnOQdEs0Ukg', 800) },
        ],
        layout: { type: 'uniform', cols: 4, aspect: '9/16' },
      },
      {
        eyebrow: 'Feed The Beat',
        title: 'Social Campaign Set 05',
        body: 'Fifth drop. Color palettes leaned brighter to break feed monotony as the campaign matured.',
        media: [
          { type: 'image', src: img('n50FkjKb5qEuOIoSihuzXUug9c', 800) },
          { type: 'image', src: img('PgLX3uOS9zFNRWIqAO3eKdOjDKQ', 800) },
          { type: 'image', src: img('U9yieMsonoNFbXxxRhdDD3nJU8', 800) },
          { type: 'image', src: img('E5LVEfeGnVTR9wVe7N25BPkGhjg', 800) },
          { type: 'image', src: img('cRemDfF3RljOX0QrmABTv0wWyM', 800) },
          { type: 'image', src: img('DiNhNyzDj4dRND3tzhRg2C1Qt4', 800) },
          { type: 'image', src: img('8cqX82V4hFSm3N8oshOdb4deG9I', 800) },
        ],
        layout: { type: 'uniform', cols: 4, aspect: '9/16' },
      },
      {
        eyebrow: 'Feed The Beat',
        title: 'Social Campaign Set 06',
        body: 'Final drop. The kit had stabilized into a true system by this point — output speed roughly tripled vs Set 01.',
        media: [
          { type: 'image', src: img('xy2xZpnFgQQHFiIGVmxJrQYYfl0', 800) },
          { type: 'image', src: img('Kw7ngQ5sLaXnk71XhDg8wJrDbLg', 800) },
          { type: 'image', src: img('nCMHVbIk2Zmwp5NtxYsW2KOdou0', 800) },
          { type: 'image', src: img('oBBd5u58gvFVMkGlD2jLgyvESM', 800) },
          { type: 'image', src: img('RJfyF6atwlrtcti388DVw6QOF4', 800) },
          { type: 'image', src: img('y8EbHgYsErOqcRLp6PDoMOWZNh0', 800) },
          { type: 'image', src: img('qaZqsMfiEtGdHdHkQqxH0hAZnQk', 800) },
          { type: 'image', src: img('17gJFO5wLMLh4iHXnJCgkww8mw', 800) },
        ],
        layout: { type: 'uniform', cols: 4, aspect: '9/16' },
      },
      {
        eyebrow: 'Hero',
        title: 'Campaign Hero Shot',
        body: 'Single hero composition closing out the campaign year — the platform identity at full scale.',
        media: [{ type: 'image', src: jpg('63aOXKIxowYxm2ZkN1iAs800E', 2000) }],
        layout: { type: 'uniform', cols: 1, aspect: '16/9' },
      },
    ],
  },
  {
    id: 'mnrk-heavy',
    kind: 'professional',
    title: 'MNRK Heavy',
    cover: '/covers/mnrk-heavy.jpg',
    themeColor: '#7a0e0e',
    tags: ['Creative Direction', 'Social Media', 'Marketing'],
    client: 'MNRK Heavy',
    date: '2024–2025',
    role: 'Graphic Design, Motion Design',
    year: '2024–25',
    len: 201,
    blurb: 'Social design for a metal label',
    desc: 'Social design and motion across MNRK Heavy\'s metal and hard-rock roster — anniversary posts, story-format release promo, artist-spotlight campaigns (including a focused Lowheaven drop), and wide-format header artwork. Intensity at speed, across multiple bands at once.',
    brief: {
      eyebrow: 'The Brief',
      lead: "MNRK Heavy needed a steady stream of social design that could sit next to album covers from Lowheaven, Lamb of God, and the rest of the roster without ever looking lighter than the music it was promoting.",
      body: [
        "Heavy music has a distinctive visual culture — high contrast, texture-heavy, type that wants to be a logo. The challenge wasn't inventing that look; it was producing enough of it to keep up with a multi-artist label's release cadence without flattening the bands' individual identities.",
        "Outputs spanned anniversary milestones, release-week stories, artist-spotlight series, and full-bleed header artwork for cross-platform branding. Every piece had to read as MNRK Heavy AND as the specific artist underneath it.",
      ],
    },
    approach: {
      eyebrow: 'The Approach',
      intro: "I treated each artist as its own visual world inside an MNRK Heavy frame. Type, texture, and color shifted between Lowheaven and an anniversary post; the label's framing — placement of the MNRK mark, treatment of release info — stayed consistent.",
      steps: [
        { label: 'Step 01', title: 'Intake', body: 'Release date, format (single/EP/album), artist visual references.' },
        { label: 'Step 02', title: 'Visual', body: 'Pull the texture and palette directly from the artist\'s cover art.' },
        { label: 'Step 03', title: 'Frame', body: 'Apply MNRK\'s framing rules — mark placement, release info, CTA — last.' },
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
        { value: '02', label: 'Banner systems' },
        { value: '04', label: 'Surface formats' },
      ],
    },
    sections: [
      {
        eyebrow: 'Series',
        title: 'Anniversaries & Milestones',
        context: "Catalog anniversaries are recurring moments for any label — they keep older records active and remind fans the label has history. They needed designs that respected the original album art instead of overpowering it.",
        role: 'Designed the milestone series template — square format, anniversary number locked in a consistent position, album art preserved at full visibility.',
        media: [
          { type: 'image', src: img('9XqPreXztmx0ZFPcME8FfCynnVA', 1080) },
          { type: 'image', src: img('7Qjm7UkhPslMPlb3HtRA64T1QE', 1080) },
          { type: 'image', src: img('xA6rDRB3b4PRoj1L2MANFaoWVCo', 1080) },
        ],
        layout: { type: 'uniform', cols: 3, aspect: '1/1' },
      },
      {
        eyebrow: 'Series',
        title: 'Release Promo Stories',
        context: "Story-format promo needs a different rhythm than feed posts — vertical, fleeting, optimized for a quick tap-through. The system had to swap artists fast without rebuilding the layout each time.",
        role: "Built a vertical story template that could be re-skinned per release in minutes — same hierarchy, swappable artwork and release info.",
        media: [
          { type: 'image', src: img('9UI8emR67MioNNc1UoERq8vMz0', 800) },
          { type: 'image', src: img('SgEyMzySbt9AZN27bElzAGXEmE', 800) },
          { type: 'image', src: img('apktAu1lcj3lC6YY3hUbyyvyLw', 800) },
        ],
        layout: { type: 'uniform', cols: 3, aspect: '9/16' },
      },
      {
        eyebrow: 'Artist Spotlight',
        title: 'Lowheaven',
        context: 'Lowheaven needed a focused promotional set distinct from the regular release-stories cadence — a small dedicated trio that could carry the band\'s atmosphere on its own.',
        role: "Designed two vertical static visuals and paired them with an animated promo in the center. The three pieces share a palette and treatment but each does a different job — context, motion, payoff.",
        fieldNote: "A three-piece release isn't a campaign — it's a beat. Designed it as one composition split across three frames, not three posts.",
        media: [
          { type: 'image', src: img('NMFZUWif8OdwlGY2I1fN82EFbM', 800) },
          { type: 'video', src: vid('FK55AYBGIvyG941MP5Y6r210WQ'), aspect: '9/16' },
          { type: 'image', src: img('Rd92Lba8D84FH3MGc4kcfvfVjXU', 800) },
        ],
        layout: { type: 'uniform', cols: 3, aspect: '9/16' },
      },
      {
        eyebrow: 'Series',
        title: 'Album Releases',
        context: "The portrait-format release announcements covered the bulk of the label's roster — different artists, different aesthetics, same label identity underneath.",
        role: 'Applied the per-artist treatment framework to four releases — each pulling from its own cover art while sharing the MNRK release-info module at the bottom.',
        media: [
          { type: 'image', src: img('ehNHhSGMI7HnTwITsjX9yhvXU4', 1000) },
          { type: 'image', src: img('HMVx8iZd2TefUWO8Vz6jRNfXXY', 1000) },
          { type: 'image', src: img('yPZFXNjclLlWDlt68KG5yKV8tLA', 1000) },
          { type: 'image', src: img('PPdTtg6dUObxX4DSpZNpuvop8', 1000) },
        ],
        layout: { type: 'uniform', cols: 4, aspect: '4/5' },
      },
      {
        eyebrow: 'Banners',
        title: 'Header Visuals',
        context: "MNRK Heavy needed cross-platform banner artwork (YouTube, Spotify, label site headers) that worked at ultra-wide ratios where most album art doesn't.",
        role: 'Composed two ultra-wide banner systems built around stretched-out type and cropped artwork — designed specifically for the 3:1 surface, not retrofit from a square comp.',
        fieldNote: 'Wide banner art is a different design problem than square album art. Treating it that way — instead of resizing a cover — produced work that actually lived on the platforms it was for.',
        body: 'Cross-platform banner artwork supporting label-wide branding.',
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
    title: 'Consensus by CoinDesk',
    cover: '/covers/consensus.jpg',
    themeColor: '#0e2e7a',
    tags: ['Creative Direction', 'Motion Design', 'Conference'],
    client: 'CoinDesk',
    date: '2024–2025',
    role: 'Graphic Design, Motion Design',
    year: '2024–25',
    len: 236,
    blurb: 'Conference creative & motion',
    desc: "Pre-event creative for Consensus, CoinDesk's flagship conference — a series of motion pieces, speaker visuals, and brand-partner cards that built anticipation in the weeks leading up to the show.",
    brief: {
      eyebrow: 'The Brief',
      lead: "Consensus is CoinDesk's flagship conference — the biggest stage in crypto. The pre-event creative had to feel as serious as a Wall Street keynote and as urgent as a tech launch, all while pushing through a crowded feed.",
      body: [
        "Three asset families: animated promotional pieces highlighting speakers and themes, photographic stills showing the event in motion, and partner-brand cards positioning sponsors against the Consensus identity.",
        "Everything had to read as one event despite being made of three different visual logics — motion, photography, and flat brand work — and had to ladder up to the conference's premium positioning.",
      ],
    },
    approach: {
      eyebrow: 'The Approach',
      intro: 'Conference creative is anticipation-building. The work isn\'t about the event yet — it\'s about making the audience want to be there. I built around three rhythms: motion to create urgency, stills to ground the event in reality, and partner cards to signal scale.',
      steps: [
        { label: 'Step 01', title: 'Anchor', body: 'Lock the Consensus visual language — type, color, motion timing — before producing any individual piece.' },
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
        eyebrow: 'Motion',
        title: 'Animated Conference Assets',
        context: 'The animated pieces were the front line of the campaign — the first thing audiences saw scrolling. They had to communicate event, speaker, and date in under five seconds.',
        role: 'Designed and animated five conference promos — speaker reveals, theme spots, and countdown pieces. Built a shared motion grammar so the whole set reads as one campaign.',
        fieldNote: 'Conference motion lives or dies on the first second. Got it right by treating the speaker name as the headline, not the supporting cast.',
        body: 'A series of motion pieces created in the lead-up to Consensus, promoting speakers, key dates, and partner brands.',
        // 5 conference promo videos at 16:9
        media: [
          { type: 'video', src: vid('FGmZ7d1wogIeSBmBUxRHuAypA'), aspect: '16/9' },
          { type: 'video', src: vid('EHi0hyhlfrDou6eTi3ve8ZqNehQ'), aspect: '16/9' },
          { type: 'video', src: vid('JXI1YO5u54PI8cgTPim0MIRPWw'), aspect: '16/9' },
          { type: 'video', src: vid('TmWj5VaGCOyES6xO7LWChbAUg'), aspect: '16/9' },
          { type: 'video', src: vid('gew2hxLBzCIYTzlbMQidZYIcPig'), aspect: '16/9' },
        ],
        layout: { type: 'uniform', cols: 2, aspect: '16/9' },
      },
      {
        eyebrow: 'Stills',
        title: 'Speaker & Event Visuals',
        context: 'Stills did a different job — they made the event feel real. Where motion built anticipation, photography proved this was a physical place with actual people.',
        role: 'Designed the still composition system — speaker portraits, event-floor framing, type overlays that worked across photography without competing with the photo itself.',
        // 4 conference stills at 16:9
        media: [
          { type: 'image', src: img('bfBUPwtLvvm6QWSoaVBGhuEezw', 1600) },
          { type: 'image', src: img('A9M3tgXxg68c2DqXVP5B7peoU0', 1600) },
          { type: 'image', src: img('dx1avfE7wpVXQcWyAoPMfs5VvtM', 1600) },
          { type: 'image', src: img('i3rhojTMqhgewbPs8LOR4Ewi9c', 1600) },
        ],
        layout: { type: 'uniform', cols: 2, aspect: '16/9' },
      },
      {
        eyebrow: 'Partners',
        title: 'Brand Partner Cards',
        context: "Partner brands needed prominent placement without making the event feel like a sponsor wall. The cards had to honor each partner's identity inside the Consensus frame.",
        role: 'Designed the partner-card system — square format, brand mark prominent, Consensus framing applied lightly enough to stay visible without dominating.',
        // 2 square partner cards
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
    themeColor: '#7a1a14',
    tags: ['Creative Direction', 'Interactive Design', 'Marketing'],
    client: 'FX',
    date: '2024–2025',
    role: 'Graphic Design, Motion Design',
    year: '2024–25',
    len: 177,
    blurb: 'Series launch campaign',
    desc: "Full launch campaign for FX's series Adults — trailers, character key art, social, posters, OOH, and stickers. A complete launch system designed to introduce a new show to a feed, a billboard, and a swag drawer all in the same week.",
    brief: {
      eyebrow: 'The Brief',
      lead: "Adults is a new FX series following a chosen-family of young roommates navigating their twenties in New York. The campaign had to translate its sharp, character-driven tone across every surface a show launch touches.",
      body: [
        "Six asset families spanning motion to print: long-form trailers and promos, character key art establishing the ensemble, social cutdowns sized for feed, theatrical-style posters, ultra-wide OOH banners, and a sticker pack for fans.",
        "The whole system had to feel like one show. Whether you saw Adults on a bus shelter, in your story feed, or on a friend's laptop sticker, the brand had to land instantly — same color logic, same type, same ensemble framing.",
      ],
    },
    approach: {
      eyebrow: 'The Approach',
      intro: "Series launches are surface-multiplication problems. The character work is the source of truth — get the cast positioned and styled right, and every downstream asset (trailers, posters, OOH) inherits from that. Bottom of the stack is the sticker pack: small, fast, fan-facing.",
      steps: [
        { label: 'Step 01', title: 'Character', body: 'Establish each cast member as a single key-art unit with consistent treatment.' },
        { label: 'Step 02', title: 'Trailer', body: 'Pull moments from the show into 16:9 cutdowns that match the still character treatment.' },
        { label: 'Step 03', title: 'Social', body: 'Cut the character work down for vertical feed and stories.' },
        { label: 'Step 04', title: 'Poster', body: 'Compose the ensemble into theatrical-style posters for paid and press use.' },
        { label: 'Step 05', title: 'OOH + Swag', body: 'Stretch the system to ultra-wide billboards and tighten it down to stickers.' },
      ],
    },
    recap: {
      eyebrow: 'The Recap',
      headline: 'One show, six surfaces, one voice.',
      stats: [
        { value: '04', label: 'Trailers' },
        { value: '12', label: 'Character + social posts' },
        { value: '04', label: 'Posters' },
        { value: '06', label: 'Asset families' },
      ],
    },
    sections: [
      {
        eyebrow: 'Motion',
        title: 'Trailers & Promos',
        context: "Trailers were the campaign's tentpole — the format with the most narrative room. They had to deliver tone, characters, and premise in under 30 seconds without spoiling the show.",
        role: 'Edited and graphic-designed four trailer/promo cuts at 16:9. Built the show\'s lower-third system, title cards, and end-frames so every cut feels like one piece of franchise work.',
        fieldNote: 'Trailer design is editing more than designing. The graphic system existed to disappear — the show is the show.',
        // 4 series trailers at 16:9 — 2 across for prominence
        media: [
          { type: 'video', src: vid('Yw37NLO1xKxuLc3BFLZZzWkgQc'), aspect: '16/9' },
          { type: 'video', src: vid('XaZegHDXqqcBixPkXhxX95UQzI'), aspect: '16/9' },
          { type: 'video', src: vid('GloFwqsAum9l3DuM2l44DzuPqcQ'), aspect: '16/9' },
          { type: 'video', src: vid('UVgNZoOfRtVKhXN11dlMQJP3Ck'), aspect: '16/9' },
        ],
        layout: { type: 'uniform', cols: 2, aspect: '16/9' },
      },
      {
        eyebrow: 'Character Cards',
        title: 'Key Art',
        context: 'Key art is the source of truth for an ensemble show — every other downstream surface (social, posters, OOH) inherits from how the characters get framed and styled here.',
        role: 'Designed the six-character key art system. Locked treatment, color, and type so each card stands alone but the set reads as one ensemble.',
        // 6 character cards at ~4:5 portrait
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
      {
        eyebrow: 'Social',
        title: 'Social Assets',
        context: 'Vertical and square social posts had to make the character work feel native to feed. Same ensemble identity, recomposed for thumb-stopping platform behavior.',
        role: "Adapted the key-art system into six social-first posts — tighter crops, type sized for vertical, color contrast pushed for feed visibility.",
        // 6 social posts at 4:5
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
      {
        eyebrow: 'Print',
        title: 'Posters',
        context: 'Theatrical-style posters had to feel like premium one-sheets — the kind you actually want to put on a wall — while still functioning as ad units.',
        role: 'Designed four posters with the ensemble as the focal point. Built each as both a finished one-sheet and a flexible base for press, paid, and key-art distribution.',
        fieldNote: 'Show posters work best when they look like artifacts, not advertisements. Designed each one as if it had to survive being printed and pinned to a wall.',
        // 4 tall posters — they're 6600×8400 which is ~11:14, closer to 4:5
        media: [
          { type: 'image', src: img('kWR3a7VWmOGOLt89uoLR3ik37hM', 1500) },
          { type: 'image', src: img('CrPZChQ4g0OQ4xC6ksAsCyUKB2s', 1500) },
          { type: 'image', src: img('ulIDLVuokoqOYdcaKpnA26UCk1Y', 1500) },
          { type: 'image', src: img('5YQDoENbVCTRKFQd2BoJjFGHJWg', 1500) },
        ],
        layout: { type: 'uniform', cols: 2, aspect: '4/5' },
      },
      {
        eyebrow: 'Out of Home',
        title: 'Banners & Placements',
        context: 'OOH had two distinct formats — ultra-wide highway/transit banners and city-panel placements at 4:3. Both had to stop traffic without requiring a viewer to read fine print.',
        role: 'Built the OOH system in two passes: stretched the ensemble across 3:1 banners as a horizontal panorama, then re-cropped for city-panel placements where each character could carry its own panel.',
        body: 'Mixed-format out-of-home placements: ultra-wide horizontal banners and city panel placements.',
        // Mixed: 3 ultra-wide banners (1200×460 ≈ 21/8 — use 3/1 close enough),
        // then 3 nearly-4:3 (1450×1080) + 1 4:3 (1200×900) → mixed rows
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
      {
        eyebrow: 'Stickers',
        title: 'Sticker Set',
        context: 'Stickers are the cheapest, fastest, most fan-facing surface in a launch — the unofficial test of whether a show has a visual identity worth carrying around.',
        role: 'Pulled three motifs from the larger system — character icon, type lockup, and a callback gag — and stripped them down to sticker-sized punch.',
        // 3 stickers — 2 are 1:1, 1 is 600×659 (close enough to 1:1)
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
    themeColor: '#7a6a0e',
    tags: ['Concept Work', 'Branding', 'Packaging'],
    client: 'Rochester Institute of Technology',
    date: '2024–2025',
    role: 'Graphic Design, Motion Design, 3D Design',
    year: '2024–25',
    len: 189,
    blurb: 'Beverage brand & 3D packaging',
    desc: "A conceptual energy drink brand built from scratch — naming, identity, four-flavor packaging system, full 3D can renders, marketing visualization, and a launch promo. Voltage is what happens when lemonade and an energy drink share an outlet.",
    brief: {
      eyebrow: 'The Brief',
      lead: "Voltage is a self-initiated beverage brand merging lemonade with energy-drink intensity. The project is part identity exercise, part 3D challenge, and part marketing studio — built to prove the whole product cycle from logo to billboard.",
      body: [
        "The opportunity: a brand category (energy drinks) where the design language is loud, masculine, and visually exhausting. Voltage carves out a different position — bright, citrus-led, electric — and a different aesthetic — clean type, custom circuit-board pattern, color-coded flavors.",
        "Output spanned identity (logo, type, color), packaging (four flavor labels), 3D production (Blender renders + animated rotations + process documentation), and marketing (posters, OOH mockups, promotional video). One brand, top to bottom.",
      ],
    },
    approach: {
      eyebrow: 'The Approach',
      intro: "Voltage was built as a vertical pipeline — every stage feeds the next. Identity locks the visual rules, packaging applies them to the product, 3D production turns the product into renders, and marketing pushes the renders into the world. Each stage proves the one before it.",
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
        context: 'A new beverage brand needs an identity that works as a logo, as a label, AND as a 3D render. Type and color decisions made here would have to survive being printed, photographed, and rendered at production resolution.',
        role: "Designed the wordmark with the bolt integrated into the L, paired Azo Sans with Azo Sans Uber for type, and built the circuit-board pattern that becomes the brand's connective texture across every later artifact.",
        fieldNote: "The bolt in the L isn't the joke — it's the wordmark's structural anchor. Once that idea existed, every other Voltage decision pointed back to it.",
        body: "Voltage's visual identity is built to reflect the bold, high-energy personality of the drink itself. The logotype features heavy geometric letterforms with sharp angles and strong contrast, evoking power and clarity. The custom wordmark is paired with an electric bolt icon integrated into the letter \"L,\" a subtle nod to the energy theme and the lemon-powered origin of the brand.\n\nAzo Sans and Azo Sans Uber serve as the primary typefaces. A stylized circuit-board pattern reinforces the brand's core message: \"Shockingly Refreshing.\"",
        // Tall 9:16 brand sheet — single column
        media: [{ type: 'image', src: img('JE4wdFyL0g8XA0wKwjzvL7Fr6Kw', 1800) }],
        layout: { type: 'uniform', cols: 1, aspect: '9/16' },
      },
      {
        eyebrow: '02',
        title: 'Can Labels',
        context: "Energy-drink shelf space is brutally competitive — labels have to register from across an aisle. Color coding had to do most of the work; the type had to land at thumbnail size.",
        role: 'Designed four flavor labels (Strawberry, Blueberry, Peach, Lemon) using a unified circuit-board base with flavor-specific color palettes. Same template, four entirely different shelf reads.',
        body: 'Each Voltage flavor features a fully custom label combining bold typography, vibrant color palettes, and an electrified theme rooted in energy and citrus power. Each flavor (Strawberry, Blueberry, Peach, and Lemon) is color-coded for instant recognition.',
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
        context: 'The brand needed photoreal product imagery the marketing could draw from — without ever photographing a real can. 3D was the only path that gave both control and quality.',
        role: 'Modeled the can in Blender, applied each flavor label, lit and rendered four production-quality hero shots. Built the materials (metallic finish, label printing texture, condensation) so they hold up to close inspection.',
        body: 'A full set of 3D can models built in Blender. Each render showcases a different flavor — Lemonade, Strawberry Lemonade, Blueberry Lemonade, and Peach Lemonade — highlighting the distinct color palette and unified circuit-inspired label design.',
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
        context: 'Process documentation is part of the deliverable on personal work — it proves the technical claim and shows the build under the render.',
        role: 'Captured the in-Blender setup at four stages — modeling, UVs, materials, lighting — so the documentation reads as a build log, not a finished gallery.',
        fieldNote: 'Showing process is a separate design problem. Took the screenshots, then composed them as if they were finished artwork.',
        body: 'Inside-Blender screenshots showing visualization and process.',
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
        context: 'Looping product animations are the social currency of beverage brands — 6 seconds, 360° rotation, label visible at every angle.',
        role: 'Animated four looping can rotations, one per flavor. Lit each to hold the label legible across the full spin and rendered as GIFs for native feed performance.',
        body: 'Animated 3D can rotations built in Blender — looping showcases highlighting label detail, bold typography, and metallic finish.',
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
        context: 'Marketing posters had to use the 3D renders as their hero — proof that the brand pipeline actually works end-to-end.',
        role: 'Composed four promotional posters with the renders layered over the circuit-board pattern. Each poster led with a single flavor as the hero product.',
        body: 'Promotional posters built around 3D can renders layered over a custom circuit-board pattern.',
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
        role: "Composited the posters into four real-world environments — outdoor walls, cafés, transit, sidewalks — choosing each surface to match Voltage's downtown, slightly-electric tone.",
        body: 'Mockups visualizing the Voltage campaign in real-world environments — sidewalks, subway stations, cafés, outdoor walls.',
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
        context: "The brand needed a single closing piece — something that pulled the whole project together in 30 seconds.",
        role: 'Edited and animated the launch promo: kinetic type, 3D cans on rotation, circuit pattern in motion, electronic soundtrack. The whole brand pipeline on display in one continuous video.',
        fieldNote: "A launch video isn't a separate deliverable — it's a compression of everything else you made. Made it last so it could pull from everywhere.",
        body: 'Short-form video introducing the Voltage brand with bold energy — 3D cans, kinetic typography, and a pulsing electronic soundtrack.',
        // Promotional video at 16:9
        media: [{ type: 'video', src: vid('lt6cuzs8UMkuQy4AWDxo3d5Djpo'), aspect: '16/9' }],
        layout: { type: 'uniform', cols: 1, aspect: '16/9' },
      },
    ],
  },
  {
    id: 'nike',
    kind: 'personal',
    title: 'Nike',
    cover: '/covers/nike.jpg',
    themeColor: '#7a2e14',
    tags: ['Concept Work', 'Motion Design', '3D Design'],
    client: 'Nike',
    date: '2024–2025',
    role: 'Graphic Design, Motion Design, 3D Design',
    year: '2024–25',
    len: 223,
    blurb: 'Self-initiated brand exploration',
    desc: "Self-directed Nike work — Air Jordan 1 modeling in Blender, in-software process documentation, and an Air Max poster series. Personal exploration with no client constraints, used to push 3D modeling chops and poster composition.",
    brief: {
      eyebrow: 'The Brief',
      lead: "No client. No deck. Just Nike — the brand that taught everyone how product design and graphic design can be the same conversation — and a sustained personal exploration of what it would look like to design for them.",
      body: [
        "Two threads: a high-fidelity 3D recreation of the Air Jordan 1 (full Blender pipeline — model, materials, lighting, render) and a poster series around the Air Max silhouette built as if for a campaign that doesn't exist.",
        "The point of self-directed work is to use it as a sandbox — push craft, prove technical claims, and design against your own brief instead of someone else's. This is the file that gets pointed at when someone asks if I can really model in 3D.",
      ],
    },
    approach: {
      eyebrow: 'The Approach',
      intro: "Personal work earns its keep two ways: by pushing skill or by proving range. I split this project into both — 3D as the technical proof, posters as the design-craft proof. Each one stress-tests a different muscle.",
      steps: [
        { label: 'Step 01', title: 'Model', body: 'Build the Air Jordan 1 in Blender from reference — geometry, panels, stitching, sole.' },
        { label: 'Step 02', title: 'Material', body: 'Apply realistic leather, rubber, lace, and metal textures with proper UV mapping.' },
        { label: 'Step 03', title: 'Render', body: 'Light four hero shots and document the process inside Blender as supporting artifacts.' },
        { label: 'Step 04', title: 'Poster', body: 'Step away from 3D and design an Air Max poster series — gritty, retro, type-led.' },
        { label: 'Step 05', title: 'Compose', body: 'Close with a wide banner that takes the poster system from print into out-of-home.' },
      ],
    },
    recap: {
      eyebrow: 'The Recap',
      headline: 'No client. Full craft.',
      stats: [
        { value: '01', label: 'Full Blender shoe' },
        { value: '04', label: '3D hero renders' },
        { value: '04', label: 'Process screenshots' },
        { value: '04', label: 'Air Max compositions' },
      ],
    },
    sections: [
      {
        eyebrow: '01',
        title: 'Air Jordan 1',
        context: "The AJ1 is a benchmark — anyone can recognize the silhouette, and any inaccuracy in proportion or material reads instantly. Picking it was the point: it's the hardest possible target for a personal 3D project.",
        role: 'Modeled the entire shoe in Blender from reference photography. Built materials (leather, rubber, suede, metal eyelets) with proper UVs, then lit and rendered four hero compositions.',
        fieldNote: "Iconic objects are the hardest to recreate — your eye has decades of reference for what's right. A 2% error in the Swoosh angle becomes the only thing anyone sees.",
        body: 'A personal 3D project recreating the classic Air Jordan 1 in Blender. Focused on realistic textures, accurate proportions, and brand-authentic details for use in product visualization and other assets.',
        // 4 Blender renders at 16:9
        media: [
          { type: 'image', src: jpg('j8y8xAfZOZidHy4aAQmt91XtGvI', 1600) },
          { type: 'image', src: jpg('tpvT1204NNfrqGFeldX6NSly8k', 1600) },
          { type: 'image', src: jpg('ukz59voeVUcYhAHEotViWcxeRU', 1600) },
          { type: 'image', src: jpg('3NYPi1Ly6MIp21jM4cUIToSZSTc', 1600) },
        ],
        layout: { type: 'uniform', cols: 2, aspect: '16/9' },
      },
      {
        eyebrow: '02',
        title: '3D Model Process',
        context: 'Documentation matters more on self-directed work than commissioned work — there\'s no client brief to prove the technical claim. The process screenshots have to do that job themselves.',
        role: 'Captured the build inside Blender at four stages — wireframe, materials, lighting setup, final render. Composed each screenshot as a finished frame rather than a raw cap.',
        body: 'Inside-Blender screenshots showing visualization and process.',
        // 4 Blender screenshots — 16:9 close enough
        media: [
          { type: 'image', src: img('cDhoWJ08o4OgQYnHNUuO8i1Otw', 1600) },
          { type: 'image', src: img('Wu9K2XarX7icedaH1nC33q1XmXw', 1600) },
          { type: 'image', src: img('9z7nH5jIOSAua7j4tov2b2zkK4c', 1600) },
          { type: 'image', src: img('2YfGqZHq8Y8qiGth2KktSlXHDRU', 1600) },
        ],
        layout: { type: 'uniform', cols: 2, aspect: '16/9' },
      },
      {
        eyebrow: '03',
        title: 'Air Max Posters',
        context: 'After spending weeks inside Blender, I wanted to use a totally different muscle — 2D poster composition with no 3D in sight. The Air Max series was the answer: type-led, gritty, retro-energy.',
        role: 'Designed four poster compositions plus one ultra-wide closer. Each leans into a different colorway and pulls its energy from expressive typography and texture rather than product photography.',
        fieldNote: 'Switching between 3D and 2D within the same project is healthy creative cross-training. Each side makes the other look at problems differently.',
        body: 'A bold, stylized poster campaign celebrating the iconic Air Max silhouette. Each composition emphasizes a unique colorway with expressive typography, gritty textures, and retro-inspired energy.',
        // Mixed: 3 tall posters at 2:3 + 1 ultra-wide banner at 2:1
        media: [],
        layout: {
          type: 'mixed',
          rows: [
            {
              cols: 3,
              aspect: '2/3',
              media: [
                { type: 'image', src: jpg('A5Se6fUdCaMnLFO6jkdvMdiS23A', 1200) },
                { type: 'image', src: jpg('zkXcQf10CivlKH176ChPC2biPI', 1200) },
                { type: 'image', src: jpg('woPn8PRw8tjGw0aaU6zCjZt4oKo', 1200) },
              ],
            },
            {
              cols: 1,
              aspect: '2/1',
              media: [
                { type: 'image', src: jpg('02d64IOjIvc0yd2SQnEAoNdjm8', 2000) },
              ],
            },
          ],
        },
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

export const ARTIST = 'James Kordic';

export const getProject = (id: string) => PROJECTS.find((p) => p.id === id);

export const fmtTime = (s: number) => {
  const m = Math.floor(s / 60);
  const r = Math.round(s % 60);
  return m + ':' + String(r).padStart(2, '0');
};
