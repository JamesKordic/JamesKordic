# James Kordic — Portfolio

A graphic and motion design portfolio built with Next.js 14, React, TypeScript, and Tailwind CSS. The interface pairs Koto-inspired layouts, navigation, and scrolling project presentations with James’s original Inter typography and red-and-neutral palette. Projects are listed on the homepage and open into individual case studies; older Work listing URLs redirect to the homepage’s work section. Navigation contains Work, About, and Contact. Retired Services, Latest, and Careers URLs redirect to About, homepage projects, and Contact respectively.

## Development

```sh
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` creates a static export in `out/`; serve that directory with a static server that supports extensionless HTML routes. `next start` is not compatible with static export.

## Editing content

- `lib/projects.ts`: project metadata, imagery, case studies, and editorial ordering.
- `lib/site-text.ts`: biography, contact details, résumé links, and availability.
- `components/portfolio-home.tsx`: static introduction and scrolling project gallery.
- `components/about-portfolio.tsx`: about page template.
- `components/site-header.tsx` / `components/page-footer.tsx`: shared navigation and contact section.
- `app/work/[slug]/page.tsx`: case-study layout and editorial media selection.
- `app/portfolio.css`, `app/chrome.css`, `app/case-study.css`: scoped presentation styles.
- `public/`: local images and motion assets; some case-study media still uses the original Framer CDN.

The homepage loads nearby project clips on demand, pauses offscreen motion, and respects reduced-motion preferences. Visitors can pause individual project previews, use keyboard-accessible navigation, and follow project links to full case studies. Contact retains the configured Formspree integration; avoid submitting test messages to the live endpoint.

## Validation and publication

```sh
npx tsc --noEmit --incremental false
npm run build
node scripts/prepare-static-assets.mjs
```

The final command prepares the static export for the hosting provider’s 25 MiB per-file limit while preserving original files under `public/`. Its video conversion step requires macOS Swift and AVFoundation and exports the Adults film as 1280×720 H.264 with AAC audio. See the script for the exact output-only transformations.

The existing Sites identity and static export directory are tracked in `.openai/hosting.json`. Preserve that identity and the existing access configuration. Publication uses the Sites source workflow and a package of the verified export.
