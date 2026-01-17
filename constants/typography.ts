/**
 * BizVibe Typography System
 * Font: Inter (system default on iOS/Android)
 */

import { TextStyle } from 'react-native';

export const fontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

export const typography = {
  display: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: fontWeights.bold,
  },
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: fontWeights.bold,
  },
  h2: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: fontWeights.semibold,
  },
  h3: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: fontWeights.semibold,
  },
  h4: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: fontWeights.medium,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: fontWeights.regular,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: fontWeights.regular,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeights.regular,
  },
  overline: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: fontWeights.medium,
    textTransform: 'uppercase' as TextStyle['textTransform'],
    letterSpacing: 1,
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: fontWeights.semibold,
  },
  buttonSmall: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: fontWeights.semibold,
  },
} as const;

export type TypographyVariant = keyof typeof typography;
