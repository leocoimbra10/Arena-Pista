/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'], // Enable dark mode with class toggle
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Beach Premium Color System - World Class Design
        sand: {
          50: '#FDFCF8',   // Background base - warm off-white like beach sand
          100: '#FAF8F5',  // Subtle variation
          200: '#E5E1DC',  // Border subtle
          400: '#A8A29E',  // Secondary text - warm gray
          900: '#422006',  // Primary text - deep coffee brown (NO pure black)
        },
        teal: {
          DEFAULT: '#0D9488', // Primary actions - elegant deep turquoise
          500: '#0D9488',
          600: '#0D9488',
        },
        coral: {
          DEFAULT: '#F97316', // Accent/CTA - sunset orange
          500: '#F97316',
        },
        white: '#FFFFFF',  // Pure white for cards

        // Dark Mode - Beach Nocturnal Theme
        'sand-dark': {
          50: '#1A1612',   // Dark sand base - deep coffee night
          100: '#2D2419',  // Slightly lighter
          200: '#3D3128',  // Border dark
          400: '#8B7E74',  // Secondary text dark
          900: '#F5E6D3',  // Primary text dark (light sand for dark bg)
        },
        'teal-dark': {
          DEFAULT: '#14B8A6', // Brighter teal for dark mode
          500: '#14B8A6',
          600: '#14B8A6',
        },
        'coral-dark': {
          DEFAULT: '#FB923C', // Brighter coral for dark mode
          500: '#FB923C',
        },

        // Legacy shadcn compatibility (mapped to Beach Premium)
        border: '#E5E1DC',
        input: '#E5E1DC',
        ring: '#0D9488',
        background: '#FDFCF8',
        foreground: '#422006',
        primary: {
          DEFAULT: '#0D9488',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F97316',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: 'hsl(0 84% 60%)',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#FAF8F5',
          foreground: '#A8A29E',
        },
        accent: {
          DEFAULT: '#F97316',
          foreground: '#FFFFFF',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#422006',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#422006',
        },
      },
      borderRadius: {
        '2xl': '16px',  // Buttons - super rounded
        '3xl': '24px',  // Cards & Modals - premium rounded corners
        xl: '12px',
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
      boxShadow: {
        // High-fidelity shadows with subtle color tints
        'card': '0 8px 30px rgba(0, 0, 0, 0.04)',              // Soft diffuse shadow for cards
        'button-teal': '0 4px 14px 0 rgba(13, 148, 136, 0.39)', // Teal glow for primary buttons
        'button-coral': '0 4px 14px 0 rgba(249, 115, 22, 0.39)', // Coral glow for accent buttons
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
      letterSpacing: {
        'tight': '-0.01em',  // Typography optimization
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}