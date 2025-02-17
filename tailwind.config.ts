import type { Config } from 'tailwindcss';
import { heroui } from '@heroui/react';

const beige = {
  DEFAULT: '#EBEBD3',
  50: '#FDFDFB',
  100: '#FAFAF4',
  200: '#F7F7ED',
  300: '#F4F4E6',
  400: '#EFEFDC',
  500: '#EBEBD3',
  600: '#D6D6A4',
  700: '#BEBE6F',
  800: '#A1A149',
  900: '#747435',
  950: '#515125',
};
const oxford = {
  DEFAULT: '#1C2541',
  50: '#E2E7F3',
  100: '#C6CEE6',
  200: '#899ACC',
  300: '#5069B4',
  400: '#36477D',
  500: '#1C2541',
  600: '#171F35',
  700: '#111627',
  800: '#0B0E19',
  900: '#06080E',
  950: '#030407',
};

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        beige,
        oxford,
      },
      fontFamily: {
        inter: ['var(--inter)', 'system-ui', 'sans-serif'],
        'noto-serif': ['var(--noto-serif)', 'serif'],
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: oxford,
            secondary: beige,
          },
        },
      },
    }),
  ],
};
export default config;
