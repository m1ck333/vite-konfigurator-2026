module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#3879a6",
        "primary-accent": "#20597d",
        "primary-dark": "#708090",
        "primary-dark-accent": "#4d565f",
        "primary-light": "#F5F5F5",
        "primary-grey-lightest": "#e8e6e6",
        "primary-grey-light": "#a9a9a9",
        "primary-grey": "#878787",
        "primary-grey-dark": "#656565",
        "primary-light-accent": "#ccc500",
        "primary-white": "#FFFFFF",
        "primary-green": "#058274",
        "primary-green-dark": "#01453e",
        "primary-green-light": "#71a69f",
        "primary-green-dark-hover": "#013d37",
        "primary-cream": "#f5edd5",
        danger: "#dc3545",
        "danger-dark": "#a71d2a",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      keyframes: {
        dropdown: {
          "0%": { opacity: 0, transform: "translateY(-10px) scale(0.95)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        dropdown: "dropdown 0.2s ease-out forwards",
        "fade-in-up": "fadeInUp 0.28s ease-out",
        "fade-in": "fadeIn 0.35s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(1, 69, 62, 0.12)",
        "soft-lg": "0 10px 40px -8px rgba(1, 69, 62, 0.18)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
