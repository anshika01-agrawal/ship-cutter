/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#000000',
          card: '#111111',
          surface: '#1a1a1a',
          secondary: '#2a2a2a',
          border: '#333333',
          hover: '#222222',
        },
        text: {
          primary: '#ffffff',
          secondary: '#999999',
          muted: '#666666',
        },
        accent: {
          DEFAULT: '#e0e0e0',
          blue: '#38bdf8',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          orange: '#f97316',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(255, 255, 255, 0.08)',
        'glow': '0 0 25px rgba(56, 189, 248, 0.15)',
        'glow-accent': '0 0 30px rgba(224, 224, 224, 0.12)',
      },
    },
  },
  plugins: [],
}
