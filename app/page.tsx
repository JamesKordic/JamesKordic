'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { JetBrains_Mono } from 'next/font/google';
import { PROJECTS } from '@/lib/projects';
import { SITE_TEXT } from '@/lib/site-text';

const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'] });
const T = SITE_TEXT;

/**
 * Home — a full-screen, monospaced poster band in the style of the
 * Louis Moss reference layout: black canvas, a centered horizontal row of
 * portrait poster cards with blue-dash hover labels, fixed nav, and a footer
 * carrying the live cursor coordinates and clock. Each poster links through to
 * its existing case-study page at /work/[slug].
 */
export default function HomePage() {
  const bandRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState('0, 0');
  const [clock, setClock] = useState('00:00:00');

  // Cursor read-out, bottom-left — matches the reference's pixel coordinates.
  useEffect(() => {
    const onMove = (e: MouseEvent) => setCoords(`${e.clientX}, ${e.clientY}`);
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Live clock.
  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const tick = () => {
      const d = new Date();
      setClock(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Translate vertical wheel into horizontal scroll across the band so every
  // poster stays reachable on wide screens without a visible scrollbar.
  useEffect(() => {
    const el = bandRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (window.matchMedia('(max-width: 860px)').matches) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className={`${mono.className} jk-stage`}>
      {/* Nav */}
      <nav className="jk-nav">
        <Link className="jk-logo" href="/">
          {T.artist.name.toUpperCase()}
        </Link>
        <div className="jk-menu">
          <Link href="/">WORKS</Link>
          <Link href="/about">ABOUT</Link>
          <a href={`mailto:${T.contact.email}`}>CONTACT</a>
        </div>
      </nav>

      {/* Poster band */}
      <div className="jk-band" ref={bandRef}>
        {PROJECTS.map((p) => (
          <Link className="jk-poster" key={p.id} href={`/work/${p.id}`}>
            <div className="jk-label">
              <span className="jk-dash" />
              <span className="jk-tt">
                {p.blurb.toUpperCase()}
                <br />
                <span className="jk-cl">{p.title.toUpperCase()}</span>
              </span>
            </div>
            <div className="jk-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.cover} alt={p.title} />
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <footer className="jk-foot">
        <div className="jk-l">{coords}</div>
        <div className="jk-c">
          New York Based,
          <br />
          Working Globally
          <br />
          <span>{clock}</span>
        </div>
        <div className="jk-r">
          © 2026
          <br />
          All Rights Reserved
        </div>
      </footer>

      <style jsx global>{`
        :root {
          --jk-bg: #000;
          --jk-fg: #f2f2f0;
          --jk-dim: #7c7c78;
          --jk-accent: #2b4cff;
          --jk-band-h: 62vh;
        }
        html,
        body {
          height: 100%;
        }
        body {
          background: var(--jk-bg);
          overflow: hidden;
        }
      `}</style>

      <style jsx>{`
        .jk-stage {
          position: fixed;
          inset: 0;
          background: var(--jk-bg);
          color: var(--jk-fg);
          font-family: ui-monospace, monospace;
        }

        .jk-nav {
          position: fixed;
          inset: 0 0 auto 0;
          z-index: 60;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 22px 30px;
          font-size: 13px;
          letter-spacing: 0.14em;
        }
        .jk-logo {
          font-weight: 500;
        }
        .jk-menu {
          display: flex;
          gap: 26px;
        }
        .jk-menu :global(a) {
          transition: opacity 0.2s;
        }
        .jk-menu :global(a:hover) {
          opacity: 0.5;
        }

        .jk-band {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          height: var(--jk-band-h);
          display: flex;
          align-items: stretch;
          gap: 0;
          padding: 0 30px;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .jk-band::-webkit-scrollbar {
          display: none;
        }

        .jk-poster {
          position: relative;
          flex: 0 0 auto;
          height: 100%;
          aspect-ratio: 3 / 4;
          cursor: pointer;
        }
        .jk-img {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #0a0a0a;
        }
        .jk-img :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.1s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .jk-poster:hover .jk-img :global(img) {
          transform: scale(1.05);
        }

        .jk-label {
          position: absolute;
          left: 0;
          bottom: calc(100% + 12px);
          display: flex;
          align-items: flex-start;
          gap: 12px;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          pointer-events: none;
          white-space: nowrap;
          z-index: 2;
        }
        .jk-poster:hover .jk-label {
          opacity: 1;
          transform: translateY(0);
        }
        .jk-dash {
          width: 22px;
          height: 2px;
          background: var(--jk-accent);
          margin-top: 7px;
        }
        .jk-tt {
          font-size: 15px;
          letter-spacing: 0.06em;
          line-height: 1.5;
        }
        .jk-cl {
          color: var(--jk-dim);
        }

        .jk-foot {
          position: fixed;
          inset: auto 0 0 0;
          z-index: 55;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          align-items: end;
          padding: 22px 30px;
          font-size: 13px;
          letter-spacing: 0.08em;
        }
        .jk-l {
          color: var(--jk-fg);
          font-variant-numeric: tabular-nums;
        }
        .jk-c {
          text-align: center;
          line-height: 1.5;
          text-transform: uppercase;
        }
        .jk-r {
          text-align: right;
          line-height: 1.5;
          text-transform: uppercase;
        }

        @media (max-width: 860px) {
          .jk-stage {
            position: static;
            min-height: 100%;
          }
          :global(body) {
            overflow-y: auto;
          }
          .jk-nav {
            padding: 18px 18px;
            font-size: 12px;
            letter-spacing: 0.1em;
          }
          .jk-menu {
            gap: 16px;
          }
          .jk-band {
            position: static;
            transform: none;
            height: auto;
            flex-direction: column;
            gap: 34px;
            padding: 92px 18px 150px;
            overflow: visible;
          }
          .jk-poster {
            width: 100%;
            height: auto;
            aspect-ratio: 3 / 4;
          }
          .jk-label {
            position: static;
            opacity: 1;
            transform: none;
            margin-top: 10px;
          }
          .jk-foot {
            grid-template-columns: 1fr;
            gap: 4px;
          }
          .jk-l {
            display: none;
          }
          .jk-c,
          .jk-r {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}
