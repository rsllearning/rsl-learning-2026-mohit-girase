import { globalStyle } from '@vanilla-extract/css';
import { vars } from './theme/contract.css';

globalStyle('*, *:before, *:after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
});

globalStyle('body', {
  fontFamily: vars.typography.fontFamily,
  backgroundColor: vars.color.background,
  color: vars.color.textPrimary,
  minHeight: '100vh',
  lineHeight: 1.5,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});
