import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px"
      }
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
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        apex: {
          background: "hsl(var(--apex-background) / <alpha-value>)",
          surface: "hsl(var(--apex-surface) / <alpha-value>)",
          soft: "hsl(var(--apex-surface-soft) / <alpha-value>)",
          navy: "hsl(var(--apex-navy) / <alpha-value>)",
          blue: "hsl(var(--apex-blue) / <alpha-value>)",
          green: "hsl(var(--apex-green) / <alpha-value>)",
          orange: "hsl(var(--apex-orange) / <alpha-value>)",
          ink: "hsl(var(--apex-ink) / <alpha-value>)",
          muted: "hsl(var(--apex-muted) / <alpha-value>)"
        },
        neon: {
          green: "#002B5E",
          blue: "#1E40AF",
          pink: "#0F172A",
          dark: "#F8FAFC",
          panel: "#FFFFFF",
          card: "#FFFFFF"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        card: "var(--radius-card)",
        control: "var(--radius-control)"
      },
      boxShadow: {
        card: "var(--shadow-card)",
        floating: "var(--shadow-floating)",
        action: "var(--shadow-action)",
        neon: "var(--shadow-action)",
        blue: "var(--shadow-action)"
      },
      transitionTimingFunction: {
        app: "var(--ease-app)"
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)"
      }
    }
  },
  plugins: []
};

export default config;
