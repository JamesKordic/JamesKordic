'use client';
import { useEffect, useRef } from 'react';
import { useLightbox } from '@/lib/lightbox-context';
import { ProjectVideo } from './video-player';
import '@/app/lightbox.css';
export function Lightbox(){
  const {items,index,open,close,step}=useLightbox();
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const element=dialog.current;if(!element)return;if(!open){if(element.open)element.close();return;}const opener=document.activeElement as HTMLElement|null;element.showModal();return()=>{if(element.open)element.close();opener?.focus({preventScroll:true});};},[open]);
  const item=items[index];
  return <dialog ref={dialog} className="jk-lightbox" aria-label="Media viewer" onCancel={e=>{e.preventDefault();close();}} onClose={close} onClick={e=>{if(e.target===e.currentTarget)close();}}>
    {open&&item&&<><button className="jk-lightbox-close" aria-label="Close" onClick={close}>Back to project <span aria-hidden="true">×</span></button><div className="jk-lightbox-media">{item.type==='video'?<ProjectVideo key={item.src} src={item.src} poster={item.poster} priority pauseForLightbox={false}/>:item.type==='image'?<img src={item.src} alt={item.alt||''}/>:null}</div><div className="jk-lightbox-controls">{items.length>1&&<button aria-label="Previous image" onClick={()=>step(-1)}>←</button>}<span aria-live="polite">{index+1} / {items.length}</span>{items.length>1&&<button aria-label="Next image" onClick={()=>step(1)}>→</button>}</div></>}
  </dialog>;
}
