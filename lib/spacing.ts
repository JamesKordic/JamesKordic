/**
 * One spacing scale for the whole site. Every page, section and grid pulls
 * from these so the rhythm stays identical from page to page.
 *
 *   GUTTER  20 / 32px  — page edges, and every gap between columns
 *   TIGHT    8px       — a heading and the sentence under it
 *   STACK   20px       — heading to media, text to text, image to caption
 *   BLOCK   48 / 64px  — between blocks inside a page (and the page's top)
 *   SECTION 64 / 96px  — between the big parts of a page, and before the footer
 */
export const GUTTER_X = 'px-5 sm:px-8';
export const GAP_X = 'gap-x-5 sm:gap-x-8';
export const GAP = 'gap-5 sm:gap-8';

export const TIGHT = 'mt-2';
export const STACK = 'mt-5';

export const BLOCK_T = 'mt-12 sm:mt-16';
export const BLOCK_PT = 'pt-12 sm:pt-16';
export const BLOCK_PB = 'pb-12 sm:pb-16';
export const BLOCK_GAP_Y = 'gap-y-12 sm:gap-y-16';

export const SECTION_T = 'mt-16 sm:mt-24';
export const SECTION_PT = 'pt-16 sm:pt-24';

/** Bordered rows (facts, prev/next, archive toggle) share one inner padding. */
export const RULE_PY = 'py-5 sm:py-6';

/** Small grey label over content ("Selected work", "Experience", "Client"). */
export const LABEL = 'text-[15px] font-medium text-muted';
