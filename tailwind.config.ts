// tailwind.config.ts
import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  // @ts-expect-error - daisyui is not typed in Tailwind config
  daisyui: {
    themes: ['light', 'dark'],
  },
};

export default config;