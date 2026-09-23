/**
 * One type scale for the whole site, the way `spacing.ts` is one spacing
 * scale. Inter throughout; 500 for anything that reads as a heading, 400 for
 * everything else. Tracking tightens as the size grows.
 *
 *   NAME      40 → 124px — a project page's title
 *   HERO      28 →  76px — the homepage's one sentence: two lines from tablet
 *                          up, three on phones. Never smaller than a project name.
 *   STATEMENT 28 →  64px — the opening line of the Contact and 404 pages;
 *                          HERO's scale, capped lower and set looser
 *   ROW_NAME  28 →  60px — a project's name in a homepage index row, a clear
 *                          step under HERO so the sentence leads the page
 *   TITLE     26 →  48px — previous / next names, the archive toggle
 *   BODY          17px   — running copy (set on each page's wrapper)
 *   META          15px   — secondary lines, labels (`LABEL` in spacing.ts), footer
 *
 * From laptop widths up the steps sit ~1.3× or more apart, so each level
 * reads as a different level rather than a near-miss of the one above it. On
 * phones the display sizes share a 28px floor and are told apart by position
 * and length instead.
 */
export const NAME =
  'text-[clamp(40px,7.2vw,124px)] font-medium leading-[0.92] tracking-[-0.05em]';

export const ROW_NAME =
  'text-[clamp(28px,3.2vw,60px)] font-medium leading-[0.95] tracking-[-0.04em]';

export const HERO =
  'text-[clamp(28px,4.2vw,76px)] font-medium leading-[1.02] tracking-[-0.035em]';

export const STATEMENT =
  'text-[clamp(28px,4.2vw,64px)] font-medium leading-[1.12] tracking-[-0.025em]';

export const TITLE =
  'text-[clamp(26px,3.4vw,48px)] font-medium leading-[1.05] tracking-[-0.035em]';

export const META = 'text-[15px] leading-snug';
