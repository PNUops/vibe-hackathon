import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        beach: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e5fe',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        sand: {
          50: '#fefdfb',
          100: '#fdf6ed',
          200: '#f9e6d0',
          300: '#f5d5a8',
          400: '#efb56e',
          500: '#e9944a',
          600: '#da733f',
          700: '#b55635',
          800: '#914430',
          900: '#763928',
        },
        wave: {
          50: '#f0fdfc',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        coral: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        }
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'wave': 'wave 2.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'bubble': 'bubble 4s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        bubble: {
          '0%, 100%': { transform: 'scale(1) translateY(0px)' },
          '50%': { transform: 'scale(1.05) translateY(-5px)' },
        }
      },
      backgroundImage: {
        'gradient-beach': 'linear-gradient(to bottom right, #7dd3fc, #5eead4)',
        'gradient-sunset': 'linear-gradient(to bottom right, #fda4af, #fbbf24)',
        'gradient-ocean': 'linear-gradient(to bottom right, #0ea5e9, #0d9488)',
      }
    },
  },
  plugins: [],
}

export default config