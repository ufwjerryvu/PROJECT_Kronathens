/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens:{
        xl: '1200px',
        '2xl': '1200px'
      }
    },
    fontFamily: {
      sans: ['Montserrat', 'sans-serif']
    },
    extend: {},
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  safelist: [
    'hover:bg-secondary-light',
    'active:bg-secondary-focus',
  ],
  variants: {
    extend: {
      backgroundColor: ['active', 'hover'],
      opacity: ['active'],
    }
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#2dd4bf",           // Teal 400
          "primary-content": "#ffffff",
          secondary: "#f97316",         // Orange 500
          "secondary-content": "#ffffff",
          "secondary-focus": "#ea580c", // Orange 600
          "secondary-light": "#ffedd5", // Orange 100
          accent: "#06b6d4",           // Cyan 500
          neutral: "#374151",          // Gray 700
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#5eead4",           // Teal 300
          "primary-content": "#134e4a", // Teal 900
          secondary: "#fb923c",         // Orange 400
          "secondary-content": "#431407", // Orange 950
          "secondary-focus": "#f97316", // Orange 500
          "secondary-light": "#7c2d12", // Orange 900
          accent: "#22d3ee",           // Cyan 400
          neutral: "#1f2937",          // Gray 800
          "base-100": "#111827",       // Gray 900
          "base-200": "#1f2937",       // Gray 800
          "base-300": "#374151",       // Gray 700
        }
      }
    ]
  },
  plugins: [require("daisyui")], 
};