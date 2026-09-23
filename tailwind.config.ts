import type { Config } from 'tailwindcss';

const config: Config = {
  // Hover styles only apply on devices that can actually hover. Without this,
  // a tap on a phone leaves the tapped row/button in its hover state until
  // you tap elsewhere.
  future: { hoverOnlyWhenSupported: true },
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark cinematic palette: near-black page, off-white type, rules and
        // secondary text as white at low opacity (flattened to hex here so
        // they match the homepage's white/xx values exactly).
        bg: '#0A0A0A',
        panel: '#141414', // media placeholders
        'panel-2': '#141414',
        elev: '#111111',
        'elev-hi': '#1A1A1A',
        text: '#EDEDED',
        muted: '#8C8C8C', // ≈ white/55
        'muted-2': '#5E5E5E', // ≈ white/35
        line: '#232323', // ≈ white/10

        // Header / chrome — the same ink, with the same rules.
        paneldark: '#0A0A0A',
        panelfg: '#EDEDED',
        paneldim: '#8C8C8C',
        panelline: '#232323',

        // Primary interaction accent.
        accent: '#FF3B1F',
        'accent-deep': '#E0301A', // hover on red buttons
        'accent-ink': '#FFFFFF',

        // Legacy gradient tokens, repointed to the accent/neutral family so
        // any lingering reference stays cohesive rather than neon.
        magenta: '#FF3B1F',
        'magenta-deep': '#C72D14',
        cyan: '#8C8C8C',
        'cyan-deep': '#A3A3A3',
        violet: '#5E5E5E',
        'violet-deep': '#6F6F6F',
        amber: '#FF3B1F',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
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
