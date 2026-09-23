import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';
import { PageFooter } from '@/components/page-footer';
import { SiteHeader } from '@/components/site-header';
import { SITE_TEXT } from '@/lib/site-text';
import { BLOCK_PB, BLOCK_PT, GAP_X, GUTTER_X, LABEL, STACK, TIGHT } from '@/lib/spacing';
import { STATEMENT } from '@/lib/type';

const T = SITE_TEXT;
const C = T.contactPage;

export const metadata: Metadata = {
  title: C.title,
  description: C.intro,
};

const link = 'transition-colors hover:text-accent';

/**
 * Contact — the direct lines (email, phone, LinkedIn, résumé) on the left, so
 * nobody has to rely on the form, and the form on the right.
 */
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg text-[17px] leading-[1.6] text-text">
      <SiteHeader />

      <main className={`w-full ${GUTTER_X}`}>
        <section className={`${BLOCK_PT} ${BLOCK_PB}`}>
          <h1 className={`max-w-[20ch] ${STATEMENT}`}>{C.headline}</h1>
          <p className={`${STACK} max-w-[52ch] text-muted`}>{C.intro}</p>
        </section>

        <div className={`grid grid-cols-1 border-t border-line pt-8 ${GAP_X} gap-y-12 sm:pt-10 lg:grid-cols-3`}>
          <dl className="space-y-6">
            <div>
              <dt className={LABEL}>Email</dt>
              <dd className={TIGHT}>
                <a href={`mailto:${T.contact.email}`} className={link}>
                  {T.contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className={LABEL}>Phone</dt>
              <dd className={TIGHT}>
                <a href={`tel:${T.contact.phoneRaw}`} className={link}>
                  {T.contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className={LABEL}>Elsewhere</dt>
              <dd className={`${TIGHT} flex flex-col`}>
                <a href={T.contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className={link}>
                  LinkedIn ↗
                </a>
                <a href={T.contact.resumeDownloadUrl} className={link}>
                  Download résumé (PDF) ↓
                </a>
              </dd>
            </div>
          </dl>

          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </main>

      <PageFooter />
    </div>
  );
}
