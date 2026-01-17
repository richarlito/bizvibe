/**
 * BizVibe Spacing System
 * Base unit: 4px
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

// Common component sizes
export const componentSizes = {
  buttonHeight: {
    sm: 32,
    md: 44,
    lg: 52,
  },
  inputHeight: 48,
  avatarSize: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  },
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
  },
  touchTarget: 44, // Minimum touch target size for accessibility
} as const;

// Screen padding
export const screenPadding = {
  horizontal: spacing.md,
  vertical: spacing.md,
} as const;
