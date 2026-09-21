import { SITE_TEXT } from '@/lib/site-text';
import { BLOCK_PB, BLOCK_PT, GUTTER_X, SECTION_T, STACK } from '@/lib/spacing';

const T = SITE_TEXT;

/** Every page closes the same way: the email, set large, and two links. */
export function PageFooter() {
  return (
    <footer className={`${SECTION_T} w-full ${GUTTER_X}`}>
      <div className={`border-t border-line ${BLOCK_PT} ${BLOCK_PB}`}>
        <a
          href={`mailto:${T.contact.email}`}
          className="inline-block text-[clamp(26px,4vw,44px)] font-medium tracking-[-0.02em] transition-colors hover:text-accent"
        >
          {T.contact.email}
        </a>
        <div className={`${STACK} flex flex-wrap justify-between gap-5 text-[15px] text-muted`}>
          <span>Open for freelance and full-time work · {T.artist.location}</span>
          <span className="flex gap-6">
            <a href={T.contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-text">LinkedIn</a>
            <a href={T.contact.resumeUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-text">Resume</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
