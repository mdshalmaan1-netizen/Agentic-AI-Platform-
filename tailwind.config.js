/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F7F3EC",
          light: "#FBF9F5",
          dark: "#EFE9DE",
        },
        forest: {
          50: "#E8F0EB",
          100: "#C9DCD1",
          200: "#9FC1AD",
          300: "#6FA382",
          400: "#3F7F5C",
          500: "#1F5C3E",
          600: "#1B4332",
          700: "#153729",
          800: "#102A1F",
          900: "#0A1D15",
        },
        ink: {
          DEFAULT: "#1C1C1A",
          light: "#5C5C57",
          muted: "#8A8A83",
        },
        card: "#FFFFFF",
        border: "#E7E1D5",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 10px rgba(28, 28, 26, 0.05)",
        soft: "0 8px 30px rgba(28, 28, 26, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
}
