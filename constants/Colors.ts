/**
 * BizVibe Design System - Colors
 */

export const colors = {
  // Primary (Coral Orange)
  primary: {
    50: '#FFF5F2',
    100: '#FFE8E1',
    200: '#FFD4C7',
    300: '#FFB49E',
    400: '#FF8A6B',
    500: '#FF6B42', // Main primary
    600: '#E5522B',
    700: '#BF3D1A',
    800: '#993115',
    900: '#7A2A14',
  },
  // Secondary (Deep Blue)
  secondary: {
    50: '#F0F4FF',
    100: '#E0E8FF',
    200: '#C7D4FF',
    300: '#A3B5FF',
    400: '#7A8FFF',
    500: '#5C6CFF', // Main secondary
    600: '#4852E5',
    700: '#363DBF',
    800: '#2A3199',
    900: '#24297A',
  },
  // Gray (Neutral)
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  // Base
  white: '#FFFFFF',
  black: '#000000',
};

// Theme colors for light/dark mode
const tintColorLight = colors.primary[500];
const tintColorDark = colors.primary[400];

export default {
  light: {
    text: colors.gray[900],
    textSecondary: colors.gray[500],
    background: colors.white,
    surface: colors.gray[50],
    tint: tintColorLight,
    tabIconDefault: colors.gray[400],
    tabIconSelected: tintColorLight,
    border: colors.gray[200],
    card: colors.white,
    primary: colors.primary[500],
    secondary: colors.secondary[500],
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
  },
  dark: {
    text: colors.gray[50],
    textSecondary: colors.gray[400],
    background: '#0A0A0A',
    surface: colors.gray[900],
    tint: tintColorDark,
    tabIconDefault: colors.gray[500],
    tabIconSelected: tintColorDark,
    border: colors.gray[800],
    card: colors.gray[900],
    primary: colors.primary[400],
    secondary: colors.secondary[400],
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
  },
};
