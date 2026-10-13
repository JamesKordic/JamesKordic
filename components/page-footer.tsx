import Link from 'next/link';
import { SITE_TEXT } from '@/lib/site-text';
import '@/app/chrome.css';

const T = SITE_TEXT;

export function PageFooter() {
  return (
    <footer className="jk-footer">
      <div className="jk-footer-intro">
        <p className="jk-chrome-label jk-footer-availability"><span aria-hidden="true" />Available for freelance &amp; full-time</p>
        <p className="jk-chrome-label">A good idea starts with a conversation.</p>
      </div>
      <div className="jk-footer-main">
        <h2>Let’s make<br />something move.</h2>
        <Link href="/contact" className="jk-footer-contact" aria-label="Get in touch"><span aria-hidden="true">↗</span></Link>
      </div>
      <div className="jk-footer-details">
        <a className="jk-footer-email" href={`mailto:${T.contact.email}`}>{T.contact.email}<span aria-hidden="true"> ↗</span></a>
        <nav className="jk-footer-links jk-chrome-label" aria-label="Footer">
          <a href={T.contact.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a href={T.contact.resumeUrl} target="_blank" rel="noopener noreferrer">Résumé ↗</a>
          <a href="#">Back to top ↑</a>
        </nav>
      </div>
      <div className="jk-footer-bottom jk-chrome-label"><p>© {new Date().getFullYear()} {T.artist.name}</p><p>Independent designer. New York, NY.</p></div>
      <p className="jk-footer-wordmark" aria-hidden="true">James Kordic</p>
    </footer>
  );
}
