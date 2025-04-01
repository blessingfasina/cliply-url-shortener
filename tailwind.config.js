// tailwind.config.js
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
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 15px rgba(125, 60, 152, 0.5)',
        'accent-glow': '0 0 15px rgba(0, 212, 255, 0.5)',
      },
    },
  },
  plugins: [],
};