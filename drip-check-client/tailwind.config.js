/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'noir': '#0f0f0f',
        'soft-purple': '#9b5de5',
        'neon-peach': '#ffb3c1',
        'electric-cyan': '#00f0ff',
        'cloud-white': '#f8f8f8',
        'drip-green': '#6ef195',
      },
      fontFamily: {
        'heading': ['Unica One', 'Bebas Neue', 'sans-serif'],
        'body': ['Poppins', 'Satoshi', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slideshow': 'slideshow 20s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #9b5de5, 0 0 10px #9b5de5' },
          '100%': { boxShadow: '0 0 10px #9b5de5, 0 0 20px #9b5de5, 0 0 30px #9b5de5' },
        },
        slideshow: {
          '0%, 20%': { opacity: '1' },
          '25%, 95%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
