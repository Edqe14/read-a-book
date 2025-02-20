import type { Config } from 'tailwindcss';
import { heroui } from '@heroui/react';

const beige = {
  DEFAULT: '#E5E3D7',
  50: '#FDFDFC',
  100: '#F9F8F6',
  200: '#F5F4F0',
  300: '#EFEEE6',
  400: '#EBE9E0',
  500: '#E5E3D7',
  600: '#C3BEA2',
  700: '#9F976B',
  800: '#6C6646',
  900: '#353222',
  950: '#1C1A12',
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
const rose = {
  DEFAULT: '#F76F53',
  50: '#FEEFEC',
  100: '#FDE2DD',
  200: '#FCC6BB',
  300: '#FAA999',
  400: '#F98C77',
  500: '#F76F53',
  600: '#F43A15',
  700: '#BE2709',
  800: '#7F1A06',
  900: '#3F0D03',
  950: '#1D0601',
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
        rose,
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
            secondary: {
              ...beige,
              foreground: oxford[500],
            },
            focus: rose,
            content4: beige[500],
          },
        },
      },
    }),
  ],
};
export default config;
