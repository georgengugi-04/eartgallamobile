// Single source of truth for the E-ArtGalla look. Screens and components import
// from here; no hex values or magic numbers in feature code.

export const colors = {
  bg: "#080808",
  surface: "#111111",
  elevated: "#181818",
  overlay: "rgba(8,8,8,0.72)",

  text: "#F5F2EA",
  textSecondary: "#A7A29A",
  // Decorative / disabled only: ~3:1 on bg, below AA for small text.
  muted: "#68645E",

  border: "rgba(245,242,234,0.08)",
  borderStrong: "rgba(245,242,234,0.18)",

  // Warm gallery gold. ONE token, so swapping in the website's exact brand
  // accent is a one-line change.
  accent: "#C9A25C",
  onAccent: "#080808",

  // Subtle Kenyan-flag references (used only in the brand mark).
  kenyaRed: "#B3262D",
  kenyaGreen: "#1E6B45",

  success: "#6FBF8B",
  warning: "#D9A441",
  danger: "#E5645A",
} as const;

export const fonts = {
  display: "PlayfairDisplay_500Medium",
  displayRegular: "PlayfairDisplay_400Regular",
  displaySemibold: "PlayfairDisplay_600SemiBold",
  displayItalic: "PlayfairDisplay_400Regular_Italic",
  ui: "Inter_400Regular",
  uiMedium: "Inter_500Medium",
  uiSemibold: "Inter_600SemiBold",
  uiBold: "Inter_700Bold",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  screen: 20, // horizontal screen padding
} as const;

// Editorial: small, restrained radii. Nothing bubbly.
export const radius = { sm: 4, md: 8, lg: 12, full: 999 } as const;

export const layout = {
  minTouch: 44,
  buttonHeight: 52,
  tabBarHeight: 60,
} as const;

export const type = {
  display: { fontFamily: fonts.display, fontSize: 40, lineHeight: 46, letterSpacing: -0.6 },
  title1: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36, letterSpacing: -0.3 },
  title2: { fontFamily: fonts.display, fontSize: 24, lineHeight: 30, letterSpacing: -0.2 },
  title3: { fontFamily: fonts.display, fontSize: 19, lineHeight: 25 },
  cardTitle: { fontFamily: fonts.display, fontSize: 16, lineHeight: 21 },
  headline: { fontFamily: fonts.uiSemibold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.ui, fontSize: 16, lineHeight: 25 },
  bodySmall: { fontFamily: fonts.ui, fontSize: 14, lineHeight: 21 },
  caption: { fontFamily: fonts.ui, fontSize: 12, lineHeight: 17 },
  label: {
    fontFamily: fonts.uiSemibold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  button: { fontFamily: fonts.uiSemibold, fontSize: 15, lineHeight: 20, letterSpacing: 0.3 },
  quote: { fontFamily: fonts.displayItalic, fontSize: 20, lineHeight: 30 },
} as const;

export type TypeVariant = keyof typeof type;
export type TextColor = "primary" | "secondary" | "muted" | "accent" | "danger" | "onAccent";

export const textColors: Record<TextColor, string> = {
  primary: colors.text,
  secondary: colors.textSecondary,
  muted: colors.muted,
  accent: colors.accent,
  danger: colors.danger,
  onAccent: colors.onAccent,
};
