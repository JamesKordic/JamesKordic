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
        // Editorial studio palette — dark mode. Warm near-black base, soft
        // off-white ink, terracotta accent.
        bg: '#15130E', // warm near-black page background
        panel: '#201D16', // card / placeholder surface
        'panel-2': '#2A261E', // image placeholder fill
        elev: '#2A261E', // hover surface
        'elev-hi': '#332E24',
        text: '#ECE7DC', // warm off-white ink
        muted: '#C2BCAE', // dim text — brightened for legibility on dark
        'muted-2': '#8E887C',
        line: '#312C22', // hairline rules

        // Sidebar / menu — dark panel, a touch deeper than the content.
        paneldark: '#100E09', // menu surface
        panelfg: '#ECE7DC', // text/icons on the menu
        paneldim: '#8E887C', // muted text on the menu
        panelline: '#2A261E', // hairlines on the menu

        // Primary accent — terracotta, brightened slightly for dark surfaces
        accent: '#D67E4D',
        'accent-ink': '#1B130D', // text/icons on top of the accent

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
