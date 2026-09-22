/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#c81e1e', // বাংলা নিউজ পোর্টালের ক্লাসিক লাল — পরের ফেজে চাইলে বদলাবো
          dark: '#991414'
        }
      },
      fontFamily: {
        bangla: ['"Noto Sans Bengali"', 'sans-serif']
      }
    }
  },
  plugins: []
}
