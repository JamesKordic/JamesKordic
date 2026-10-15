import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { PageFooter } from '@/components/page-footer';
export const metadata={title:'Page not found'};
export default function NotFound(){return <><SiteHeader/><main style={{minHeight:'75svh',padding:'17.5rem 1.75rem 6rem'}}><h1 style={{fontFamily:'var(--font-display)',fontSize:'2.375rem',fontWeight:500,lineHeight:1.1}}>Page not found.<br/><span style={{color:'var(--color-muted)'}}>Let’s get you back to the work.</span></h1><Link href="/#work" className="jk-bracket-link" style={{display:'inline-block',marginTop:'2.5rem'}}>[ Back to work ]</Link></main><PageFooter minimal/></>;}
