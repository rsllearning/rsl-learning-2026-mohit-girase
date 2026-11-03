import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../theme/contract.css';

/**
 * Base button style definition
 * Contains core structural properties, resets, transitions, and focus rings.
 * Numeric values without units (e.g., borderRadius: 8) are automatically compiled to px.
 */
export const baseButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  fontFamily: vars.typography.fontFamily,
  fontWeight: 600,
  borderRadius: 8, // unitless number -> compiles to 8px
  border: '1px solid transparent',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'all 0.15s ease-in-out',
  outline: 'none',

  // Interactive States
  ':focus-visible': {
    boxShadow: `0 0 0 3px ${vars.color.focusRing}`,
  },
  ':active': {
    transform: 'scale(0.98)',
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none',
    boxShadow: 'none',
  },
});

/**
 * Button Variants (Primary, Secondary, Danger)
 * Defined via type-safe styleVariants() mapping to theme contract values
 */
export const buttonVariants = styleVariants({
  primary: {
    backgroundColor: vars.color.brand,
    color: vars.color.textInverse,
    borderColor: vars.color.brand,
    ':hover': {
      backgroundColor: vars.color.brandHover,
      borderColor: vars.color.brandHover,
    },
    ':active': {
      backgroundColor: vars.color.brandActive,
    },
  },
  secondary: {
    backgroundColor: vars.color.surfaceMuted,
    color: vars.color.textPrimary,
    borderColor: vars.color.border,
    ':hover': {
      backgroundColor: vars.color.border,
      color: vars.color.textPrimary,
    },
  },
  danger: {
    backgroundColor: vars.color.errorBg,
    color: vars.color.errorText,
    borderColor: vars.color.errorBorder,
    ':hover': {
      backgroundColor: vars.color.errorText,
      color: '#ffffff',
      borderColor: vars.color.errorText,
    },
  },
});

/**
 * Button Sizes (Small, Large, Medium)
 * Combines padding and font-size tokens
 */
export const buttonSizes = styleVariants({
  sm: {
    padding: '6px 12px',
    fontSize: vars.typography.fontSizeXs,
    borderRadius: 6,
  },
  md: {
    padding: '10px 18px',
    fontSize: vars.typography.fontSizeSm,
    borderRadius: 8,
  },
  lg: {
    padding: '14px 24px',
    fontSize: vars.typography.fontSizeMd,
    borderRadius: 10,
  },
});

/**
 * Full Width modifier
 */
export const fullWidthStyle = style({
  width: '100%',
});

