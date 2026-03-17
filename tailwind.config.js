/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        ink: "#1F2937",
        body: "#6B7280",
        label: "#9CA3AF",
        surface: "#F9FAFB",
        line: "#E5E7EB",
        mint: "#6EE7B7",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
      },
      borderRadius: {
        xl2: "1rem",
      },
      maxWidth: {
        app: "430px",
      },
    },
  },
  plugins: [],
};
