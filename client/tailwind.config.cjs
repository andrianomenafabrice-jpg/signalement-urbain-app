/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bitume: '#242321',
        beton: '#EEEAE2',
        'encre-urbaine': '#1A1917',
        'marquage-voirie': '#E8600C',
        'marquage-eclairage': '#E8B800',
        'marquage-dechets': '#6B7A3D',
        'marquage-eau': '#0E6FA6',
        'marquage-autre': '#6B5B7B',
        'signal-succes': '#2F7D52',
        'signal-erreur': '#C23B22',
      },
      fontFamily: {
        display: ['"Archivo"', 'sans-serif'],
        body: ['"Source Sans 3"', '"Noto Sans"', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};