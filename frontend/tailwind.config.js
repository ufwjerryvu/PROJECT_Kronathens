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
    daisyui: {
      themes: [
        {
          light: {
            ...require("daisyui/src/theming/themes")["light"],
            primary: "#f43f5e",
            "primary-content": "#ffffff",
          },
          dark: {
            ...require("daisyui/src/theming/themes")["dark"],
            primary: "#f87171",
            "primary-content": "#1f2937",
          }
        }
      ]
    },
    plugins: [require("daisyui")], 
};