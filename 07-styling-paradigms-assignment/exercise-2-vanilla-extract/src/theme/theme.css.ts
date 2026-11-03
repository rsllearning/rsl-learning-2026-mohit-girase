import { createTheme } from '@vanilla-extract/css';
import { vars } from './contract.css';

/**
 * Porcelain Studio Light Theme
 * Ultra-clean, refined typography, subtle shadows, crisp borders
 */
export const lightTheme = createTheme(vars, {
  color: {
    brand: '#4f46e5',
    brandHover: '#4338ca',
    brandActive: '#3730a3',
    brandLight: '#eef2ff',
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceElevated: '#f1f5f9',
    surfaceMuted: '#e2e8f0',
    border: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    textInverse: '#ffffff',
    focusRing: 'rgba(79, 70, 229, 0.25)',

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
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
    fontSizeXs: '12px',
    fontSizeSm: '14px',
    fontSizeMd: '16px',
    fontSizeLg: '18px',
    fontSizeXl: '24px',
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 12px 24px -4px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
  },
});

/**
 * Aurora Charcoal Dark Theme
 * Deep obsidian graphite surfaces with electric indigo-violet accents
 */
export const darkTheme = createTheme(vars, {
  color: {
    brand: '#6366f1',
    brandHover: '#818cf8',
    brandActive: '#a5b4fc',
    brandLight: 'rgba(99, 102, 241, 0.15)',
    background: '#090b10',
    surface: '#0f131c',
    surfaceElevated: '#171c28',
    surfaceMuted: '#1e2433',
    border: '#222938',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#64748b',
    textInverse: '#ffffff',
    focusRing: 'rgba(99, 102, 241, 0.45)',

    successBg: 'rgba(16, 185, 129, 0.12)',
    successText: '#34d399',
    successBorder: 'rgba(16, 185, 129, 0.25)',

    warningBg: 'rgba(245, 158, 11, 0.12)',
    warningText: '#fbbf24',
    warningBorder: 'rgba(245, 158, 11, 0.25)',

    errorBg: 'rgba(239, 68, 68, 0.12)',
    errorText: '#f87171',
    errorBorder: 'rgba(239, 68, 68, 0.25)',
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
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
    fontSizeXs: '12px',
    fontSizeSm: '14px',
    fontSizeMd: '16px',
    fontSizeLg: '18px',
    fontSizeXl: '24px',
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.6)',
    md: '0 4px 20px -2px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.06)',
    lg: '0 10px 30px -3px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.1)',
  },
});
