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
        // NIVO Deep Glass Colors
        nivo: {
          bg: "#0a0e1a",
          surface: "#14192d",
          highlight: "#1a1f3a",
          border: "rgba(255,255,255,0.06)",
          orange: "#ff6b4a",
        },
      },
      fontFamily: {
        // Design System Typography - NIVO Identity
        heading: ['Switzer', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
          "0%, 100%": { boxShadow: "0 0 20px -5px rgba(255, 107, 74, 0.4)" },
          "50%": { boxShadow: "0 0 40px -5px rgba(255, 107, 74, 0.6)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "border-beam": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "aurora-drift": {
          "0%, 100%": { 
            backgroundPosition: "50% 0%, 100% 50%, 0% 80%",
            opacity: "0.4"
          },
          "50%": { 
            backgroundPosition: "60% 10%, 90% 60%, 10% 70%",
            opacity: "0.6"
          },
        },
        "spotlight-pulse": {
          "0%, 100%": { opacity: "0.03" },
          "50%": { opacity: "0.08" },
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 20px -5px rgba(255, 107, 74, 0.3), 0 0 40px -10px rgba(255, 107, 74, 0.2)",
          },
          "50%": { 
            boxShadow: "0 0 30px -5px rgba(255, 107, 74, 0.5), 0 0 60px -10px rgba(255, 107, 74, 0.3)",
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "orb-float": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -20px) scale(1.05)" },
          "66%": { transform: "translate(-20px, 10px) scale(0.95)" },
        },
        "breathe-border": {
          "0%, 100%": { 
            borderColor: "rgba(251, 191, 36, 0.2)",
            boxShadow: "0 0 20px -5px rgba(251, 191, 36, 0.2)",
          },
          "50%": { 
            borderColor: "rgba(251, 191, 36, 0.4)",
            boxShadow: "0 0 30px -5px rgba(251, 191, 36, 0.3)",
          },
        },
        "card-shine": {
          "0%": { transform: "translateX(-100%) skewX(-15deg)" },
          "100%": { transform: "translateX(200%) skewX(-15deg)" },
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
        "aurora-drift": "aurora-drift 15s ease-in-out infinite",
        "spotlight-pulse": "spotlight-pulse 4s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "orb-float": "orb-float 20s ease-in-out infinite",
        "breathe-border": "breathe-border 4s ease-in-out infinite",
        "card-shine": "card-shine 3s ease-in-out infinite",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
      boxShadow: {
        radioactive: "0 0 40px -10px rgba(255, 107, 74, 0.4), 0 0 80px -20px rgba(255, 107, 74, 0.2)",
        "glow-primary": "0 0 40px -10px rgba(255, 107, 74, 0.5)",
        "glow-white": "0 0 30px -10px rgba(255, 255, 255, 0.3)",
        "deep-glass": "0 8px 32px 0 rgba(0,0,0,0.36)",
        "neon-glow": "0 0 30px -5px currentColor",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
