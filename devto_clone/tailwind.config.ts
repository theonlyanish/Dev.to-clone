import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        'lyra-purple': '#8A2BE2',
        'lyra-dark': '#1A1A1A',
      },
      boxShadow: {
        'lyra-purple': '0 4px 6px -1px rgba(138, 43, 226, 0.5), 0 2px 4px -1px rgba(138, 43, 226, 0.25)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
