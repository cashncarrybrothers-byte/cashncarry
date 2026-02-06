/**
 * Brothers Cash & Carry - Design Tokens
 * ======================================
 * SINGLE SOURCE OF TRUTH for all design values.
 *
 * These tokens feed into:
 *   1. app/globals.css :root (CSS variables for Tailwind)
 *   2. config/theme.config.ts (ThemeConfig consumer)
 *   3. Programmatic access via lib/theme/index.ts
 *
 * Format: HSL values WITHOUT the hsl() wrapper, matching Tailwind/shadcn convention.
 * Hex values in comments are for quick reference only.
 */

// ============================================
// BRAND COLORS
// ============================================

export const brandColors = {
  /** Signature red - #ed3338 */
  red: '358 85% 56%',
  /** Dark red for footer/header - #c22a2e */
  redDark: '358 85% 45%',
  /** Light red tint for backgrounds */
  redLight: '358 85% 95%',
  /** Deep red accent - #c22a2e */
  deepRed: '358 70% 48%',
} as const;

// ============================================
// SEMANTIC COLORS
// ============================================

export const semanticColors = {
  success: {
    light: '142 76% 36%',       // #22c55e range
    dark: '142 76% 46%',
  },
  warning: {
    light: '38 92% 50%',        // #f59e0b
    dark: '38 92% 50%',
  },
  destructive: {
    light: '0 84% 60%',         // #ef4444
    dark: '0 62% 30%',
  },
  info: {
    light: '217 91% 60%',       // #3b82f6
    dark: '217 91% 60%',
  },
} as const;

// ============================================
// LIGHT MODE PALETTE
// ============================================

export const lightPalette = {
  /** Warm light gray - #f6f8f9 */
  background: '210 20% 97%',
  /** Deep charcoal - #14181f */
  foreground: '220 25% 10%',

  /** Pure white */
  card: '0 0% 100%',
  cardForeground: '220 25% 10%',

  /** White */
  popover: '0 0% 100%',
  popoverForeground: '220 25% 10%',

  /** Brand red */
  primary: brandColors.red,
  primaryForeground: '0 0% 100%',
  primaryDark: brandColors.redDark,
  primaryLight: brandColors.redLight,

  /** Deep red accent */
  secondary: brandColors.deepRed,
  secondaryForeground: '0 0% 100%',

  /** Neutral gray - #f4f5f7 */
  muted: '220 14% 96%',
  /** #6b7280 */
  mutedForeground: '220 10% 46%',

  /** Light gray accent */
  accent: '220 14% 96%',
  accentForeground: '220 25% 10%',

  destructive: semanticColors.destructive.light,
  destructiveForeground: '0 0% 100%',

  success: semanticColors.success.light,
  successForeground: '0 0% 100%',

  /** #e5e7eb */
  border: '220 13% 91%',
  input: '220 13% 91%',
  ring: brandColors.red,
} as const;

// ============================================
// DARK MODE PALETTE
// ============================================

export const darkPalette = {
  /** #0e1116 */
  background: '220 25% 6%',
  foreground: '220 14% 96%',

  card: '220 25% 10%',
  cardForeground: '220 14% 96%',

  popover: '220 25% 10%',
  popoverForeground: '220 14% 96%',

  primary: brandColors.red,
  primaryForeground: '0 0% 100%',
  primaryDark: '358 85% 65%',
  primaryLight: '358 85% 15%',

  secondary: brandColors.deepRed,
  secondaryForeground: '0 0% 100%',

  muted: '220 20% 15%',
  mutedForeground: '220 10% 60%',

  accent: '220 20% 15%',
  accentForeground: '220 14% 96%',

  destructive: semanticColors.destructive.dark,
  destructiveForeground: '0 0% 100%',

  success: semanticColors.success.dark,
  successForeground: '0 0% 100%',

  border: '220 20% 18%',
  input: '220 20% 18%',
  ring: brandColors.red,
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  fontFamily: {
    /** Work Sans via next/font */
    sans: 'var(--font-sans)',
    heading: 'var(--font-heading)',
    display: 'var(--font-sans)',
  },
  fontSize: {
    /** 11px - overline labels */
    overline: '0.6875rem',
    /** 12px */
    xs: '0.75rem',
    /** 13px - captions */
    caption: '0.8125rem',
    /** 14px */
    sm: '0.875rem',
    /** 16px - base */
    base: '1rem',
    /** 18px */
    lg: '1.125rem',
    /** Responsive h3 */
    h3: 'clamp(1.125rem, 2vw, 1.375rem)',
    /** Responsive h2 */
    h2: 'clamp(1.375rem, 2.5vw, 1.75rem)',
    /** Responsive h1 */
    h1: 'clamp(1.75rem, 3vw, 2.25rem)',
    /** Responsive display-lg */
    displayLg: 'clamp(2rem, 4vw, 3rem)',
    /** Responsive display-xl */
    displayXl: 'clamp(2.5rem, 5vw, 4rem)',
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeight: {
    none: '1',
    tight: '1.1',
    display: '1.15',
    snug: '1.2',
    heading: '1.25',
    headingSm: '1.3',
    subheading: '1.35',
    normal: '1.4',
    relaxed: '1.5',
    loose: '1.6',
  },
  letterSpacing: {
    tighter: '-0.02em',
    tight: '-0.015em',
    slight: '-0.01em',
    subtleNeg: '-0.005em',
    normal: '0',
    wide: '0.01em',
    wider: '0.08em',
  },
} as const;

// ============================================
// TEXT STYLES (Composite Typography)
// ============================================

export const textStyles = {
  displayXl: {
    fontSize: typography.fontSize.displayXl,
    fontWeight: typography.fontWeight.black,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tighter,
  },
  displayLg: {
    fontSize: typography.fontSize.displayLg,
    fontWeight: typography.fontWeight.extrabold,
    lineHeight: typography.lineHeight.display,
    letterSpacing: typography.letterSpacing.tight,
  },
  h1: {
    fontSize: typography.fontSize.h1,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.snug,
    letterSpacing: typography.letterSpacing.slight,
  },
  h2: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.heading,
    letterSpacing: typography.letterSpacing.subtleNeg,
  },
  h3: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.headingSm,
  },
  h4: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.subheading,
  },
  h5: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
  },
  h6: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
  },
  bodyLg: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.loose,
  },
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.loose,
  },
  bodySm: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.relaxed,
  },
  caption: {
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.relaxed,
  },
  captionSm: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.relaxed,
  },
  overline: {
    fontSize: typography.fontSize.overline,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.relaxed,
    letterSpacing: typography.letterSpacing.wider,
  },
  label: {
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
  },
} as const;

// ============================================
// SPACING
// ============================================

export const spacing = {
  container: {
    maxWidth: '80rem', // 1280px (max-w-7xl)
  },
  containerPadding: {
    mobile: '1rem',    // px-4
    tablet: '1.5rem',  // px-6
    desktop: '2rem',   // px-8
  },
  sectionPadding: {
    mobile: '2rem',    // py-8
    tablet: '3rem',    // py-12
    desktop: '5rem',   // py-20
  },
} as const;

// ============================================
// SHADOWS
// ============================================

export const shadows = {
  light: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
    soft: '0 4px 20px -2px rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
    hover: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.08)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
  },
  dark: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.2)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
    soft: '0 4px 20px -2px rgb(0 0 0 / 0.3)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
    hover: '0 10px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
  },
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const borderRadius = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px  (--radius)
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ============================================
// TRANSITIONS
// ============================================

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ============================================
// Z-INDEX SCALE
// ============================================

export const zIndex = {
  hide: -1,
  base: 0,
  raised: 10,
  dropdown: 20,
  sticky: 30,
  header: 40,
  overlay: 50,
  modal: 60,
  popover: 70,
  toast: 80,
  tooltip: 90,
  max: 9999,
} as const;

// ============================================
// COMBINED TOKENS EXPORT
// ============================================

export const tokens = {
  brand: brandColors,
  semantic: semanticColors,
  light: lightPalette,
  dark: darkPalette,
  typography,
  textStyles,
  spacing,
  shadows,
  borderRadius,
  transitions,
  zIndex,
} as const;

export type ThemeTokens = typeof tokens;
