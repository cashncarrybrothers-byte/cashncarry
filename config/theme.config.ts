/**
 * Brothers Cash & Carry - Theme Configuration
 *
 * Consumer of design tokens from config/theme.tokens.ts.
 * Provides a structured ThemeConfig interface for programmatic use.
 */

import {
  brandColors,
  lightPalette,
  darkPalette,
  semanticColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
} from './theme.tokens';

// ============================================
// THEME CONFIG INTERFACE
// ============================================

export interface ThemeConfig {
  name: string;
  colors: {
    brand: typeof brandColors;
    semantic: typeof semanticColors;
    light: typeof lightPalette;
    dark: typeof darkPalette;
  };
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  transitions: typeof transitions;
}

// ============================================
// BROTHERS THEME (single brand theme)
// ============================================

export const brothersTheme: ThemeConfig = {
  name: 'Brothers Cash & Carry',
  colors: {
    brand: brandColors,
    semantic: semanticColors,
    light: lightPalette,
    dark: darkPalette,
  },
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
};
