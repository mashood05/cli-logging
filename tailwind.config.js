/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
          lighter: '#334155',
        },
        accent: {
          DEFAULT: '#22d3ee',
          hover: '#67e8f9',
          dim: '#0891b2',
        },
        glass: {
          DEFAULT: 'rgba(30, 41, 59, 0.6)',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(30, 41, 59, 0.8)',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(34, 211, 238, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
