import { SiteHeader } from './site-header';
import { PageFooter } from './page-footer';
import { ContactForm } from './contact-form';
import { SITE_TEXT } from '@/lib/site-text';
import '@/app/contact.css';

export function ContactScreen() {
  const contact = SITE_TEXT.contact;

  return (
    <>
      <SiteHeader overlay />
      <main className="contact-reference">
        <aside>
          <div className="contact-introduction">
            <h1>{SITE_TEXT.contactPage.headline}</h1>
            <p>{SITE_TEXT.contactPage.intro}</p>
          </div>
          <section className="contact-details" aria-labelledby="contact-name">
            <div>
              <h2 id="contact-name">James Kordic</h2>
              <p>Graphic &amp; Motion Designer</p>
              <p>New York, NY</p>
            </div>
            <address className="contact-address">
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <a href={`tel:${contact.phoneRaw}`}>{contact.phone}</a>
            </address>
            <div className="contact-channels">
              <a href={contact.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href={contact.resumeUrl} target="_blank" rel="noreferrer">Résumé ↗</a>
            </div>
          </section>
        </aside>
        <section className="contact-form-panel" aria-labelledby="contact-form-heading">
          <h2 id="contact-form-heading">Send a message</h2>
          <ContactForm />
        </section>
      </main>
      <PageFooter minimal contactPage />
    </>
  );
}
