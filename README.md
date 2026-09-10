# James Kordic — Graphic & Motion Design Portfolio

An editorial portfolio for music, entertainment, and campaign work, built with Next.js 14, React, and Tailwind CSS. The site uses a static export and is published to jameskordic.com through the existing GitHub/Vercel connection.

## Pages

- `/`: introduction and five selected projects, led by Taco Bell.
- `/about`: biography, experience, practice, education, and contact links.
- `/work/[slug]`: project-specific case studies, contribution and credit details, selected media, and expandable supporting archives.
- `/search`: the retained project search.
- `/work`: redirects to the homepage project index.

## Editing

- `lib/portfolio.ts`: homepage order, project titles, introductions, and captions.
- `lib/editorial.ts`: case-study selections, short narratives, contribution descriptions, and credits. Media not selected for the main story remains in the archive.
- `lib/projects.ts`: complete original project catalog and asset references.
- `lib/site-text.ts`: shared name, contact details, résumé, and LinkedIn links.
- `app/about/page.tsx`: biography and experience dates.
- `app/globals.css`: the editorial layout, responsive rules, and typography.
- `tailwind.config.ts`: colors for shared media components and retained routes.

Keep contribution and performance claims factual. Client imagery, supplied brand systems, team work, concept visualizations, and personal design work are distinguished in the case-study credits. Do not add campaign metrics unless their scope and source are verified.

## Local preview

```sh
npm install
npm run dev
```

The development server uses `.next-preview` so it can remain available during production builds. The production build uses `.next`.

## Production

```sh
npm run build
```

The static website is exported to `out/`. The existing Vercel integration deploys updates to the repository's `main` branch. Preserve the existing custom-domain configuration.

The `.openai/hosting.json` registration is retained for compatibility; the public custom domain currently uses Vercel.

## Media and accessibility

Original local assets are in `public/`; other original assets retain their Framer CDN URLs. Videos load near the viewport, start only on request, and pause when scrolled away. Images open in a keyboard-accessible modal viewer. Navigation, image descriptions, reduced-motion support, responsive layouts, and browser zoom are supported.
