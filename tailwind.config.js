/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#7D3C98', // Vibrant Purple
          secondary: '#1E1E50', // Deep Blue
          accent: '#00D4FF', // Electric Cyan
          text: '#F5F5F5', // Soft White
          background: '#121212', // Dark Theme
          button: '#7D3C98', // Button Color
          'button-hover': '#6A0DAD', // Button Hover
          cta: '#32CD32', // Neon Green for CTA
        },
      },
    },
    plugins: [],
  }