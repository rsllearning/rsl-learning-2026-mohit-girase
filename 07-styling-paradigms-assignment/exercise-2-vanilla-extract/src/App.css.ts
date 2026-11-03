import { style } from '@vanilla-extract/css';
import { vars } from './theme/contract.css';

export const appContainer = style({
  minHeight: '100vh',
  backgroundColor: vars.color.background,
  color: vars.color.textPrimary,
  padding: '24px 16px',
  transition: 'background-color 0.25s ease, color 0.25s ease',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '48px 32px',
    },
  },
});

export const contentWrapper = style({
  maxWidth: 1120,
  margin: '0 auto',
});

export const showcaseHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  paddingBottom: vars.space.lg,
  marginBottom: vars.space.xl,
  borderBottom: `1px solid ${vars.color.border}`,
  '@media': {
    'screen and (min-width: 768px)': {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
});

export const brandBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontSize: vars.typography.fontSizeXs,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.brand,
  marginBottom: 6,
});

export const brandDot = style({
  width: 8,
  height: 8,
  borderRadius: 9999,
  backgroundColor: vars.color.brand,
});

export const title = style({
  fontSize: vars.typography.fontSizeXl,
  fontWeight: 800,
  letterSpacing: '-0.03em',
  color: vars.color.textPrimary,
  margin: 0,
});

export const subtitle = style({
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textMuted,
  marginTop: 4,
});

export const section = style({
  marginBottom: '40px',
});

export const sectionHeader = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  marginBottom: vars.space.md,
});

export const sectionTitle = style({
  fontSize: vars.typography.fontSizeLg,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: vars.color.textPrimary,
  margin: 0,
});

export const sectionDescription = style({
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textMuted,
  marginTop: 4,
});

export const previewBox = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 14,
  padding: vars.space.lg,
  boxShadow: vars.shadows.sm,
  transition: 'background-color 0.25s ease, border-color 0.25s ease',
});

export const toolbar = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  paddingBottom: vars.space.md,
  marginBottom: vars.space.lg,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const toolbarGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
});

export const controlLabel = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textSecondary,
  cursor: 'pointer',
  userSelect: 'none',
});

export const buttonRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.md,
  alignItems: 'center',
});

export const cardGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: vars.space.lg,
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    'screen and (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
});

export const swatchGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: vars.space.md,
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  },
});

export const swatchCard = style({
  padding: vars.space.md,
  borderRadius: 10,
  backgroundColor: vars.color.surfaceElevated,
  border: `1px solid ${vars.color.border}`,
});

export const swatchColorPill = style({
  height: 48,
  borderRadius: 6,
  marginBottom: vars.space.sm,
  border: `1px solid ${vars.color.border}`,
});

export const swatchName = style({
  fontSize: vars.typography.fontSizeSm,
  fontWeight: 600,
  color: vars.color.textPrimary,
  display: 'block',
});

export const swatchMeta = style({
  fontSize: vars.typography.fontSizeXs,
  color: vars.color.textMuted,
  fontFamily: 'monospace',
  marginTop: 2,
  display: 'block',
});

export const tokenScaleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 8,
});

export const tokenScaleLabel = style({
  width: 60,
  fontSize: vars.typography.fontSizeXs,
  fontFamily: 'monospace',
  color: vars.color.textMuted,
});

export const tokenScaleBar = style({
  height: 8,
  borderRadius: 4,
  backgroundColor: vars.color.brand,
});
