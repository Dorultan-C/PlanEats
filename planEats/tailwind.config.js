
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Ensure these paths cover all your component files
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'bodoni': ['BodoniModa'],
      },
      colors: {
        primary: '#4CAF50',
        secondary: '#FFC107',
        tertiary: '#2196F3',
        alternate: '#F44336',
        primaryText: '#212121',
        secondaryText: '#757575',
        primaryBackground: '#FFFFFF',
        secondaryBackground: '#F5F5F5',
      },
    },
  },
  plugins: [],
}