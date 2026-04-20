// ─── Design Tokens — Ales B2B Hardware Platform ──────────────────────────────
// Single source of truth for all visual and motion primitives.
// Easing curves are defined HERE only — never hardcode them elsewhere.

export const designTokens = {
  // ── Colors ──────────────────────────────────────────────────────────────────
  colors: {
    background: "#0A0A0F",
    surface: "#12121A",
    surfaceElevated: "#1A1A25",
    border: "#2A2A35",
    borderSubtle: "#1E1E2A",

    text: {
      primary: "#F0F0F5",
      secondary: "#8A8A95",
      tertiary: "#5A5A65",
    },

    accent: {
      // Unique electric indigo-cyan — distinct from generic Tailwind blue
      primary: "#5B6EF5",
      primaryHover: "#6F80FF",
      primaryMuted: "rgba(91, 110, 245, 0.15)",
      // Warm amber-gold for CTAs
      secondary: "#F5A623",
      secondaryHover: "#FFB83F",
      secondaryMuted: "rgba(245, 166, 35, 0.15)",
      // Branded gradient
      gradient:
        "linear-gradient(135deg, #5B6EF5 0%, #8B5CF6 50%, #06B6D4 100%)",
      gradientSubtle:
        "linear-gradient(135deg, rgba(91,110,245,0.12) 0%, rgba(139,92,246,0.08) 100%)",
    },

    // Semantic / state
    success: "#22C55E",
    warning: "#F5A623",
    error: "#EF4444",
    info: "#06B6D4",
  },

  // ── Typography ───────────────────────────────────────────────────────────────
  typography: {
    fontFamily: {
      heading: "'Inter', 'Inter Fallback', system-ui, sans-serif",
      body: "'Inter', 'Inter Fallback', system-ui, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    },

    fontSize: {
      xs: { size: "0.75rem", lineHeight: "1rem" },
      sm: { size: "0.875rem", lineHeight: "1.25rem" },
      base: { size: "1rem", lineHeight: "1.5rem" },
      lg: { size: "1.125rem", lineHeight: "1.75rem" },
      xl: { size: "1.25rem", lineHeight: "1.75rem" },
      "2xl": { size: "1.5rem", lineHeight: "2rem" },
      "3xl": { size: "1.875rem", lineHeight: "2.25rem" },
      "4xl": { size: "2.25rem", lineHeight: "2.5rem" },
      "5xl": { size: "3rem", lineHeight: "1" },
      "6xl": { size: "3.75rem", lineHeight: "1" },
      "7xl": { size: "4.5rem", lineHeight: "1" },
    },

    fontWeight: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },

    letterSpacing: {
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },

  // ── Spacing (4px base — mirrors Tailwind defaults) ───────────────────────────
  spacing: {
    px: "1px",
    0: "0px",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    11: "2.75rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem",
  },

  // ── Border Radius ────────────────────────────────────────────────────────────
  borderRadius: {
    none: "0px",
    sm: "0.25rem",
    base: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    full: "9999px",
  },

  // ── Shadows ──────────────────────────────────────────────────────────────────
  shadow: {
    sm: "0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)",
    base: "0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)",
    md: "0 10px 15px rgba(0, 0, 0, 0.4), 0 4px 6px rgba(0, 0, 0, 0.3)",
    lg: "0 20px 25px rgba(0, 0, 0, 0.4), 0 10px 10px rgba(0, 0, 0, 0.2)",
    xl: "0 25px 50px rgba(0, 0, 0, 0.5)",
    glow: "0 0 20px rgba(91, 110, 245, 0.3), 0 0 60px rgba(91, 110, 245, 0.1)",
    glowAmber:
      "0 0 20px rgba(245, 166, 35, 0.3), 0 0 60px rgba(245, 166, 35, 0.1)",
  },

  // ── Animation — SINGLE SOURCE OF TRUTH ──────────────────────────────────────
  animation: {
    // Easing — as [x1, y1, x2, y2] arrays (for GSAP) and CSS strings (for CSS/Framer)
    ease: {
      // Smooth, premium — main entrance ease
      cinematic: {
        array: [0.16, 1, 0.3, 1] as [number, number, number, number],
        css: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      // Bouncy — for interactive elements
      spring: {
        array: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
        css: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      // Standard material — general UI
      smooth: {
        array: [0.4, 0, 0.2, 1] as [number, number, number, number],
        css: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      // Quick start — for emphasis
      sharp: {
        array: [0.4, 0, 0.6, 1] as [number, number, number, number],
        css: "cubic-bezier(0.4, 0, 0.6, 1)",
      },
      // For entrances — decelerates into rest
      decelerate: {
        array: [0, 0, 0.2, 1] as [number, number, number, number],
        css: "cubic-bezier(0, 0, 0.2, 1)",
      },
      // For exits — accelerates out of rest
      accelerate: {
        array: [0.4, 0, 1, 1] as [number, number, number, number],
        css: "cubic-bezier(0.4, 0, 1, 1)",
      },
    },

    // Duration in milliseconds
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
      slower: 800,
      cinematic: 1200,
    },

    // Duration in seconds (for GSAP which prefers seconds)
    durationSeconds: {
      fast: 0.15,
      normal: 0.3,
      slow: 0.5,
      slower: 0.8,
      cinematic: 1.2,
    },
  },

  // ── Breakpoints (matching Tailwind v4 defaults) ──────────────────────────────
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // ── Z-Index scale ────────────────────────────────────────────────────────────
  zIndex: {
    base: 0,
    raised: 10,
    dropdown: 100,
    sticky: 200,
    overlay: 300,
    modal: 400,
    popover: 500,
    toast: 600,
    tooltip: 700,
  },
} as const;

// ─── Helper: easing CSS string ───────────────────────────────────────────────
export type EaseName = keyof typeof designTokens.animation.ease;

export function getEasingCSS(name: EaseName): string {
  return designTokens.animation.ease[name].css;
}

// ─── Helper: easing array for GSAP ───────────────────────────────────────────
export function getEasingArray(
  name: EaseName,
): [number, number, number, number] {
  return designTokens.animation.ease[name].array;
}

// ─── Helper: duration in ms ──────────────────────────────────────────────────
export type DurationName = keyof typeof designTokens.animation.duration;

export function getDurationMs(name: DurationName): number {
  return designTokens.animation.duration[name];
}

// ─── Helper: duration in seconds (for GSAP) ──────────────────────────────────
export function getDurationSeconds(name: DurationName): number {
  return designTokens.animation.durationSeconds[name];
}

// ─── Re-export for convenience ────────────────────────────────────────────────
export const { colors, typography, spacing, animation, breakpoints } =
  designTokens;
