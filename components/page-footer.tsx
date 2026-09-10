import Link from 'next/link';
import { SITE_TEXT } from '@/lib/site-text';

export function PageFooter() {
  return <footer className="portfolio-footer"><div className="portfolio-container"><div className="footer-top"><div><p className="eyebrow">Have a project or role in mind?</p><a className="footer-headline" href={`mailto:${SITE_TEXT.contact.email}`}>Let’s work together<span aria-hidden="true"> ↗</span></a></div><a className="footer-email" href={`mailto:${SITE_TEXT.contact.email}`}>{SITE_TEXT.contact.email.toLowerCase()}</a></div><div className="footer-bottom"><p>© {new Date().getFullYear()} James Kordic</p><nav aria-label="Footer navigation"><Link href="/about">About</Link><a href={SITE_TEXT.contact.resumeUrl} target="_blank" rel="noopener noreferrer">Résumé ↗</a><a href={SITE_TEXT.contact.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="#main-content">Back to top ↑</a></nav></div></div></footer>;
}
