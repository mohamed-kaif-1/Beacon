/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#080811',
          indigo: '#635BFF',
          violet: '#8B5CF6',
          blue: '#4FA5FF',
          electric: '#38BDF8',
          text: '#F5F5FA',
          muted: '#A1A1B5',
          border: 'rgba(99, 91, 255, 0.2)'
        },
        beacon: {
          dark: '#0e1117',
          surface: '#151922',
          card: '#1c212e',
          cardHover: '#232a3b',
          border: '#2a3144',
          accent: '#635BFF',
          accentHover: '#4F46E5',
          muted: '#8e96aa'
        },
        helm: {
          dark: '#0e1117',
          surface: '#151922',
          card: '#1c212e',
          cardHover: '#232a3b',
          border: '#2a3144',
          accent: '#10b981',
          accentHover: '#059669',
          muted: '#8e96aa'
        }
      },
      fontFamily: {
        sans: [
          'Segoe UI Variable Text',
          'Segoe UI',
          '-apple-system',
          'BlinkMacSystemFont',
          'Roboto',
          'sans-serif'
        ]
      }
    }
  },
  plugins: []
}
