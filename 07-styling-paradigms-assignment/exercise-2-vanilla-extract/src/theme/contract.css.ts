import { createThemeContract } from '@vanilla-extract/css';

/**
 * Type-Safe Theme Contract (Schema)
 * Enforces that any theme (Light, Dark, High-Contrast) must implement
 * the exact same set of design token keys with 100% compile-time validation.
 */
export const vars = createThemeContract({
  color: {
    brand: null,
    brandHover: null,
    brandActive: null,
    brandLight: null,
    background: null,
    surface: null,
    surfaceElevated: null,
    surfaceMuted: null,
    border: null,
    textPrimary: null,
    textSecondary: null,
    textMuted: null,
    textInverse: null,
    focusRing: null,

    // Status colors
    successBg: null,
    successText: null,
    successBorder: null,
    warningBg: null,
    warningText: null,
    warningBorder: null,
    errorBg: null,
    errorText: null,
    errorBorder: null,
  },
  space: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
  },
  typography: {
    fontFamily: null,
    fontSizeXs: null,
    fontSizeSm: null,
    fontSizeMd: null,
    fontSizeLg: null,
    fontSizeXl: null,
  },
  radii: {
    sm: null,
    md: null,
    lg: null,
    full: null,
  },
  shadows: {
    sm: null,
    md: null,
    lg: null,
  },
});

