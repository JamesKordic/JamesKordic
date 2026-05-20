# James Kordic — Portfolio (Frequency)

A portfolio for graphic & motion designer James Kordic. Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

## Design language

**Frequency** — a portfolio that *behaves* like a music app without *looking* like one. Each project is a "track" in the catalog, the persistent player bar runs along the bottom, and the rail on the left is the navigation. But the visual layer is fully its own thing: cream paper background, hot coral and dusty cobalt accents, oversized Fraunces serif display type that breaks the grid, JetBrains Mono for utility metadata, asymmetric tile grids, and aggressive motion (drifting cards, marquee ticker, scaling hovers).

## Tech stack

- **Next.js 14** with the App Router and static generation
- **TypeScript** throughout
- **Tailwind CSS** with custom design tokens — paper/ink/coral/cobalt color system
- **Fraunces** (variable serif, optical sizes, ligatures, alternates) + **Inter** (UI) + **JetBrains Mono** (metadata)
- **React Context** for player and lightbox state — no external state lib
- **Static generation** for all 9 project pages via `generateStaticParams`

## Getting started

```bash
npm install
npm run dev          # → http://localhost:3000

npm run build        # production build
npm start            # serve production
```

## Project structure

```
app/
  layout.tsx              Root layout, providers + AppShell
  page.tsx                Home — bleed type hero, marquee, asymmetric grid
  globals.css             Fonts, paper texture, animations, halftone overlay
  work/[slug]/page.tsx    Project detail (statically generated for all 9)
  search/page.tsx         Browse catalog with category filters
  about/page.tsx          Signal — about + contact

components/
  app-shell.tsx           Layout — rail + main + player
  rail.tsx                Thin icon rail with hover-out drawer
  top-chrome.tsx          Minimal status bar with breadcrumb + clock
  player-bar.tsx          Persistent footer player with hairline progress
  case-section.tsx        Editorial section renderer for case studies
  project-actions.tsx     Play/like buttons
  lightbox.tsx            Full-screen image viewer
  icons.tsx               (Currently unused — kept for future reuse)

lib/
  projects.ts             All 9 projects with sections, media URLs, copy
  player-context.tsx      Music player state
  lightbox-context.tsx    Lightbox state
  scroll-context.tsx      Scroll ref passing
```

## Design tokens

Colors are defined in `tailwind.config.ts`. Change them in one place and the whole site updates.

| Token | Value | Use |
|---|---|---|
| `paper` | `#f5ebd6` | Main background |
| `paper-2`, `paper-3` | warmer creams | Surface elevations |
| `ink` | `#1a1410` | Primary text + footer player background |
| `ink-2`, `ink-3` | darker warms | Secondary text |
| `muted`, `muted-2` | warm grays | Tertiary text |
| `coral` | `#ff4632` | Primary accent — playing state, highlights |
| `cobalt` | `#3a5cff` | Secondary accent (available, not heavily used yet) |
| `butter`, `moss`, `plum` | extras | Per-project theme accents |

Fonts use Google Fonts via `globals.css`:
- `font-display` → Fraunces (variable, opsz 9–144, SOFT and WONK axes active)
- `font-ui` → Inter
- `font-mono` → JetBrains Mono

## Adding / editing a project

Open `lib/projects.ts`. Each project is one entry in the `PROJECTS` array:

```typescript
{
  id: 'unique-slug',         // becomes /work/unique-slug
  title: 'Project Title',
  cover: img('framer-id'),   // or '/covers/project.jpg' if self-hosting
  themeColor: '#hexcolor',   // tints the hero gradient
  tags: ['Motion Design', 'Branding'],
  client: 'Client Name',
  date: '2024–2025',
  role: 'Graphic Design, Motion Design',
  year: '2024–25',
  blurb: 'Short subtitle',
  desc: 'Full overview...',
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

To self-host images instead of using Framer's CDN, drop files in `public/` and reference them by path (`/covers/project.jpg`). Then remove `unoptimized` from the `<Image>` tag in `components/case-section.tsx` to re-enable Next's image optimization.

## Deployment

Push to GitHub, import at [vercel.com/new](https://vercel.com/new). Zero config. Free `*.vercel.app` URL immediately, point your domain via DNS.

## Features

- 9 fully-built case studies with 248 images and videos
- Persistent music player with play/pause, next/prev, shuffle, repeat, like, seekable progress
- Animated equalizer + spinning record disc while "playing"
- Drifting card animations on the home grid
- Marquee ticker across the top of home
- Spacebar toggles play (when not focused on an input)
- Lightbox for any image — arrow keys to navigate, Esc to close
- Inline video play (click any video tile)
- Search by project, client, discipline, or section title
- Responsive: rail collapses to a slide-out drawer on mobile
- Static generation → fast page loads, great SEO

## Customization tips

- **Change the accent color:** edit `coral` in `tailwind.config.ts`. The `glow-coral` class in `globals.css` has a hardcoded glow shadow — update that too if you change hue dramatically.
- **Add a real audio file:** swap the `setInterval` ticker in `player-context.tsx` for an `<audio>` element with `timeupdate` and `ended` listeners.
- **Add light mode toggle:** the design is already on a light cream background; you could invert by mapping `paper` → `ink` and adding a `dark:` prefix system in Tailwind config.

---

Original site: [jameskordic.com](https://jameskordic.com)
