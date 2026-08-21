import { SITE_TEXT } from '@/lib/site-text';
import { HEADING } from '@/lib/ui';
import { StarRule } from './star-rule';
import { ContactDialog } from './contact-dialog';
import { BackToTop } from './back-to-top';

const T = SITE_TEXT;

/**
 * Site footer: a star rule closing the page, then one line — the copyright at
 * the left, the way back up in the middle, and the contact form on the right.
 * Set in the masthead's heading treatment so the page ends in the same voice
 * it opens with.
 */
export function PageFooter() {
  return (
    <footer>
      <StarRule className="my-10 sm:my-12" />

      {/* Phones stack the three, where a third of the width isn't enough to
          hold the copyright on one line. From sm up they sit in three equal
          columns, so the middle item is centred on the page rather than midway
          between its neighbours. Bottom padding matches the rule above. */}
      <div
        className={`flex flex-col gap-2 px-5 pb-10 sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4 sm:px-7 sm:pb-12 ${HEADING}`}
      >
        <span className="whitespace-nowrap">{T.footer.copyright}</span>

        {/* `uppercase` is repeated on both buttons because Tailwind's preflight
            sets `text-transform: none` on button elements, which beats the
            inherited value from the row. */}
        <BackToTop
          className={`w-fit transition-colors hover:text-accent sm:justify-self-center ${HEADING}`}
        />

        <ContactDialog
          className={`w-fit sm:justify-self-end transition-colors hover:text-accent ${HEADING}`}
        >
          Contact
        </ContactDialog>
      </div>
    </footer>
  );
}
