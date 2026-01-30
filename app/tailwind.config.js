/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Claymorphism Color System - Sporty & Energetic
      colors: {
        // Primary - Blue Energy
        blue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',  // PRIMARY
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Secondary - Emerald Sport
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',  // SECONDARY
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        // Accent - Orange Vibrant
        orange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',  // ACCENT/CTA
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        // Neutrals - Slate (Clean & Professional)
        slate: {
          50: '#F8FAFC',   // Background
          100: '#F1F5F9',  // Light bg
          200: '#E2E8F0',  // Border
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',  // Secondary text
          600: '#475569',
          700: '#334155',
          800: '#1E293B',  // Primary text
          900: '#0F172A',
        },
        // Additional Colors
        amber: {
          500: '#F59E0B',
          600: '#D97706',
        },
        red: {
          500: '#EF4444',
          600: '#DC2626',
        },
        yellow: {
          500: '#EAB308',
          600: '#CA8A04',
        },
        teal: {
          500: '#14B8A6',
          600: '#0D9488',
        },

        // Legacy compatibility
        border: '#E2E8F0',
        input: '#E2E8F0',
        ring: '#3B82F6',
        background: '#F8FAFC',
        foreground: '#1E293B',
        primary: {
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#F97316',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F1F5F9',
          foreground: '#64748B',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#1E293B',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1E293B',
        },
      },

      // Typography - Sporty & Athletic
      fontFamily: {
        sans: ['Barlow', 'system-ui', '-apple-system', 'sans-serif'],
        condensed: ['Barlow Condensed', 'system-ui', 'sans-serif'],
      },

      // Border Radius - Chunky Claymorphism
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        xl: '12px',
        lg: '8px',
        md: '6px',
        sm: '4px',
      },

      // Shadows - Claymorphism (Dual: Outer + Inner)
      boxShadow: {
        // Claymorphism shadows
        'clay-sm': '0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.5)',
        'clay': '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
        'clay-lg': '0 8px 24px rgba(0, 0, 0, 0.12), inset 0 2px 6px rgba(255, 255, 255, 0.3)',

        // Colored shadows for buttons
        'blue': '0 4px 14px rgba(59, 130, 246, 0.4)',
        'emerald': '0 4px 14px rgba(16, 185, 129, 0.4)',
        'orange': '0 4px 14px rgba(249, 115, 22, 0.4)',

        // Lift effect
        'lift': '0 12px 32px rgba(0, 0, 0, 0.15), inset 0 2px 6px rgba(255, 255, 255, 0.3)',
      },

      // Letter Spacing
      letterSpacing: {
        tight: '-0.01em',
        'extra-tight': '-0.02em',
      },

      // Keyframes & Animations
      keyframes: {
        // Spring animation
        spring: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        // Lift animation
        lift: {
          '0%': { transform: 'translateY(0)', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' },
          '100%': { transform: 'translateY(-4px)', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)' },
        },
        // Press animation
        press: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.95)' },
        },
        // Existing
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        spring: 'spring 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        lift: 'lift 0.2s ease-out forwards',
        press: 'press 0.1s ease-out forwards',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}