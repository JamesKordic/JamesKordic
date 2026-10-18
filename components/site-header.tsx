'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { SITE_TEXT } from '@/lib/site-text';
import '@/app/chrome.css';

const LINKS = [ ['Work','/#work','Explore case studies'], ['Contact','/contact','Reach out'] ];
const CHANNELS = [
  { label:'LinkedIn', href:SITE_TEXT.contact.linkedinUrl, description:'Connect with me', external:true },
  { label:'Résumé', href:SITE_TEXT.contact.resumeUrl, description:'View experience', external:true },
  { label:'Email', href:`mailto:${SITE_TEXT.contact.email}`, description:'Start a conversation', external:false },
];
function WordmarkLetters() {
  return <>
    <span className="jk-wordmark-initial" aria-hidden="true">J</span>
    <span className="jk-wordmark-tail" aria-hidden="true"><span><span>ames&nbsp;</span></span></span>
    <span className="jk-wordmark-initial" aria-hidden="true">K</span>
    <span className="jk-wordmark-tail" aria-hidden="true"><span><span>ordic</span></span></span>
  </>;
}
function MenuWordmark() {
  return <Link href="/" className="jk-wordmark jk-wordmark-animated" aria-label="James Kordic, home"><WordmarkLetters /></Link>;
}
export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname() ?? '/';
  const [scrolled,setScrolled] = useState(false);
  const [open,setOpen] = useState(false);
  const [hoverHeld,setHoverHeld] = useState(false);
  const capsule=useRef<HTMLDivElement>(null);
  const closeWithMouse=useRef(false);
  const mobileTrigger=useRef<HTMLButtonElement>(null);
  const menuRef=useRef<HTMLDialogElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  const home=pathname==='/', casePage=pathname.startsWith('/work');
  const compact=!home||scrolled;
  const pageLabel=home?'Home':pathname.split('/')[1];
  const projectLabel:Record<string,string>={'guns-n-roses':"Guns N’ Roses",'taco-bell':'Taco Bell',adults:'Adults on FX','the-syndicate':'The Syndicate',wwimf:'WWIMF',voltage:'Voltage'};
  const breadcrumb=pathname.startsWith('/work/')?projectLabel[pathname.split('/')[2]]:undefined;
  useEffect(()=>{const sync=()=>setScrolled(window.scrollY>24);sync();window.addEventListener('scroll',sync,{passive:true});return()=>window.removeEventListener('scroll',sync);},[]);
  useEffect(()=>{setOpen(false);setHoverHeld(false);},[pathname]);
  useEffect(()=>{if(!compact)setHoverHeld(false);},[compact]);
  useEffect(()=>{
    if(!hoverHeld)return;
    const release=()=>setHoverHeld(false);
    // The modal makes the underlying bar inert, so don't rely on it receiving
    // a fresh pointer-enter event when the dialog closes.
    const onMove=(event:PointerEvent)=>{
      if(event.pointerType!=='mouse')return;
      const bounds=capsule.current?.getBoundingClientRect();
      if(!bounds||event.clientX<bounds.left||event.clientX>=bounds.right||event.clientY<bounds.top||event.clientY>=bounds.bottom)release();
    };
    const onExit=(event:PointerEvent)=>{if(!event.relatedTarget)release();};
    document.addEventListener('pointermove',onMove,{passive:true});
    document.addEventListener('pointerout',onExit,{passive:true});
    window.addEventListener('blur',release);
    window.addEventListener('resize',release);
    return()=>{
      document.removeEventListener('pointermove',onMove);
      document.removeEventListener('pointerout',onExit);
      window.removeEventListener('blur',release);
      window.removeEventListener('resize',release);
    };
  },[hoverHeld]);
  useEffect(()=>{if(!open)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous;};},[open]);
  useEffect(()=>{const el=menuRef.current;if(!el)return;if(open){el.showModal();}else if(el.open)el.close();},[open]);
  return <>
    <header className={`jk-header ${compact?'is-compact':''} ${casePage?'is-case':''} ${open?'is-menu-open':''} ${hoverHeld?'is-menu-hover-held':''}`}>
      <div ref={capsule} className="jk-nav-capsule"><MenuWordmark/><button ref={trigger} className="jk-menu-trigger" aria-label="Open navigation menu" aria-haspopup="dialog" aria-expanded={open} onClick={()=>setOpen(true)}><span>{pageLabel}{breadcrumb&&<small>{breadcrumb}</small>}</span><span className="jk-menu-indicator" aria-hidden="true"/></button></div>
      <nav className="jk-header-nav" aria-label="Primary">{LINKS.map(([label,href])=><Link href={href} key={href}>{label}</Link>)}</nav>
      <button ref={mobileTrigger} className="jk-mobile-menu-trigger" aria-label="Open navigation menu" aria-haspopup="dialog" aria-expanded={open} onClick={()=>setOpen(true)}>Menu</button>
    </header>
    <dialog ref={menuRef} className="jk-menu-dialog" aria-label="Site navigation" onCancel={()=>setOpen(false)} onClose={()=>{setOpen(false);(window.innerWidth<834?mobileTrigger:trigger).current?.focus();}} onClick={e=>{if(e.target===e.currentTarget)setOpen(false);}}>
      <button type="button" className="jk-menu-top" aria-label="Close navigation menu" onPointerDown={event=>{closeWithMouse.current=event.pointerType==='mouse';}} onClick={event=>{
        setHoverHeld(event.detail>0&&closeWithMouse.current&&window.matchMedia('(min-width: 52.125rem) and (hover: hover) and (pointer: fine)').matches);
        closeWithMouse.current=false;
        setOpen(false);
      }}>
        <span className="jk-wordmark jk-wordmark-animated" aria-hidden="true"><WordmarkLetters /></span>
        <span className="jk-menu-page-label">{pageLabel}</span>
        <span className="jk-menu-close-indicator" aria-hidden="true"><span className="jk-desktop-close">−</span><span className="jk-mobile-close">Close</span></span>
      </button>
      <p className="jk-menu-explore">Explore</p><nav className="jk-menu-links" aria-label="Expanded navigation">{LINKS.map(([label,href,description])=><Link className="jk-menu-roll-link" href={href} key={href} aria-label={label} onClick={()=>setOpen(false)}><span className="jk-menu-label-window"><span className="jk-menu-label">{label}</span><span className="jk-menu-description" aria-hidden="true">{description}</span></span></Link>)}</nav>
      <div className="jk-menu-channels">
        <h2>Channels</h2>
        {CHANNELS.map(({label,href,description,external})=><a className="jk-menu-roll-link" key={label} href={href} aria-label={label} target={external?'_blank':undefined} rel={external?'noreferrer':undefined}><span className="jk-menu-label-window"><span className="jk-menu-label">{label}</span><span className="jk-menu-description" aria-hidden="true">{description}</span></span></a>)}
      </div>
    </dialog>
  </>;
}
