import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // NIVO Deep Space Colors
        nivo: {
          bg: "#030305",
          surface: "#0a0a0c",
          highlight: "#111114",
          border: "rgba(255,255,255,0.08)",
          blue: "#2E5CFF",
        },
      },
      fontFamily: {
        // Design System Typography - Luxe & Science
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SF Mono', 'Consolas', 'monospace'],
        data: ['"JetBrains Mono"', 'SF Mono', 'monospace'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      gap: {
        'bento': '24px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px -5px rgba(46, 92, 255, 0.4)" },
          "50%": { boxShadow: "0 0 40px -5px rgba(46, 92, 255, 0.6)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "border-beam": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "breathe-border": {
          "0%, 100%": { 
            borderColor: "rgba(46, 92, 255, 0.2)",
            boxShadow: "0 0 20px -5px rgba(46, 92, 255, 0.2)",
          },
          "50%": { 
            borderColor: "rgba(46, 92, 255, 0.4)",
            boxShadow: "0 0 30px -5px rgba(46, 92, 255, 0.3)",
          },
        },
        "card-shine": {
          "0%": { transform: "translateX(-100%) skewX(-15deg)" },
          "100%": { transform: "translateX(200%) skewX(-15deg)" },
        },
        "glow-blue": {
          "0%, 100%": { 
            boxShadow: "0 0 20px -5px rgba(46, 92, 255, 0.3)",
          },
          "50%": { 
            boxShadow: "0 0 40px -5px rgba(46, 92, 255, 0.5)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.3s ease-out",
        "accordion-up": "accordion-up 0.3s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "border-beam": "border-beam 4s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "breathe-border": "breathe-border 4s ease-in-out infinite",
        "card-shine": "card-shine 3s ease-in-out infinite",
        "glow-blue": "glow-blue 3s ease-in-out infinite",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
      boxShadow: {
        "glow-blue": "0 0 40px -10px rgba(46, 92, 255, 0.5)",
        "glow-white": "0 0 30px -10px rgba(255, 255, 255, 0.3)",
        "deep-glass": "0 8px 32px 0 rgba(0,0,0,0.5)",
        "inner-top": "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        "crystal": "0 8px 32px 0 rgba(0,0,0,0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;