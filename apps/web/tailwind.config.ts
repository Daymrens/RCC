import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0B',
        surface: '#111113',
        'surface-2': '#1A1A1E',
        'surface-3': '#242428',
        border: '#2A2A30',
        accent: '#3B82F6',
        'accent-dim': '#1D3461',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        text: '#F0F0F5',
        'text-muted': '#6B7280',
        'text-dim': '#374151'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
};

export default config;
