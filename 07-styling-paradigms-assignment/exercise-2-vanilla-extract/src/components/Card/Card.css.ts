import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../theme/contract.css';

/**
 * Base Card Container Style
 * Features base styling, border-radius, background, consistent spacing, and responsive padding.
 */
export const baseCard = style({
  backgroundColor: vars.color.surface,
  borderRadius: 16, // unitless number -> compiles to 16px
  border: `1px solid ${vars.color.border}`,
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',

  // Consistent theme spacing with responsive padding (Requirement 10)
  padding: vars.space.md,
  '@media': {
    'screen and (min-width: 768px)': {
      padding: vars.space.lg,
    },
  },
});

/**
 * Card Elevation / Visual Variants (Requirement 11 - Style Composition)
 */
export const cardVariants = styleVariants({
  elevated: {
    boxShadow: vars.shadows.md,
    ':hover': {
      boxShadow: vars.shadows.lg,
      transform: 'translateY(-2px)',
    },
  },
  flat: {
    boxShadow: 'none',
    backgroundColor: vars.color.surfaceMuted,
  },
  outlined: {
    boxShadow: vars.shadows.sm,
    border: `2px solid ${vars.color.border}`,
  },
});

export const cardHeader = style({
  marginBottom: vars.space.md,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
});

export const cardTitle = style({
  margin: 0,
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSizeLg,
  fontWeight: 700,
  color: vars.color.textPrimary,
  letterSpacing: '-0.02em',
});

export const cardSubtitle = style({
  margin: '4px 0 0 0',
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textMuted,
});

export const cardBody = style({
  flex: '1 1 auto',
  color: vars.color.textSecondary,
  fontSize: vars.typography.fontSizeSm,
  lineHeight: 1.6,
});

export const cardFooter = style({
  marginTop: vars.space.md,
  paddingTop: vars.space.md,
  borderTop: `1px solid ${vars.color.border}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: vars.space.sm,
});
