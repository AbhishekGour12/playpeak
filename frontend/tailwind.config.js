/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        tech: ['"Orbitron"', 'sans-serif'],
        athletic: ['"Teko"', '"Outfit"', 'sans-serif'],
        script: ['"Caveat"', 'cursive'],
      },
      colors: {
        brand: {
          orange: '#FF6A1A',
          orangeHover: '#EA580C',
          navy: '#0B1320',
          dark: '#111827',
          lightBg: '#F8FAFC',
        },
        volt: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#00F59B', // Electric Volt
          600: '#05c77e',
          700: '#069c64',
          800: '#0a7a50',
          900: '#065036',
          950: '#022c1e',
        },
        cyber: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#00E5FF', // Neon Cyber Cyan
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        crimson: {
          500: '#FF4655', // Esports Athletic Crimson
          600: '#E63242',
          700: '#CC1F2F',
        },
        obsidian: {
          800: '#131B2E',
          850: '#0E1626',
          900: '#0B0F17',
          950: '#070A0F',
          999: '#04060A',
        },
        gold: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 245, 155, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.4)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 4px 10px -2px rgba(0, 245, 155, 0.03)',
        'card-hover': '0 20px 40px -10px rgba(0, 245, 155, 0.15)',
        'glow-volt': '0 0 25px rgba(0, 245, 155, 0.35)',
        'glow-cyan': '0 0 25px rgba(0, 229, 255, 0.35)',
        'glow-crimson': '0 0 25px rgba(255, 70, 85, 0.35)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 8px rgba(0, 245, 155, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 20px rgba(0, 229, 255, 0.7))' },
        }
      }
    },
  },
  plugins: [],
}