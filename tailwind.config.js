/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream:    { DEFAULT: '#F5EFE0', light: '#FAF6EE', dark: '#EDE3CC' },
        crimson:  { DEFAULT: '#8B1A1A', light: '#A52020', dark: '#6B1212' },
        gold:     { DEFAULT: '#C4943A', light: '#D4A84B', dark: '#A07828' },
        bark:     { DEFAULT: '#3D1F10', light: '#5C3020' },
        sand:     '#D4C4A0',
      },
      fontFamily: {
        sans:   ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif:  ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        'warm-sm': '0 2px 12px rgba(61,31,16,0.10)',
        'warm':    '0 4px 24px rgba(61,31,16,0.14)',
        'warm-lg': '0 12px 48px rgba(61,31,16,0.18)',
      },
      backgroundImage: {
        'paper': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}
