/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        spotifyGreen: "#1DB954",
        spotifyDark: "#121212",
        spotifyPanel: "rgba(255,255,255,0.03)"
      }
    }
  },
  plugins: []
};
