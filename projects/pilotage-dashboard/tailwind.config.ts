import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b1020',
        panel: '#121936',
        accent: '#4f46e5',
        good: '#22c55e',
        warn: '#f59e0b',
      },
    },
  },
  plugins: [],
};

export default config;
