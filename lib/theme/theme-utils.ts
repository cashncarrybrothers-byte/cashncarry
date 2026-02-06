/**
 * Theme Utilities
 *
 * Helper functions for color validation, accessibility checks,
 * and token-to-CSS-variable generation.
 */

import {
  lightPalette,
  darkPalette,
  shadows,
  borderRadius,
  transitions,
} from '@/config/theme.tokens';

// ============================================
// COLOR UTILITIES
// ============================================

/**
 * Validate hex color format
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Convert hex to RGB components
 */
export function hexToRGB(hex: string): { r: number; g: number; b: number } | null {
  if (!isValidHexColor(hex)) return null;

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance (WCAG 2.0)
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const srgb = c / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two hex colors (WCAG)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRGB(color1);
  const rgb2 = hexToRGB(color2);
  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if color combination meets WCAG AA (4.5:1 for normal text)
 */
export function meetsWCAGAA(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 4.5;
}

/**
 * Check if color combination meets WCAG AAA (7:1 for normal text)
 */
export function meetsWCAGAAA(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 7;
}

// ============================================
// TOKEN → CSS VARIABLE GENERATION
// ============================================

type PaletteRecord = Record<string, string>;

/**
 * Generate CSS variable declarations from token palettes.
 * Returns a map of `--variable-name` → `value` for injection into :root or .dark.
 */
export function generateCSSVariables(mode: 'light' | 'dark'): Record<string, string> {
  const palette: PaletteRecord = mode === 'light' ? { ...lightPalette } : { ...darkPalette };
  const shadowSet = mode === 'light' ? shadows.light : shadows.dark;

  const vars: Record<string, string> = {};

  // Color palette → CSS variables
  const colorKeyMap: Record<string, string> = {
    background: 'background',
    foreground: 'foreground',
    card: 'card',
    cardForeground: 'card-foreground',
    popover: 'popover',
    popoverForeground: 'popover-foreground',
    primary: 'primary',
    primaryForeground: 'primary-foreground',
    primaryDark: 'primary-dark',
    primaryLight: 'primary-light',
    secondary: 'secondary',
    secondaryForeground: 'secondary-foreground',
    muted: 'muted',
    mutedForeground: 'muted-foreground',
    accent: 'accent',
    accentForeground: 'accent-foreground',
    destructive: 'destructive',
    destructiveForeground: 'destructive-foreground',
    success: 'success',
    successForeground: 'success-foreground',
    border: 'border',
    input: 'input',
    ring: 'ring',
  };

  for (const [tokenKey, cssKey] of Object.entries(colorKeyMap)) {
    if (palette[tokenKey]) {
      vars[`--${cssKey}`] = palette[tokenKey];
    }
  }

  // Shadows
  for (const [key, value] of Object.entries(shadowSet)) {
    vars[`--shadow-${key}`] = value;
  }

  // Only include non-color tokens for light mode (they don't change)
  if (mode === 'light') {
    // Border radius
    vars['--radius'] = borderRadius.md;
    vars['--radius-sm'] = borderRadius.sm;
    vars['--radius-lg'] = borderRadius.lg;
    vars['--radius-xl'] = borderRadius.xl;
    vars['--radius-2xl'] = borderRadius['2xl'];
    vars['--radius-full'] = borderRadius.full;

    // Transitions
    vars['--transition-fast'] = transitions.fast;
    vars['--transition-base'] = transitions.base;
    vars['--transition-slow'] = transitions.slow;
    vars['--transition-slower'] = transitions.slower;
  }

  return vars;
}

/**
 * Development helper: compare token values against globals.css.
 * Call this in a dev-only useEffect to spot drift.
 */
export function validateTokensMatchCSS(): { mismatches: string[] } {
  if (typeof document === 'undefined') return { mismatches: [] };

  const mismatches: string[] = [];
  const computed = getComputedStyle(document.documentElement);
  const expectedVars = generateCSSVariables('light');

  for (const [varName, expectedValue] of Object.entries(expectedVars)) {
    const actual = computed.getPropertyValue(varName).trim();
    if (actual && actual !== expectedValue) {
      mismatches.push(
        `${varName}: expected "${expectedValue}", got "${actual}"`
      );
    }
  }

  return { mismatches };
}
