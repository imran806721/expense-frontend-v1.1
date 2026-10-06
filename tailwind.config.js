/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#10182B',
          raised: '#161F38',
          muted: '#8891A8',
        },
        paper: {
          DEFAULT: '#F7F5EF',
          dim: '#E9E5D8',
          muted: '#6B6355',
        },
        ledger: {
          green: '#1F9D6B',
        },
        stamp: {
          amber: '#E8873A',
        },
        alert: {
          coral: '#E15251',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        'stamp-in': {
          '0%': { transform: 'scale(1.15)', opacity: '0', filter: 'brightness(1.4)' },
          '60%': { transform: 'scale(0.98)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1', filter: 'brightness(1)' },
        },
        'stamp-in-reduced': {
          '0%': { backgroundColor: 'rgba(232, 135, 58, 0.35)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
      animation: {
        'stamp-in': 'stamp-in 420ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'stamp-in-reduced': 'stamp-in-reduced 900ms ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
