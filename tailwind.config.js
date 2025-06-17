/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
      },
      colors: {
        primary: {
          100: '#A8E0FF',
          200: '#8EE3EF',
          300: '#70CAD1',
          400: '#3E8E9E',
          500: '#2F4858',
        },
        success: {
          100: '#E0FFF0',
          500: '#10B981',
          700: '#047857',
        },
        warning: {
          100: '#FFF7E0',
          500: '#F59E0B',
          700: '#B45309',
        },
        danger: {
          100: '#FEE2E2',
          500: '#EF4444',
          700: '#B91C1C',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backdropBlur: {
        'glass': '10px',
      },
    },
  },
  plugins: [],
};