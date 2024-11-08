/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {     
    extend: {
      colors: {
        'primary': '#1e1e1e',
        'secondary': '#C3C3C3',
        'accent': '#FFD700',
        'third': '#e8e8e8',
        'fourth': '#7e7e7e',
        'white': '#ffffff',
        'progress': '#1FD655',  
        'html' : "#F16529",
        'css' : "#2965F1",
        'tailwindcss' : "#1CAABA",
        'wp' : "#21759B",
        'php' : "#6181B6",
        'illustrator' : "#FF9A00",
        'photoshop' : "#31A8FF",
        'figma' : "#0AC9FF",
        'trello' :'#0FD5B6',
      },
    }
  },
  plugins: []
}
