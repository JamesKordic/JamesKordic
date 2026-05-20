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
        bg: '#000000',
        panel: '#121214',
        'panel-2': '#1a1a1d',
        elev: '#232327',
        'elev-hi': '#2c2c31',
        text: '#f3f1ec',
        muted: '#a3a3a6',
        'muted-2': '#74747a',
        accent: '#c8f135',
        'accent-ink': '#10130a',
        line: '#262629',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        ui: ['"Hanken Grotesk"', 'sans-serif'],
      },
      animation: {
        spin: 'spin 5s linear infinite',
        eq: 'eq 0.8s ease-in-out infinite',
        'view-in': 'viewIn 0.4s cubic-bezier(0.2,0.7,0.2,1)',
        up: 'up 0.5s cubic-bezier(0.2,0.7,0.2,1) forwards',
        fadein: 'fadein 0.25s ease',
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
      },
    },
  },
  plugins: [],
};

export default config;
