/** Hover treatment shared by every text link in the redesigned pages: the
 *  accent color and nothing else, so links read as plain type until the
 *  cursor reaches them. */
export const LINK = 'transition-colors hover:text-accent';

/** The page's two-column rhythm: a label column on the left, content on the
 *  right, both aligned to the same edges as the home rows. Every section of a
 *  case study sits on this grid so the labels form one vertical line. */
export const ROW =
  'grid grid-cols-1 gap-4 px-5 sm:px-7 lg:grid-cols-[22%_1fr] lg:gap-10';

/** Uppercase label that opens a section, sitting in the ROW's left column. */
export const LABEL = 'uppercase tracking-[0.01em] text-muted';

/** The one piece of button chrome on an otherwise typographic page: a
 *  hairline pill that fills with the accent on hover.
 *
 *  The padding is deliberately uneven — "Project" carries a descender, so a
 *  box-centred label reads as sitting low; the extra pixel underneath lifts it
 *  onto its optical centre. */
export const BUTTON =
  'inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-line px-4 pb-[7px] pt-[5px] text-[13px] leading-none transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink sm:text-[14px]';

/** The masthead heading treatment — JAMES KORDIC, ABOUT, CONTACT — reused
 *  wherever type should read as a heading rather than as copy. */
export const HEADING = 'uppercase tracking-[0.01em]';
