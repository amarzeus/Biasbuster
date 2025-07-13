/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'trust-blue': {
          'DEFAULT': '#2A5C8A',
          'light': '#3E7CB1',
          'dark': '#1F446E'
        },
        'ai-teal': {
          'DEFAULT': '#2EC4B6',
          'light': '#48D8C9',
          'dark': '#249D90'
        },
        'gold-accent': '#FFC107',
        'neutral': {
          100: '#F8F9FA',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#ADB5BD',
          600: '#6C757D',
          700: '#495057',
          800: '#343A40',
          900: '#212529'
        }
      }
    }
  },
  plugins: [],
}
