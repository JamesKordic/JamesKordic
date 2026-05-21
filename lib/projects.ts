// All project content sourced from jameskordic.com
// Assets are served from Framer's CDN; swap to local paths if you self-host.

/* ============ MEDIA TYPES ============ */
export type Media =
  | { type: 'image'; src: string; aspect?: AspectRatio }
  | { type: 'video'; src: string; aspect?: AspectRatio }
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
  /** Media array — used when layout is uniform or for legacy projects. */
  media: Media[];
  /** New layout descriptor. If provided, takes precedence over `cols`. */
  layout?: Layout;
  /** @deprecated Use layout instead. Kept for backward compatibility. */
  cols?: 1 | 2 | 3 | 4;
};

export type ProjectKind = 'professional' | 'personal';

export type Project = {
  id: string;
  kind: ProjectKind;
  title: string;
  cover: string;
  themeColor: string;
  tags: string[];
  client: string;
  date: string;
  role: string;
  year: string;
  len: number;
  blurb: string;
  desc: string;
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
    cover: img('WJoqOnXjeHEhfNWLt27wGXvkTwg', 800),
    themeColor: '#3c3a4a',
    tags: ['Creative Direction', 'Marketing', 'Motion Design'],
    client: 'The Syndicate',
    date: '2024–2025',
    role: 'Graphic Design, Motion Design',
    year: '2024–25',
    len: 262,
    blurb: 'Music & entertainment marketing',
    desc: "An exploration of music and entertainment marketing through collaborative campaign work at The Syndicate, this internship experience spanned projects across indie and major label artists as well as TV, film, and comedy. Responsibilities included creating digital assets, tour and promotional visuals, and event materials, translating each artist or project's unique voice into impactful, audience-driven design and storytelling campaigns.",
    sections: [
      {
        eyebrow: 'Music',
        title: "Guns N' Roses",
        body: "Instagram Reels created for Guns N' Roses, featuring dynamic visuals and music-driven edits to promote tours, music, and fan engagement.",
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
        body: 'Promotional video created for Killphonic Records to showcase Heart of Gold: The Songs of Neil Young Vol. 1. The video highlights featured artists and promotes pre-order availability across multiple digital platforms.',
        // Single horizontal promo video — full width 16:9
        media: [{ type: 'video', src: vid('1bkwSiwMean5Ugrcj5THWu5rK8c'), aspect: '16/9' }],
        layout: { type: 'uniform', cols: 1, aspect: '16/9' },
      },
      {
        eyebrow: 'Comedy',
        title: 'Craig Ferguson',
        body: 'Social media assets designed for Craig Ferguson, featuring curated show clips formatted for multiple digital platforms to highlight his comedic style and drive audience engagement.',
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
        body: "Social media posts created for Last Gang Records, spotlighting music placements in video games, film, and other media, designed to drive engagement and showcase the label's cultural reach.",
        // 3 vertical items in a single row: image | video (center) | image
        media: [
          { type: 'image', src: img('wLWX3ICDe3WN8RjmJIxv26KSk', 1400) },
          { type: 'video', src: vid('IzzjPLgg8Yw88u4F4XjG4RHjyA'), aspect: '9/16' },
          { type: 'image', src: img('QR1zQdH6QNFmHzn0PT4PEGPCRM', 1400) },
        ],
        layout: { type: 'uniform', cols: 3, aspect: '9/16' },
      },
      {
        eyebrow: 'Conference',
        title: 'Indie Week',
        body: 'Branded assets created for Indie Week to promote event speakers, key dates, and on-site signage. Designs supported both digital promotion and in-person visibility across the multi-day conference.',
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
    cover: img('UUebmgTykuRmwaxxSRK1LIPuAk', 800),
    themeColor: '#1d2f7a',
    tags: ['Concept Work', 'Branding', 'Interactive Design'],
    client: 'Senior Capstone',
    date: '2025',
    role: 'Graphic Design, Motion Design',
    year: '2025',
    len: 268,
    blurb: 'Capstone — branding & interactive',
    desc: 'An exploration of how design can support a more immersive and inclusive global festival where music, visual art, and innovation converge with guest engagement. Guests become active contributors through immersive environments, interactive stages, and participatory technology.\n\nPresented at Fusion: 2025 RIT Graphic Design Capstone.',
    sections: [
      {
        eyebrow: '01',
        title: 'Visual Identity',
        body: "The primary logo for WWIMF was built around two core themes: interactivity and music. Bars integrated into the wordmark represent a music visualizer, emphasizing the dynamic and immersive nature of sound central to the festival experience.\n\nA secondary logo extends this concept by combining the visualizer motif with the shape of a hand, a symbol of human interaction, creativity, and expression. The modular design of the bars within the hand allows for customization, reflecting the festival's adaptable and participatory spirit.\n\nWWIMF's typography blends Cityburn Regular with Courier New, creating a balance between experimental energy and technical precision. Cityburn adds a bold, contemporary edge, while Courier New brings a structured, analog feel connecting the identity to both music production and digital interaction. The color system is bold, abstract, and high-energy, using unconventional combinations to echo the festival's immersive and boundary-pushing character. The overall visual system is designed to be flexible, expressive, and suitable across both digital and physical environments.",
        media: [{ type: 'image', src: img('UUebmgTykuRmwaxxSRK1LIPuAk', 1800) }],
        // Brand sheet is 9:16 portrait — single column, full width
        layout: {
          type: 'uniform',
          cols: 1,
          aspect: '9/16',
        },
      },
      {
        eyebrow: '02',
        title: 'Stage Designs',
        body: 'This spread showcases how architecture, lighting, and digital media can fuse to create fully immersive performance spaces. Through a series of conceptual mock-ups and visual studies, we explore biomorphic structures, theatrical light displays, augmented stages, and reactive installations that invite festival-goers to shape, and be shaped by their surroundings. Each design underscores WWIMF\'s commitment to interactivity and multisensory engagement, offering a blueprint for redefining the relationship between music, space, and audience participation on a global scale.',
        // All 4 images are 16:9 — clean 2x2 grid
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
        body: 'At WWIMF, interactivity is central to the experience, transforming attendees from passive spectators into active participants. From touch-responsive environments and immersive tunnels to motion-activated light displays and interactive stages that place audiences beneath the performance itself, every element is designed to react to presence, gesture, and movement.\n\nWearable tech like smart wristbands enables guests to influence live performances and trigger real-time effects. Glow-in-the-dark pens offer opportunities for spontaneous creativity, allowing attendees to leave their mark on the festival\'s physical environment. These tools, combined with collaborative interfaces, empower co-creation and personal expression.\n\nWWIMF reimagines the live music experience by making the audience an integral part of the performance, blurring the boundaries between art, technology, and human connection.',
        // All 4 images at 16:9 — clean 2x2 grid (pen image replaced with new 16:9 version)
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
        body: "WWIMF's merchandise extends the festival's identity into wearable and collectible pieces that blend function, fashion, and interactivity. This section showcases examples including a tote bag, shirt, and festival wristband — each designed to reflect the bold, immersive aesthetic of the event.",
        // 3 images all at 3:2 landscape — single clean row
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
        body: "A series of Instagram posts designed to spotlight new artists joining the WWIMF lineup. Each visual pairs dynamic imagery with bold typography to capture the energy and diversity of the festival's global soundscape.",
        media: [
          { type: 'image', src: img('NXZFs92bNHiD1jXMWJevPDU') },
          { type: 'image', src: img('Y2ye6xXMz2HALEAzxNW0wpr4VA') },
          { type: 'image', src: img('Mkx7TGojidK6CkPMAJMAwgTc3Q') },
          { type: 'image', src: img('E9fpj1LaWmYKoK5PcryvoyJGdo') },
        ],
        // All Instagram posts are 1:1 — clean 4-col row
        layout: {
          type: 'uniform',
          cols: 4,
          aspect: '1/1',
        },
      },
      {
        eyebrow: '06',
        title: 'Marketing',
        body: "Posters designed to showcase the WWIMF daily lineup, highlighting performance dates and featured artists. Each poster balances clarity and visual impact, using bold typography, color coding, and grid-based layouts to organize information while maintaining the festival's immersive aesthetic. These designs function both as promotional materials and informational tools, crafted to be displayed digitally and in print across festival spaces, social media, and citywide advertising. The goal: to communicate schedule details at a glance while reinforcing the identity of the WWIMF.",
        media: [
          { type: 'image', src: img('z95EhHshRBIBeZfkAkZ1bhkEONU', 1400) },
          { type: 'image', src: img('vuKP1K8MvNVJo8MiWI9lybFOvA', 1400) },
          { type: 'image', src: img('1QuHHwmXoPDzzL9rlzo4N6nrE', 1400) },
        ],
        // Posters are 2:3 portrait — 3 columns
        layout: {
          type: 'uniform',
          cols: 3,
          aspect: '2/3',
        },
      },
      {
        eyebrow: '07',
        title: 'Marketing Visualization',
        body: "These urban mockups showcase how WWIMF's lineup posters function in real-world environments — integrated into cityscapes, transit stations, and public walls. The placements emphasize visibility, accessibility, and the posters' ability to stand out in diverse, high-traffic settings. Together, these visualizations present a cohesive strategy for extending festival branding beyond the digital space and into the streets, where curiosity, discovery, and engagement begin.",
        media: [
          { type: 'image', src: img('W2IZkcmxISHxaNSOWQ9F9Hv8', 1800) },
          { type: 'image', src: img('IBOdBrAVsLSNJPOK9RmgTbBuW8g', 1800) },
          { type: 'image', src: img('1IoQANhAdu3stz4VErq3a1UlXg', 1800) },
          { type: 'image', src: jpg('YmYwKaLbrN1SU5XyaipJcTVn4ow', 2000) },
        ],
        // All 3:2 landscape — 2-col grid
        layout: {
          type: 'uniform',
          cols: 2,
          aspect: '3/2',
        },
      },
      {
        eyebrow: '08',
        title: 'Animations',
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
        body: 'Presented at Fusion: 2025 RIT Graphic Design Capstone, this installation showcased the WWIMF brand through a multi-sensory display. The setup included dual-screen animated visuals, printed posters, a branded info poster, and the WWIMF book. This exhibition space served as both a culmination of my senior capstone project and a branded environment in itself, bringing the WWIMF concept to life through spatial design.',
        media: [
          { type: 'image', src: img('Qy3WsjTQu7UQBnFGQ7BRQtxQT3Q', 1400) },
          { type: 'image', src: img('PmQD3v5WO4MKgqwtUDsCMoQGYw', 1400) },
        ],
        // Both photos are 3:4 portrait — 2-col grid
        layout: {
          type: 'uniform',
          cols: 2,
          aspect: '3/4',
        },
      },
      {
        eyebrow: '10',
        title: 'WWIMF Book',
        body: 'This conceptual art book serves as the visual heart of the World Wide Interactive Music Festival brand. Designed to express the spirit of global creativity, connection, and innovation, the book weaves together branding elements, motion stills, interactive concepts, and festival-worldbuilding into one cohesive narrative.',
        // Embedded FlipHTML5 book — landscape format with native page-turn UI
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
    themeColor: '#7a2e8a',
    tags: ['Creative Direction', 'Marketing', 'Motion Design'],
    client: 'Taco Bell',
    date: '2024–2025',
    role: 'Graphic Design, Motion Design',
    year: '2024–25',
    len: 188,
    blurb: 'Feed The Beat campaign',
    desc: "An exploration of how branded storytelling and visual identity can elevate emerging musical talent through Taco Bell's Feed The Beat program, where social media content and strategic partnerships amplify artist visibility and connect audiences through culture-driven design.",
    sections: [
      {
        eyebrow: 'Feed The Beat',
        title: 'Social Campaign Set 01',
        body: "Social media content created for Taco Bell's Feed The Beat program, promoting emerging artists and bands through branded visuals.",
        // 8 vertical social posts, 4 across
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
        media: [
          { type: 'image', src: img('CpK6sL4Ca8n0g1rDyovBAbI7M4', 800) },
          { type: 'image', src: img('vNUDzO04xvQcoZ9krMjzUziqKw', 800) },
          { type: 'image', src: img('GTaoryMjDqdt31bStBwjD1VNDk', 800) },
          { type: 'image', src: img('Ix9O7siEQORLQAOyXkyevV4pQ', 800) },
          { type: 'image', src: img('lsqIP4Lmt9l3Aff7VWi3m2yfQUk', 800) },
          { type: 'image', src: img('A8EahCbmUoBL3FSikxxGMmScgYM', 800) },
        ],
        // 6 social posts — 3 across for taller, more readable presence
        layout: { type: 'uniform', cols: 3, aspect: '9/16' },
      },
      {
        eyebrow: 'Feed The Beat',
        title: 'Social Campaign Set 03',
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
        body: 'Motion graphics extending the campaign across video formats.',
        // Mixed: 2 images at 4:5 portrait + 1 video center
        // Render as a 3-col 4:5 grid; the video uses its own aspect prop
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
        // Full-bleed 16:9 photograph closing the project
        media: [{ type: 'image', src: jpg('63aOXKIxowYxm2ZkN1iAs800E', 2000) }],
        layout: { type: 'uniform', cols: 1, aspect: '16/9' },
      },
    ],
  },
  {
    id: 'mnrk-heavy',
    kind: 'professional',
    title: 'MNRK Heavy',
    cover: img('9XqPreXztmx0ZFPcME8FfCynnVA', 800),
    themeColor: '#7a0e0e',
    tags: ['Creative Direction', 'Social Media', 'Marketing'],
    client: 'MNRK Heavy',
    date: '2024–2025',
    role: 'Graphic Design, Motion Design',
    year: '2024–25',
    len: 201,
    blurb: 'Social design for a metal label',
    desc: 'A series of digital design explorations supporting music promotion and fan engagement for MNRK Heavy. This project involved creating social media assets across multiple platforms to spotlight anniversaries, new releases, and artist milestones — capturing the intensity of heavy metal and hard rock through bold, audience-focused visuals.',
    sections: [
      {
        eyebrow: 'Series',
        title: 'Anniversaries & Milestones',
        // Three square 1:1 posts
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
        // 4 vertical 9:16 story templates
        media: [
          { type: 'image', src: img('9UI8emR67MioNNc1UoERq8vMz0', 800) },
          { type: 'image', src: img('SgEyMzySbt9AZN27bElzAGXEmE', 800) },
          { type: 'image', src: img('apktAu1lcj3lC6YY3hUbyyvyLw', 800) },
          { type: 'image', src: img('Rd92Lba8D84FH3MGc4kcfvfVjXU', 800) },
        ],
        layout: { type: 'uniform', cols: 4, aspect: '9/16' },
      },
      {
        eyebrow: 'Artist Spotlight',
        title: 'Lowheaven',
        body: "A focused promotional set for Lowheaven, featuring vertical static visuals paired with an animated promo. Designed for Instagram Stories and other vertical-first formats, the trio balances the band's still imagery with kinetic motion in the center.",
        // 3 vertical items in a single row: image | animated video | image
        media: [
          { type: 'image', src: img('NMFZUWif8OdwlGY2I1fN82EFbM', 800) },
          { type: 'video', src: vid('FK55AYBGIvyG941MP5Y6r210WQ'), aspect: '9/16' },
          { type: 'image', src: img('ehNHhSGMI7HnTwITsjX9yhvXU4', 1000) },
        ],
        layout: { type: 'uniform', cols: 3, aspect: '9/16' },
      },
      {
        eyebrow: 'Series',
        title: 'Album Releases',
        body: 'Portrait album release announcements for various artists on the MNRK Heavy roster.',
        // 3 album release portraits at 4:5
        media: [
          { type: 'image', src: img('HMVx8iZd2TefUWO8Vz6jRNfXXY', 1000) },
          { type: 'image', src: img('yPZFXNjclLlWDlt68KG5yKV8tLA', 1000) },
          { type: 'image', src: img('PPdTtg6dUObxX4DSpZNpuvop8', 1000) },
        ],
        layout: { type: 'uniform', cols: 3, aspect: '4/5' },
      },
      {
        eyebrow: 'Banners',
        title: 'Header Visuals',
        body: 'Cross-platform banner artwork supporting label-wide branding.',
        // Two ultra-wide 3:1 banners — single column, full width
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
    cover: img('bfBUPwtLvvm6QWSoaVBGhuEezw', 800),
    themeColor: '#0e2e7a',
    tags: ['Creative Direction', 'Motion Design', 'Conference'],
    client: 'CoinDesk',
    date: '2024–2025',
    role: 'Graphic Design, Motion Design',
    year: '2024–25',
    len: 236,
    blurb: 'Conference creative & motion',
    desc: 'A collection of event-driven digital assets developed for Consensus by CoinDesk, designed to build momentum and audience engagement leading up to the conference. This work highlighted featured speakers, partner brands, and key event moments — delivering a cohesive visual identity across social media and digital platforms to drive anticipation and attendance.',
    sections: [
      {
        eyebrow: 'Motion',
        title: 'Animated Conference Assets',
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
    cover: img('sKtr7uRzmThZzKQB0Y4tvdWaAkY', 800),
    themeColor: '#7a1a14',
    tags: ['Creative Direction', 'Interactive Design', 'Marketing'],
    client: 'FX',
    date: '2024–2025',
    role: 'Graphic Design, Motion Design',
    year: '2024–25',
    len: 177,
    blurb: 'Series launch campaign',
    desc: "A promotional design campaign supporting the launch of FX's new series Adults. This work translated the show's tone and visual identity into cohesive assets across social media, digital platforms, and print — driving awareness and audience connection through bold, narrative-focused visuals.",
    sections: [
      {
        eyebrow: 'Motion',
        title: 'Trailers & Promos',
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
    cover: img('JE4wdFyL0g8XA0wKwjzvL7Fr6Kw', 800),
    themeColor: '#7a6a0e',
    tags: ['Concept Work', 'Branding', 'Packaging'],
    client: 'Rochester Institute of Technology',
    date: '2024–2025',
    role: 'Graphic Design, Motion Design, 3D Design',
    year: '2024–25',
    len: 189,
    blurb: 'Beverage brand & 3D packaging',
    desc: 'An exploration of how energy and flavor converge through a reimagined beverage experience. Voltage is a conceptual energy drink brand merging the refreshing taste of lemonade with the bold intensity of an energy drink. Inspired by the electrical potential found in lemons, the brand identity channels a sense of power, clarity, and high-voltage impact across naming, packaging, and visual design.',
    sections: [
      {
        eyebrow: '01',
        title: 'Visual Identity',
        body: "Voltage's visual identity is built to reflect the bold, high-energy personality of the drink itself. The logotype features heavy geometric letterforms with sharp angles and strong contrast, evoking power and clarity. The custom wordmark is paired with an electric bolt icon integrated into the letter \"L,\" a subtle nod to the energy theme and the lemon-powered origin of the brand.\n\nAzo Sans and Azo Sans Uber serve as the primary typefaces. A stylized circuit-board pattern reinforces the brand's core message: \"Shockingly Refreshing.\"",
        // Tall 9:16 brand sheet — single column
        media: [{ type: 'image', src: img('JE4wdFyL0g8XA0wKwjzvL7Fr6Kw', 1800) }],
        layout: { type: 'uniform', cols: 1, aspect: '9/16' },
      },
      {
        eyebrow: '02',
        title: 'Can Labels',
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
    cover: jpg('j8y8xAfZOZidHy4aAQmt91XtGvI', 800),
    themeColor: '#7a2e14',
    tags: ['Concept Work', 'Motion Design', '3D Design'],
    client: 'Nike',
    date: '2024–2025',
    role: 'Graphic Design, Motion Design, 3D Design',
    year: '2024–25',
    len: 223,
    blurb: 'Self-initiated brand exploration',
    desc: "An exploration of Nike's dynamic visual language and culture-defining storytelling through self-initiated design work. This collection reimagines how the brand's iconic identity can extend across diverse mediums, highlighting the adaptability and energy that define Nike's voice.",
    sections: [
      {
        eyebrow: '01',
        title: 'Air Jordan 1',
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
