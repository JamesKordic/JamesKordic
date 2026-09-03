import type { Metadata } from 'next';
import { ContactPageForm } from '@/components/contact-page-form';
import { SiteHeader } from '@/components/site-header';
import { SITE_TEXT } from '@/lib/site-text';

export const metadata: Metadata = {
  title: `Contact — ${SITE_TEXT.artist.name}`,
  description: `Start a project with ${SITE_TEXT.artist.name}.`,
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <SiteHeader />

      <main className="view-anim flex-1">
        <div className="border-b border-line px-5 py-10 sm:px-7 sm:py-14 lg:py-16">
          <h1 className="font-display text-[clamp(56px,11vw,164px)] font-semibold uppercase leading-[0.8] tracking-[-0.075em]">
            Contact
          </h1>
        </div>

        <section className="grid lg:grid-cols-[minmax(320px,0.78fr)_minmax(0,1.22fr)]">
          <div className="flex min-h-[420px] flex-col justify-between border-b border-line p-5 sm:p-7 lg:min-h-[620px] lg:border-b-0 lg:border-r lg:p-10">
            <p className="max-w-[13ch] font-display text-[clamp(34px,4.8vw,72px)] font-medium leading-[1.02] tracking-[-0.05em]">
              Have something worth making? Let&rsquo;s talk.
            </p>

            <div className="mt-14 border-t border-line pt-6">
              <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-accent">
                Email
              </p>
              <a
                href={`mailto:${SITE_TEXT.contact.email}`}
                className="group inline-flex items-center gap-3 text-[clamp(20px,2.4vw,34px)] tracking-[-0.03em] underline decoration-line underline-offset-[7px] transition-colors hover:text-accent hover:decoration-accent"
              >
                {SITE_TEXT.contact.email}
                <span className="text-[0.75em] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
              </a>
            </div>
          </div>

          <ContactPageForm />
        </section>
      </main>
    </div>
  );
}
