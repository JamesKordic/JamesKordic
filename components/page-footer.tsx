import Link from 'next/link';
import { SITE_TEXT } from '@/lib/site-text';
import '@/app/chrome.css';
export function PageFooter({minimal=false,contactPage=false}:{minimal?:boolean;contactPage?:boolean}){return <footer className={`jk-footer ${minimal?'is-minimal':''} ${contactPage?'is-contact-page':''}`}>
  {!minimal&&<><div className="jk-footer-heading"><h2>Contact</h2><p>Projects and opportunities</p></div><div className="jk-footer-rows"><div><h3>Projects + Media</h3><p><span className="jk-footer-description">For design, motion, and collaborations.</span><a href={`mailto:${SITE_TEXT.contact.email}`}>{SITE_TEXT.contact.email}</a></p></div><div><h3>Opportunities</h3><p><span className="jk-footer-description">Available for freelance and full-time.</span><Link href="/contact">Work with me</Link></p></div><div><h3>Channels</h3><p><a href={SITE_TEXT.contact.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a><br/><a href={SITE_TEXT.contact.resumeUrl} target="_blank" rel="noreferrer">Résumé</a><br/><a href={`mailto:${SITE_TEXT.contact.email}`}>Email</a></p></div></div></>}
  <div className="jk-footer-bottom"><span>© James Kordic</span><Link href="/" aria-label="James Kordic home" className="jk-footer-mark">JK</Link></div>
</footer>;}
