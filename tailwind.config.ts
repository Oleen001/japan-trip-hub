import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#1a2332', soft: '#48566b', faint: '#8794a8' },
        paper: { DEFAULT: '#f7f9fc', sunken: '#eef2f8' },
        line: { DEFAULT: '#e3e8f0', strong: '#d4e3ec' },
        alp: { DEFAULT: '#2d6a8e', dark: '#1d4d6b', soft: '#e8f1f6', 700: '#255a78' },
        koyo: { DEFAULT: '#c8662f', soft: '#fbeee4', dark: '#a4521f' },
        snow: '#6b8aa8',
        gold: '#b8893a',
        ok: { DEFAULT: '#2f7d52', soft: '#e6f3eb' },
        warn: { DEFAULT: '#b03a3a', soft: '#fbeaea' },
      },
      borderRadius: { xs: '6px', sm: '8px', md: '10px', lg: '14px', xl: '16px', '2xl': '20px' },
      boxShadow: {
        card: '0 1px 2px rgba(20,40,70,.05), 0 8px 24px rgba(20,40,70,.07)',
        pop: '0 4px 12px rgba(20,40,70,.10), 0 16px 40px rgba(20,40,70,.14)',
        pin: '0 2px 6px rgba(20,40,70,.22)',
      },
      fontFamily: {
        sans: ['var(--font-sarabun)', 'Sukhumvit Set', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        h1: ['38px', { lineHeight: '1.2', letterSpacing: '-.02em', fontWeight: '800' }],
        'h1-m': ['28px', { lineHeight: '1.2', letterSpacing: '-.02em', fontWeight: '800' }],
        h2: ['23px', { lineHeight: '1.25', letterSpacing: '-.01em', fontWeight: '800' }],
        lead: ['15px', { lineHeight: '1.65' }],
        meta: ['13px', { lineHeight: '1.5' }],
        label: ['12px', { lineHeight: '1.4', letterSpacing: '.05em' }],
        tag: ['11px', { lineHeight: '1.3', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
};

export default config;
