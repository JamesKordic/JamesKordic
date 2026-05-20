import { SVGProps } from 'react';

export const PlayIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...p}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const PauseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...p}>
    <path d="M7 5h4v14H7zm6 0h4v14h-4z" />
  </svg>
);

export const VerifiedIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...p}>
    <path
      fill="#c8f135"
      d="m12 2 2.4 2 3.1-.5 1 3 3 1-.5 3.1 2 2.4-2 2.4.5 3.1-3 1-1 3-3.1-.5L12 22l-2.4-2-3.1.5-1-3-3-1 .5-3.1L1 12l2-2.4L2.5 6.5l3-1 1-3 3.1.5z"
    />
    <path fill="#0a0a0a" d="m10.6 14.6-2.3-2.3-1.4 1.4 3.7 3.7 7-7-1.4-1.4z" />
  </svg>
);

export const HomeIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...p}>
    <path className="ic-fill" fill="currentColor" d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3z" />
  </svg>
);

export const SearchIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4.3-4.3" strokeLinecap="round" />
  </svg>
);

export const UserIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...p}>
    <circle cx="12" cy="9" r="3.4" />
    <path d="M5 20c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6" strokeLinecap="round" />
  </svg>
);

export const LibraryIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M3 4h2v16H3zm4 0h2v16H7zm5 0 8 3-1 15-8-3z" />
  </svg>
);

export const BackIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" {...p}>
    <path d="m15 5-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ForwardIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" {...p}>
    <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MenuIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
  </svg>
);

export const ShuffleIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...p}>
    <path
      d="M3 5h4l10 14h4M3 19h4l3-4M21 5h-4l-3 4M18 2l3 3-3 3M18 16l3 3-3 3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PrevIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M7 6v12H5V6zm2 6 10 6V6z" />
  </svg>
);

export const NextIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M17 6v12h2V6zm-2 6L5 6v12z" />
  </svg>
);

export const RepeatIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...p}>
    <path
      d="M17 3l3 3-3 3M3 11V9a4 4 0 0 1 4-4h13M7 21l-3-3 3-3M21 13v2a4 4 0 0 1-4 4H4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const HeartIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M12 20s-7-4.4-9.2-9C1.3 8 3 4.5 6.4 4.5c2.2 0 3.7 1.4 4.6 3 .9-1.6 2.4-3 4.6-3 3.4 0 5.1 3.5 3.6 6.5C19 15.6 12 20 12 20Z" />
  </svg>
);

export const VolumeIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M3 9v6h4l5 5V4L7 9zm13 .5a4 4 0 0 1 0 5M18 6a8 8 0 0 1 0 12" />
  </svg>
);
