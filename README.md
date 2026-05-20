# James Kordic — Portfolio

A music-streaming-inspired portfolio for graphic & motion designer James Kordic. Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

The metaphor: **James is the artist, every project is an album.** Each project opens a full case study with all the original images and videos from jameskordic.com, wrapped in a Spotify-style shell with a working player bar, equalizer animation, sidebar library, and search.

## Tech stack

- **Next.js 14** with the App Router and server components where possible
- **TypeScript** throughout
- **Tailwind CSS** for styling, with custom design tokens (Bricolage Grotesque display font, Hanken Grotesk UI font, lime-yellow accent)
- **next/image** for optimized image loading from the Framer CDN
- **React Context** for the music player and lightbox state (no external state lib)
- **Static generation** for all project pages (`generateStaticParams`)

## Getting started

```bash
# install dependencies
npm install

# run the dev server
npm run dev
# → open http://localhost:3000

# production build
npm run build
npm start
```

## Project structure

```
app/
  layout.tsx          ← root layout, wraps everything in providers + AppShell
  page.tsx            ← home (artist hero, popular tracks, discography)
  globals.css         ← Tailwind + custom CSS (fonts, grain, animations)
  work/[slug]/page.tsx ← dynamic case-study page, statically generated for all 9 projects
  search/page.tsx     ← browse work, category filters
  about/page.tsx      ← about / contact

components/
  app-shell.tsx       ← grid layout: sidebar + main + player
  sidebar.tsx         ← brand, nav, library
  top-bar.tsx         ← back/forward, scroll-triggered title, contact button
  player-bar.tsx      ← persistent footer player with controls + progress
  album-card.tsx      ← project card used in grids
  track-row.tsx       ← popular tracklist row
  case-section.tsx    ← case-study section renderer with media tiles
  project-actions.tsx ← play + like buttons on each case study
  lightbox.tsx        ← full-screen image viewer (keyboard nav)
  icons.tsx           ← inline SVG icon components

lib/
  projects.ts         ← all 9 projects with sections, media URLs, copy
  player-context.tsx  ← global player state (current track, playing, progress, etc.)
  lightbox-context.tsx ← global lightbox state
  scroll-context.tsx  ← passes scroll container ref down (for top-bar scroll detection)
```

## Adding or editing a project

Open `lib/projects.ts`. Each project follows this shape:

```typescript
{
  id: 'unique-slug',         // becomes /work/unique-slug
  title: 'Project Title',
  cover: img('framer-id'),   // helper builds the full CDN URL
  themeColor: '#hexcolor',   // tints the hero gradient
  tags: ['Motion Design', 'Branding'],
  client: 'Client Name',
  date: '2024–2025',
  role: 'Graphic Design, Motion Design',
  year: '2024–25',
  len: 200,                  // pseudo "track length" in seconds (cosmetic only)
  blurb: 'Short subtitle under the title',
  desc: 'Full overview paragraph...',
  sections: [
    {
      eyebrow: '01',
      title: 'Section Heading',
      body: 'Optional paragraph...',
      media: [
        { type: 'image', src: img('framer-id') },
        { type: 'video', src: vid('framer-id') },
      ],
      cols: 2,                // 1, 2, 3, or 4
    },
  ],
}
```

Helpers at the top of the file build Framer CDN URLs:

- `img(id, width?)` → PNG
- `jpg(id, width?)` → JPG
- `gif(id, width?)` → GIF
- `vid(id)` → MP4 video

To self-host images instead of pulling from Framer, drop them in `public/` and use relative paths (`/my-image.png`).

## About the assets

All images and videos load from `framerusercontent.com`, which is configured as a remote pattern in `next.config.js`. They'll work in development and production with no extra setup. If you want a fully self-contained bundle, download each asset and replace the URL helpers.

## Deployment

The easiest path is **Vercel** (made by the team behind Next.js):

1. Push this repo to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Next.js and deploys with one click

For other platforms (Netlify, AWS, self-hosted), follow the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying). The site builds to a static export-friendly structure — there are no server actions or runtime API routes.

## Features at a glance

- 9 fully-built case studies with 248 images and videos
- Persistent music player bar with play/pause, next/prev, shuffle, repeat, like, seekable progress, volume
- Animated equalizer + spinning record icon while "playing"
- Spacebar toggles play (when not focused on an input)
- Lightbox for any image — arrow keys to navigate, Esc to close
- Click-to-play inline videos on case-study pages
- Search by project name, client, discipline, or section title
- Responsive: collapses to a single-column mobile layout with a slide-out sidebar
- Static generation for every project page → fast page loads, great SEO

## Customization tips

- **Change accent color:** edit the `accent` value in `tailwind.config.ts` and the matching hex codes in `globals.css` (search for `#c8f135`)
- **Add a real audio file:** load it in `player-context.tsx` and replace the `setInterval` ticker with `<audio>` element events (`timeupdate`, `ended`)
- **Add light mode:** the design tokens are centralized in `tailwind.config.ts` — duplicate them under a `dark:` prefix, then toggle a `dark` class on `<html>`

---

Made with Next.js. Original site: [jameskordic.com](https://jameskordic.com)
