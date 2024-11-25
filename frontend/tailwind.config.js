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
  // Enable hover and active states
  future: {
    hoverOnlyWhenSupported: true,
  },
  safelist: [
    'hover:bg-secondary-light',
    'active:bg-secondary-focus',
  ],
  // Enable all variants including active
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
          primary: "#f43f5e",
          "primary-content": "#ffffff",
          secondary: "#0ea5e9",
          "secondary-content": "#ffffff",
          "secondary-focus": "#0284c7",
          "secondary-light": "#e0f2fe",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#f87171",
          "primary-content": "#1f2937",
          secondary: "#38bdf8",
          "secondary-content": "#1f2937",
          "secondary-focus": "#0ea5e9",
          "secondary-light": "#075985",
        }
      }
    ]
  },
  plugins: [require("daisyui")], 
};