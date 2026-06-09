# How to edit text on your site

All the site's editable text lives in **one file**:

```
lib/site-text.ts
```

Open it in any code editor (VS Code is free: code.visualstudio.com). It's organized by page, with comments explaining where each piece of text appears.

## Quick start

1. Open `lib/site-text.ts`
2. Find the text you want to change — search for it with **Cmd+F** / **Ctrl+F**
3. Edit the words between the quotes
4. Save the file
5. If `npm run dev` is running, the page reloads automatically

## What's inside `site-text.ts`

The file is one big `SITE_TEXT = { ... }` object with sections for each part of the site:

| Section | Controls |
|---|---|
| `artist` | Your name, tagline under the logo, verified label, location |
| `home` | Home page hero, "Featured work" heading, Side A / Side B labels, the entire CTA panel ("Let's make something loud") |
| `about` | About page — bio paragraphs, factoid stats, "Currently" availability card, "Connect" section |
| `search` | Browse Work page — search placeholder, no-results message, section headings |
| `sidebar` | "Home" / "Browse Work" / "About / Contact" nav labels, "Your Library" heading |
| `player` | Player bar titles when you're on home/search/about pages, "Now Browsing" label |
| `topBar` | "Get in touch" button at the top right |
| `cards` | "Featured" badge, "View case study →" link |
| `projectPage` | Section headings on each project page (The Brief / Approach / Recap), labels like Client / Date / Role |
| `videoPlayer` | "Loading…" text |
| `contact` | Your email, phone, LinkedIn, Instagram handles + URLs — used everywhere |
| `footer` | Copyright line at the bottom of pages |
| `meta` | Browser tab title + meta description |

## Common edits

### Change your tagline (home page hero)

In `lib/site-text.ts`, find `home: { tagline: ...` and edit.

### Change the bio (about page)

In `lib/site-text.ts`, find `about: { bio: [`. Each paragraph is a string in the array. Add or remove paragraphs by adding or removing strings (each ending with a comma).

### Change the "Featured" / "Side A" / "Side B" labels

`home: { sideALabel ...`, `sideAHeading ...`, etc.

### Change your email or phone

`contact: { email: ...`, `phone: ...`. All the buttons + cards + links pick this up automatically.

### Update the copyright year

`footer: { copyright: ...`

## Editing project-specific text

Project titles, blurbs, case-study brief/approach/recap, and section content all live in a separate file:

```
lib/projects.ts
```

Same idea: find the project you want, edit the text between the quotes, save. Each project is one object in a big array.

## Things to be careful with

- **Don't delete quotes (`'`) or commas (`,`)** — they're required
- **Apostrophes inside text need straight quotes outside.** Example:
  - Good: `"I'm a designer"` (apostrophe inside, double quotes outside)
  - Good: `'I\'m a designer'` (apostrophe escaped with backslash)
  - Broken: `'I'm a designer'` (apostrophe ends the string early)
- **Em dashes** (`—`) and ellipses (`…`) can be typed directly into strings
- **Save the file** before refreshing — easy to forget

## If something breaks

If you save and the site shows an error, check the terminal — there's usually a red message pointing to a line number. The most common cause is a missing comma or quote. **Undo your change** (`Cmd+Z` / `Ctrl+Z`) and try again more carefully.

## Where the actual files live

Just so you know — these are the files that read from `site-text.ts`:

- `app/page.tsx` — home page
- `app/about/page.tsx` — about page
- `app/search/page.tsx` — browse work page
- `app/work/[slug]/page.tsx` — individual project pages
- `app/layout.tsx` — global metadata (browser tab)
- `components/sidebar.tsx` — sidebar
- `components/top-bar.tsx` — top bar
- `components/player-bar.tsx` — bottom music player bar
- `components/app-shell.tsx` — top bar title per route
- `components/album-card.tsx` — project cards
- `components/case-section.tsx` — case study layout
- `components/video-player.tsx` — video player loading text

You don't need to open these to change text — just edit `lib/site-text.ts`.
