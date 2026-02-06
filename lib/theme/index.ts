/**
 * Theme Module - Barrel Export
 *
 * Central import point for the Brothers Cash & Carry theme system.
 *
 * Usage:
 *   import { tokens, brandColors, typography } from '@/lib/theme';
 *   import { getContrastRatio, generateCSSVariables } from '@/lib/theme';
 */

// Design tokens (single source of truth)
export {
  tokens,
  brandColors,
  semanticColors,
  lightPalette,
  darkPalette,
  typography,
  textStyles,
  spacing,
  shadows,
  borderRadius,
  transitions,
  zIndex,
  type ThemeTokens,
} from '@/config/theme.tokens';

// Theme config (structured consumer of tokens)
export { brothersTheme, type ThemeConfig } from '@/config/theme.config';

// Utilities
export {
  isValidHexColor,
  hexToRGB,
  getContrastRatio,
  meetsWCAGAA,
  meetsWCAGAAA,
  generateCSSVariables,
  validateTokensMatchCSS,
} from './theme-utils';

// ============================================
// TYPED TOKEN ACCESSOR
// ============================================

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}.${NestedKeyOf<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

type NestedValueOf<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? NestedValueOf<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

import { tokens as _tokens } from '@/config/theme.tokens';

/**
 * Typed token accessor for programmatic use (e.g., Framer Motion, chart colors).
 *
 * @example
 *   getToken('brand.red')        // '358 85% 56%'
 *   getToken('transitions.fast') // '150ms cubic-bezier(0.4, 0, 0.2, 1)'
 */
export function getToken<P extends NestedKeyOf<typeof _tokens>>(
  path: P
): NestedValueOf<typeof _tokens, P> {
  const keys = path.split('.');
  let current: unknown = _tokens;
  for (const key of keys) {
    current = (current as Record<string, unknown>)[key];
  }
  return current as NestedValueOf<typeof _tokens, P>;
}
