/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // CasimirQ platform palette (mirrors the app's HSL tokens).
        bg: '#0a1120',
        surface: '#0e1729',
        card: '#0f1b30',
        border: '#1e2d47',
        ink: '#e8eef7',
        muted: '#8fa3bf',
        primary: {
          DEFAULT: '#22b8f0',
          soft: '#38bdf8',
          deep: '#0b7ec2',
        },
        quantum: {
          violet: '#8b5cf6',
          pink: '#ec4899',
          teal: '#2dd4bf',
          amber: '#fbbf24',
          green: '#34d399',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        400: '400',
        500: '500',
        600: '600',
        700: '700',
        800: '800',
      },
      spacing: {
        4.5: '1.125rem',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(34, 184, 240, 0.45)',
        'glow-soft': '0 0 60px -20px rgba(34, 184, 240, 0.6)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [],
};
