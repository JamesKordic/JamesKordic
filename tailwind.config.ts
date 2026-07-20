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
        // Pentagram-inspired editorial palette — dark mode. Near-black ink
        // page, light type, hairline rules, one hot accent.
        bg: '#0A0A0A', // ink page background
        panel: '#161616', // card / placeholder surface
        'panel-2': '#1D1D1D', // image placeholder fill
        elev: '#191919', // hover surface
        'elev-hi': '#232323',
        text: '#F2F2F2', // paper-white type
        muted: '#A3A3A3', // grey — secondary text
        'muted-2': '#6F6F6F',
        line: '#262626', // hairline rules

        // Header / chrome — same ink as content, hairline divider.
        paneldark: '#0A0A0A', // header surface
        panelfg: '#F2F2F2', // text/icons in the header
        paneldim: '#A3A3A3', // muted text in the header
        panelline: '#262626', // hairlines in the header

        // Primary accent — hot red-orange.
        accent: '#FF3B1F',
        'accent-ink': '#FFFFFF', // text/icons on top of the accent

        // Legacy gradient tokens, repointed to the accent/neutral family so
        // any lingering reference stays cohesive rather than neon.
        magenta: '#FF3B1F',
        'magenta-deep': '#c72d14',
        cyan: '#A3A3A3',
        'cyan-deep': '#CFCFCF',
        violet: '#6F6F6F',
        'violet-deep': '#8F8F8F',
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
