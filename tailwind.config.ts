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
        // Editorial studio palette — warm cream base, ink text, terracotta accent.
        // Light surfaces for the main content area.
        bg: '#FAFAF8', // cream page background
        panel: '#F1EFE8', // card / placeholder surface
        'panel-2': '#E6E4DD', // image placeholder fill
        elev: '#EDEAE0', // hover surface
        'elev-hi': '#E6E4DD',
        text: '#1B1A16', // ink
        muted: '#7C7A72', // dim text
        'muted-2': '#9A968A',
        line: '#E6E4DD', // hairline rules

        // Dark sidebar panel surfaces
        paneldark: '#15140F',
        panelfg: '#EDEAE0',
        paneldim: '#9A968A',
        panelline: '#33312a',

        // Primary accent — terracotta
        accent: '#C0683C',
        'accent-ink': '#FFF7F0', // text/icons on top of the accent

        // Legacy gradient tokens, repointed to warm earth tones so any
        // lingering reference reads cohesively rather than neon.
        magenta: '#C0683C',
        'magenta-deep': '#8a4a2c',
        cyan: '#5E7D86',
        'cyan-deep': '#3f5b63',
        violet: '#8a6d4f',
        'violet-deep': '#5e4a35',
        amber: '#d8a070',
      },
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        ui: ['Manrope', 'system-ui', 'sans-serif'],
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
