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
        // Paper/cream backgrounds
        paper: '#f5ebd6',
        'paper-2': '#ebe0c6',
        'paper-3': '#e0d4b5',
        // Ink (dark warm tone, not pure black)
        ink: '#1a1410',
        'ink-2': '#2a2018',
        'ink-3': '#3d2f24',
        // Muted on paper
        muted: '#7a6a55',
        'muted-2': '#a8957a',
        // Saturated accents
        coral: '#ff4632',
        'coral-deep': '#d62914',
        cobalt: '#3a5cff',
        'cobalt-deep': '#1d3dd1',
        butter: '#ffc740',
        moss: '#4a7c2e',
        plum: '#5e2a8a',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        ui: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        spin: 'spin 4s linear infinite',
        eq: 'eq 0.7s ease-in-out infinite',
        'view-in': 'viewIn 0.55s cubic-bezier(0.16,1,0.3,1)',
        up: 'up 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        fadein: 'fadein 0.25s ease',
        'drift-1': 'drift1 7s ease-in-out infinite',
        'drift-2': 'drift2 9s ease-in-out infinite',
        'drift-3': 'drift3 11s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
        ticker: 'ticker 14s linear infinite',
      },
      keyframes: {
        eq: {
          '0%,100%': { height: '20%' },
          '50%': { height: '100%' },
        },
        viewIn: {
          from: { opacity: '0', transform: 'translateY(24px) scale(0.98)' },
          to: { opacity: '1', transform: 'none' },
        },
        up: {
          to: { opacity: '1', transform: 'none' },
        },
        fadein: { from: { opacity: '0' }, to: { opacity: '1' } },
        drift1: {
          '0%,100%': { transform: 'rotate(-2deg) translateY(0px)' },
          '50%': { transform: 'rotate(-1deg) translateY(-6px)' },
        },
        drift2: {
          '0%,100%': { transform: 'rotate(1.5deg) translateY(0px)' },
          '50%': { transform: 'rotate(2.5deg) translateY(-8px)' },
        },
        drift3: {
          '0%,100%': { transform: 'rotate(-0.5deg) translateY(0px)' },
          '50%': { transform: 'rotate(0.5deg) translateY(-5px)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        ticker: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
