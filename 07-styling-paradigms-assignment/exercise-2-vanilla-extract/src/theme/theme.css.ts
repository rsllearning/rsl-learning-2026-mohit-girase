import { createTheme } from '@vanilla-extract/css';
import { vars } from './contract.css';

/**
 * Light Theme Implementation
 * Values mapped to the typed contract
 */
export const lightTheme = createTheme(vars, {
  color: {
    brand: '#4f46e5',
    brandHover: '#4338ca',
    brandActive: '#3730a3',
    brandLight: '#eef2ff',
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    surfaceMuted: '#f1f5f9',
    border: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    textInverse: '#ffffff',
    focusRing: 'rgba(79, 70, 229, 0.4)',

    successBg: '#ecfdf5',
    successText: '#065f46',
    successBorder: '#a7f3d0',

    warningBg: '#fffbeb',
    warningText: '#92400e',
    warningBorder: '#fde68a',

    errorBg: '#fef2f2',
    errorText: '#991b1b',
    errorBorder: '#fecaca',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  typography: {
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSizeXs: '12px',
    fontSizeSm: '14px',
    fontSizeMd: '16px',
    fontSizeLg: '18px',
    fontSizeXl: '24px',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
});

/**
 * Dark Theme Implementation
 * Exact same structure guaranteed at compile-time by createThemeContract
 */
export const darkTheme = createTheme(vars, {
  color: {
    brand: '#6366f1',
    brandHover: '#818cf8',
    brandActive: '#a5b4fc',
    brandLight: '#1e1b4b',
    background: '#090d16',
    surface: '#111827',
    surfaceElevated: '#1f2937',
    surfaceMuted: '#1e293b',
    border: '#374151',
    textPrimary: '#f9fafb',
    textSecondary: '#e5e7eb',
    textMuted: '#9ca3af',
    textInverse: '#090d16',
    focusRing: 'rgba(99, 102, 241, 0.5)',

    successBg: '#064e3b',
    successText: '#6ee7b7',
    successBorder: '#047857',

    warningBg: '#78350f',
    warningText: '#fde68a',
    warningBorder: '#b45309',

    errorBg: '#7f1d1d',
    errorText: '#fca5a5',
    errorBorder: '#b91c1c',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  typography: {
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSizeXs: '12px',
    fontSizeSm: '14px',
    fontSizeMd: '16px',
    fontSizeLg: '18px',
    fontSizeXl: '24px',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
  },
});

