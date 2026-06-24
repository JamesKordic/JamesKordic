import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Pentagram-inspired editorial palette — light mode. Bright paper,
        // near-black ink, hairline rules, one hot accent.
        bg: '#FFFFFF', // paper page background
        panel: '#F2F2F2', // card / placeholder surface
        'panel-2': '#ECECEC', // image placeholder fill
        elev: '#F2F2F2', // hover surface
        'elev-hi': '#E9E9E9',
        text: '#0A0A0A', // ink
        muted: '#727272', // grey — secondary text
        'muted-2': '#9A9A9A',
        line: '#E6E6E6', // hairline rules

        // Header / chrome — same paper as content, hairline divider.
        paneldark: '#FFFFFF', // header surface
        panelfg: '#0A0A0A', // text/icons in the header
        paneldim: '#727272', // muted text in the header
        panelline: '#E6E6E6', // hairlines in the header

        // Pentagram has no single accent — chrome is pure black on white, and
        // colour appears only in the discipline tags. "accent" is therefore
        // ink, so any lingering text-accent / border-accent reads black.
        accent: '#0A0A0A',
        'accent-ink': '#FFFFFF', // text/icons on top of the accent

        // Legacy gradient tokens, kept neutral so nothing reads as a stray hue.
        magenta: '#0A0A0A',
        'magenta-deep': '#000000',
        cyan: '#727272',
        'cyan-deep': '#4a4a4a',
        violet: '#9A9A9A',
        'violet-deep': '#6a6a6a',
        amber: '#0A0A0A',
      },
      fontFamily: {
        // Neue Haas Grotesk on the real site; Helvetica Neue is the closest
        // ubiquitous match (and is installed on the user's macOS).
        display: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        ui: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        spin: 'spin 5s linear infinite',
        eq: 'eq 0.8s ease-in-out infinite',
        'view-in': 'viewIn 0.4s cubic-bezier(0.2,0.7,0.2,1)',
        up: 'up 0.5s cubic-bezier(0.2,0.7,0.2,1) forwards',
        fadein: 'fadein 0.25s ease',
        // New: slow gradient drift
        'gradient-drift': 'gradientDrift 18s ease-in-out infinite',
        'blob-1': 'blob1 22s ease-in-out infinite',
        'blob-2': 'blob2 26s ease-in-out infinite',
        'blob-3': 'blob3 20s ease-in-out infinite',
        // New: gradient text shimmer
        shimmer: 'shimmer 6s linear infinite',
      },
      keyframes: {
        eq: {
          '0%,100%': { height: '25%' },
          '50%': { height: '100%' },
        },
        viewIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'none' },
        },
        up: { to: { opacity: '1', transform: 'none' } },
        fadein: { from: { opacity: '0' }, to: { opacity: '1' } },
        gradientDrift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        blob1: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(50px,-30px) scale(1.1)' },
          '66%': { transform: 'translate(-30px,40px) scale(0.95)' },
        },
        blob2: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(-40px,30px) scale(0.9)' },
          '66%': { transform: 'translate(60px,-20px) scale(1.15)' },
        },
        blob3: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%': { transform: 'translate(30px,-50px) scale(1.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        // Reusable gradients
        'gradient-aurora':
          'linear-gradient(135deg, #c8f135 0%, #22d3ee 50%, #ff2d8a 100%)',
        'gradient-sunset':
          'linear-gradient(135deg, #ff2d8a 0%, #ffb84a 50%, #c8f135 100%)',
        'gradient-twilight':
          'linear-gradient(135deg, #8b5cf6 0%, #22d3ee 50%, #c8f135 100%)',
        'gradient-magenta-cyan':
          'linear-gradient(135deg, #ff2d8a 0%, #22d3ee 100%)',
        'gradient-text':
          'linear-gradient(90deg, #c8f135, #22d3ee, #ff2d8a, #c8f135)',
      },
    },
  },
  plugins: [],
};

export default config;
