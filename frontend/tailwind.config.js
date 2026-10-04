/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#20252f",
        muted: "#677181",
        line: "#e5e8ee",
        canvas: "#f7f8fa",
        accent: {
          DEFAULT: "#4659c7",
          dark: "#3546ac",
          soft: "#eef0ff",
        },
      },
      boxShadow: {
        dialog: "0 24px 80px rgba(24, 31, 54, 0.18)",
      },
    },
  },
  plugins: [],
};
