/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
      },
      colors: {
        gold: {
          50: '#FBF7E8',
          100: '#F5ECC5',
          200: '#EDDC8C',
          300: '#E5CC53',
          400: '#D4AF37',
          500: '#C49B2A',
          600: '#A47D1F',
          700: '#7D5F18',
          800: '#5C4512',
          900: '#3B2D0B',
        },
        velvet: {
          950: '#0d0507',
          900: '#1a0b10',
          800: '#2d1520',
          700: '#40212e',
          600: '#55303f',
          500: '#6b4050',
          400: '#8a5568',
        },
      },
    },
  },
  plugins: [],
};
