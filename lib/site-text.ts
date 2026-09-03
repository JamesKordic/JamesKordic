/* ============================================================
 *  SITE TEXT — single source of truth for editable copy
 * ============================================================
 *
 *  This file holds every editable string that appears in the site
 *  outside of the projects themselves. Edit the values below to
 *  change copy across the site — the components pull from here.
 *
 *  Project-specific copy (titles, blurbs, briefs, case studies)
 *  lives in `lib/projects.ts`, not here. This file is for the
 *  global site chrome: page headings, navigation labels, the
 *  about-page bio, the CTA panel, etc.
 *
 *  How to edit:
 *    1. Change the text inside the quotes below
 *    2. Save the file
 *    3. The site reloads automatically (if `npm run dev` is running)
 *
 *  How to add a line break in a paragraph:
 *    End the string at the natural break and start a new string in
 *    the same array. The component renders array items as separate
 *    <p> tags. Example: `body: ['First paragraph.', 'Second.']`
 *
 *  Watch out for:
 *    - Don't delete the quotes ('') or commas — they're required
 *    - For apostrophes inside text, wrap the string in DOUBLE quotes
 *      Example: "I'm a designer" (good)  vs  'I'm a designer' (broken)
 *    - Em dashes can be typed directly: —
 *    - "Smart" quotes look better than straight ones: " " ' '
 *
 * ============================================================ */

export const SITE_TEXT = {
  /* ---- ARTIST IDENTITY ---- */
  artist: {
    /** Display name shown in the sidebar and About page hero */
    name: 'James Kordic',
    /** First name only — used in places where the full name would be repeated */
    firstName: 'James',
    /** Last name — gets the gradient text treatment in headlines */
    lastName: 'Kordic',
    /** Small tagline under the sidebar logo */
    discipline: 'Graphic Design',
    /** Verified badge label */
    verifiedLabel: 'Verified Designer',
    /** Location string used in About metadata row */
    location: 'New York, NY',
    /** Founded/established year shown in About metadata row */
    established: 'Est. 2001',
  },

  /* ---- HOME PAGE ---- */
  home: {
    /** Subtitle under the giant "James Kordic" headline on the home page.
     *  This is the canonical site tagline. */
    tagline:
      'New York Based Graphic & Motion Designer.',

    /* ---- HOME MASTHEAD (the ABOUT column at the top of the home page) ---- */
    masthead: {
      /** Opening line — who you are and who you design for */
      intro:
        'NYC based graphic and motion designer who designs for music, entertainment, food, and tech brands.',
      /** Availability line shown under the intro */
      availability: 'Looking for new freelance or full-time roles.',
      /** Heading above the roles list */
      previouslyLabel: 'Previously:',
      /** Education line, shown under the roles */
      education: 'BFA in Graphic Design from The Rochester Institute of Technology',
      /** Past roles — each becomes its own bulleted line */
      previously: [
        'Design Consultant @ THE·TEAM',
        'Freelance Graphic & Motion Designer @ The Syndicate',
        'Visual Designer @ The Rochester Institute of Technology',
      ],
    },

    /** Label above the featured project's reel at the top of the work */
    featuredLabel: 'Featured Project',
    /** Label above the grid of remaining projects */
    otherWorksLabel: 'Other Works',

    /** Section heading for the top-of-page "Featured" row */
    featuredHeading: 'Featured work',

    /** "Side A" label — what to call the first project category */
    sideALabel: 'Side A',
    /** Heading shown next to the Side A label */
    sideAHeading: 'Professional client work',
    /** Subheading for Side A */
    sideASubheading:
      'Commissioned work for music, entertainment, food, and tech brands.',

    /** "Side B" label */
    sideBLabel: 'Side B',
    /** Heading shown next to the Side B label */
    sideBHeading: 'Personal work',
    /** Subheading for Side B */
    sideBSubheading: 'Concepts, capstones, and self-initiated explorations.',

    /** "View all →" link in the Featured row */
    viewAllLink: 'View all →',

    /* ---- HOME CTA PANEL (bottom of home page) ---- */
    cta: {
      /** Availability chip at the top of the CTA panel */
      availability: 'Open for work · 2026',
      /** Big headline. The word "loud." gets underlined automatically. */
      headlinePrefix: 'Let’s Make Something',
      headlineEmphasis: 'LOUD!',
      /** Subhead paragraph below the headline */
      subhead:
        'Available for freelance and full-time design work — motion, brand, advertising, anything that needs to move and make noise.',
      /** Primary button text (email address) */
      emailButton: 'Jkordic@me.com',
      /** Secondary button text */
      resumeButton: 'Resume',
      /** Tertiary "Full about / contact" link */
      aboutLink: 'Full info / contact',
    },
  },

  /* ---- ABOUT PAGE ---- */
  about: {
    /** Bio shown in the About panel — list of paragraphs.
     *  Each item becomes its own <p> tag.
     *  First paragraph is rendered slightly larger than the others. */
    bio: [
      'I’m a New York-based Graphic and Motion Designer who designs for music, entertainment, food, and tech brands.',
      'During my design career, I have worked with The Syndicate, THE·TEAM, Guns N’ Roses, Taco Bell, MNRK Heavy, CoinDesk, FX, and more.',
      'I graduated from the Rochester Institute of Technology with a Bachelor of Fine Arts (BFA) in Graphic Design and a minor in Photography.',
      'When I’m not behind a screen, you can usually find me jamming out on my guitar or photographing the world around me.',
    ],

    /** "Released projects" / "Designing professionally" / etc. factoid panel.
     *  Each entry is shown as a big number + a small uppercase label. */
    factoids: [
      // value gets the gradient text treatment for the first entry only
      { value: '', label: 'Released projects', useProjectCount: true, gradient: true },
      { value: '4 yrs', label: 'Designing professionally', gradient: false },
      { value: 'BFA', label: 'Graphic Design, RIT', gradient: false },
      { value: 'NYC', label: 'Currently based in', gradient: false },
    ],

    /** Section headings on the about page */
    headings: {
      about: 'Info',
      currently: 'Currently',
      connect: 'Connect',
    },

    /** "Currently" availability card */
    availability: {
      title: 'Open for work · 2026',
      subtitle:
        'Available for freelance and full-time. Remote, onsite, or hybrid. Replies within 24 hours.',
      buttonLabel: 'Reach out',
    },

    /** Action row buttons under the giant name */
    actionRow: {
      getInTouchLabel: 'Get in touch',
      resumeLabel: 'Resume',
    },
  },

  /* ---- SEARCH / BROWSE WORK PAGE ---- */
  search: {
    /** Page heading (also used in the top bar when on this page) */
    heading: 'Browse Work',
    /** Search input placeholder */
    placeholder: 'Search projects, clients, disciplines…',
    /** Results heading prefix — gets combined with the result count.
     *  Example output: "5 results" (plural) or "1 result" (singular). */
    resultLabel: 'result',
    /** No-results message. {query} gets replaced with what was typed. */
    noResults: 'No projects match',
    /** Section heading for the discipline browse tiles */
    browseByDiscipline: 'Browse by discipline',
    /** Section heading for the full catalog at the bottom */
    allProjects: 'All projects',
  },

  /* ---- SIDEBAR ---- */
  sidebar: {
    /** Nav link labels */
    home: 'Home',
    browse: 'Browse Work',
    about: 'Info / Contact',
    /** Library section header */
    library: 'Your Library',
    /** Suffix shown after the project count in the library header pill */
    libraryCountSuffix: 'projects',
    /** Subtitle shown under each project name in the library list */
    libraryItemSubtitle: 'Project',
  },

  /* ---- PLAYER BAR (non-project page entries) ---- */
  player: {
    /** Right-side label shown when on a non-project page */
    nowBrowsingLabel: 'Now Browsing',
    /** Synthetic "page entries" the player bar shows when you're NOT on
     *  a project page. Each one becomes a faux "now playing" item with
     *  its own title, subtitle, and gradient tile color. */
    pages: {
      home: {
        title: 'Home',
        subtitle: 'Featured · Side A · Side B',
      },
      search: {
        title: 'Browse Work',
        subtitle: 'Search the catalog',
      },
      about: {
        title: 'Info / Contact',
        subtitle: 'James Kordic',
      },
    },
  },

  /* ---- ALBUM / FEATURED CARDS ---- */
  cards: {
    /** Small "Featured" badge shown in the corner of FeaturedCard thumbnails */
    featuredBadge: 'Featured',
    /** "View case study →" link shown on hover of FeaturedCard */
    viewCaseStudy: 'View case study',
  },

  /* ---- TOP BAR ---- */
  topBar: {
    /** Sticky "Get in touch" button shown on the right side of the top bar */
    getInTouchLabel: 'Get in touch',
  },

  /* ---- VIDEO PLAYER ---- */
  videoPlayer: {
    /** Text shown while a video's first frame is decoding */
    loadingLabel: 'Loading…',
  },

  /* ---- PROJECT PAGE SECTION HEADINGS ---- */
  projectPage: {
    /** Default eyebrow names for the four numbered project sections.
     *  Each project in projects.ts can override these per-project via
     *  the `brief.eyebrow`, `approach.eyebrow`, and `recap.eyebrow` fields. */
    briefEyebrowDefault: 'The Brief',
    approachEyebrowDefault: 'The Approach',
    workEyebrow: 'The Work',
    recapEyebrowDefault: 'The Recap',

    /** Suffix on the §03 eyebrow — appears after the project count.
     *  Example output: "03 · The Work · 05 Projects" */
    workProjectsSuffix: 'Projects',

    /** Section-level "Role" label in case studies (the `// My Role` one).
     *  Each project section in projects.ts can set its own `role` field. */
    sectionRoleLabel: '// My Role',
    /** Section-level "Context" label in case studies (the `// Context` one). */
    sectionContextLabel: '// Context',

    /** Meta-strip labels shown under the project hero (Client / Date / Role) */
    metaClientLabel: 'Client',
    metaDateLabel: 'Date',
    metaRoleLabel: 'Role',

    /** Field Note label that appears above pull-quote callouts in case studies */
    fieldNoteLabel: 'Field Note ↳',
  },

  /* ---- CONTACT INFO (used on About page + CTA panel + everywhere) ---- */
  contact: {
    /** Primary email address */
    email: 'Jkordic@me.com',
    /** Phone number with country code */
    phone: '+1 (631) 742-8043',
    /** Phone number stripped to digits for tel: links */
    phoneRaw: '+16317428043',
    /** LinkedIn handle (without the @) */
    linkedinHandle: 'jameskordic',
    /** LinkedIn full URL */
    linkedinUrl: 'https://www.linkedin.com/in/jameskordic/',
    /** Formspree endpoint for the contact dialog — the URL shown on the form's
     *  page in the Formspree dashboard, e.g.
     *  'https://formspree.io/f/xyzabcde'.
     *
     *  Leave it empty and the dialog falls back to opening the visitor's mail
     *  app with the message prefilled, which needs no service at all. The ID
     *  is designed to be public, so it's safe to keep here in the repo. */
    formspreeEndpoint: 'https://formspree.io/f/mwlearky',

    /** Resume — Google Drive shareable link */
    resumeUrl:
      'https://drive.google.com/file/d/19NG_IWgLOZMpsoZrlccHL0BLN64NBU-K/view?usp=sharing',
  },

  /* ---- FOOTER ---- */
  footer: {
    /** The question that opens the footer, set large */
    headline: 'Interested in working together?',
    /** The answer to it — the link that opens the contact form */
    cta: 'Let’s Talk',
    /** Copyright line shown at the bottom of pages */
    copyright: '©2026 James Kordic',
  },

  /* ---- META (browser tab title + meta description) ---- */
  meta: {
    title: 'James Kordic Portfolio',
    description:
      'New York-based Graphic & Motion Designer. Work for Taco Bell, FX, MNRK Heavy, Consensus, and The Syndicate.',
  },
};
