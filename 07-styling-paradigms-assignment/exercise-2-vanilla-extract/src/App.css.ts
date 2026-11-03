import { style } from '@vanilla-extract/css';
import { vars } from './theme/contract.css';

export const appContainer = style({
  minHeight: '100vh',
  backgroundColor: vars.color.background,
  color: vars.color.textPrimary,
  padding: '24px 16px',
  transition: 'background-color 0.2s ease, color 0.2s ease',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '40px 32px',
    },
  },
});

export const contentWrapper = style({
  maxWidth: 1100,
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
  marginBottom: vars.space.xl,
});

export const sectionTitle = style({
  fontSize: vars.typography.fontSizeLg,
  fontWeight: 700,
  color: vars.color.textPrimary,
  marginBottom: vars.space.xs,
});

export const sectionDescription = style({
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textMuted,
  marginBottom: vars.space.md,
});

export const previewBox = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 12,
  padding: vars.space.lg,
  boxShadow: vars.shadows.sm,
});

export const buttonRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.md,
  alignItems: 'center',
  marginBottom: vars.space.md,
});

export const gridLayout = style({
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

export const tokenTable = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: vars.typography.fontSizeSm,
});

export const tableCell = style({
  padding: '8px 12px',
  borderBottom: `1px solid ${vars.color.border}`,
  textAlign: 'left',
});

export const tableHeaderCell = style({
  padding: '8px 12px',
  borderBottom: `2px solid ${vars.color.border}`,
  textAlign: 'left',
  fontWeight: 600,
  color: vars.color.textPrimary,
});

