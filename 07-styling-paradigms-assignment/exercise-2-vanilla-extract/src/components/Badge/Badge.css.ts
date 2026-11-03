import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../theme/contract.css';

/**
 * Base Badge Style
 */
export const baseBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSizeXs,
  fontWeight: 600,
  borderRadius: 9999, // unitless number -> compiles to 9999px
  padding: '3px 10px',
  borderWidth: 1,
  borderStyle: 'solid',
  lineHeight: 1.25,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
});

/**
 * Badge Variants (success, warning, error)
 * Uses shared design tokens strictly defined in the theme contract.
 */
export const badgeVariants = styleVariants({
  success: {
    backgroundColor: vars.color.successBg,
    color: vars.color.successText,
    borderColor: vars.color.successBorder,
  },
  warning: {
    backgroundColor: vars.color.warningBg,
    color: vars.color.warningText,
    borderColor: vars.color.warningBorder,
  },
  error: {
    backgroundColor: vars.color.errorBg,
    color: vars.color.errorText,
    borderColor: vars.color.errorBorder,
  },
  brand: {
    backgroundColor: vars.color.brandLight,
    color: vars.color.brand,
    borderColor: vars.color.brand,
  },
});
