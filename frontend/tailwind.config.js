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
          // Primary: Rich teal - modern, professional, versatile
          primary: "#0891b2",           // Cyan 600 - balanced saturation for good visibility
          "primary-content": "#ffffff",
          "primary-focus": "#0e7490",   // Cyan 700 - deeper for focus states
          "primary-light": "#cffafe",   // Cyan 100 - subtle background
          
          // Secondary: Warm amber - energetic complement to teal
          secondary: "#d97706",         // Amber 600 - rich amber for strong accents
          "secondary-content": "#ffffff",
          "secondary-focus": "#b45309", // Amber 700 - deeper for focus
          "secondary-light": "#fef3c7", // Amber 100 - subtle background
          
          // Accent: Soft purple - distinctive without overwhelming
          accent: "#7c3aed",           // Violet 600 - vivid but not harsh
          "accent-content": "#ffffff",
          "accent-focus": "#6d28d9",    // Violet 700 - deeper for focus
          "accent-light": "#ede9fe",    // Violet 100 - subtle background
          
          // Neutral: Slate tones - sophisticated gray with subtle blue undertones
          neutral: "#475569",           // Slate 600 - perfect contrast for text
          "neutral-content": "#ffffff",
          "neutral-focus": "#334155",    // Slate 700 - deeper for focus
          
          // Base colors: Clean with subtle depth variations
          "base-100": "#ffffff",
          "base-200": "#f8fafc",        // Slate 50 - more refined differentiation
          "base-300": "#f1f5f9",        // Slate 100 - subtle differentiation
          "base-content": "#0f172a",    // Slate 900 - ideal text contrast
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          // Primary: Brighter teal for dark mode visibility
          primary: "#22d3ee",           // Cyan 400 - vibrant for dark backgrounds
          "primary-content": "#164e63", // Cyan 900 - dark text on light buttons
          "primary-focus": "#06b6d4",   // Cyan 500 - focus state
          "primary-light": "#155e75",   // Cyan 800 - subtle backgrounds
          
          // Secondary: Bright amber for contrast against dark backgrounds
          secondary: "#f59e0b",         // Amber 500 - vibrant but not harsh
          "secondary-content": "#78350f", // Amber 900 - dark text on light buttons
          "secondary-focus": "#d97706", // Amber 600 - focus state
          "secondary-light": "#92400e", // Amber 800 - subtle backgrounds
          
          // Accent: Brighter violet for visibility in dark mode
          accent: "#8b5cf6",           // Violet 500 - rich accent
          "accent-content": "#4c1d95",  // Violet 900 - dark text on light buttons
          "accent-focus": "#7c3aed",    // Violet 600 - focus state
          "accent-light": "#6d28d9",    // Violet 700 - subtle backgrounds
          
          // Neutral: Lighter grays for better visibility
          neutral: "#94a3b8",          // Slate 400 - optimal contrast for dark mode
          "neutral-content": "#0f172a", // Slate 900 - text color
          "neutral-focus": "#cbd5e1",   // Slate 300 - focus state
          
          // Base colors: Rich dark theme with subtle blue undertones
          "base-100": "#0f172a",       // Slate 900 - rich dark background
          "base-200": "#1e293b",       // Slate 800 - subtly lighter
          "base-300": "#334155",       // Slate 700 - for elevation
          "base-content": "#f1f5f9",   // Slate 100 - crisp text contrast
        }
      }
    ]
  },
  plugins: [require("daisyui")], 
};