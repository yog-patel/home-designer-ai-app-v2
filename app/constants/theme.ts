/**
 * Enhanced Design System for HomeDesignerApp
 * Comprehensive theme with colors, typography, spacing, shadows, and more
 */

import { Platform } from 'react-native';

// Primary brand colors
const primaryRed = '#E31C1C';
const primaryRedLight = '#FF4444';
const primaryRedDark = '#B71515';

const tintColorLight = primaryRed;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#666666',
    textTertiary: '#999999',
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    backgroundTertiary: '#F0F0F0',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#CCCCCC',
    tabIconSelected: '#000000',
    primary: primaryRed,
    primaryLight: primaryRedLight,
    primaryDark: primaryRedDark,
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    border: '#E8E8E8',
    borderLight: '#F0F0F0',
    card: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    textTertiary: '#687076',
    background: '#151718',
    backgroundSecondary: '#1E2022',
    backgroundTertiary: '#2A2D2F',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: primaryRed,
    primaryLight: primaryRedLight,
    primaryDark: primaryRedDark,
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    border: '#2A2D2F',
    borderLight: '#1E2022',
    card: '#1E2022',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

// Gradient presets
export const Gradients = {
  primary: ['#E31C1C', '#FF4444'] as const,
  primaryDark: ['#B71515', '#E31C1C'] as const,
  dark: ['#1A1A1A', '#333333'] as const,
  light: ['#FFFFFF', '#F8F9FA'] as const,
  sunset: ['#FF6B6B', '#FF8E53'] as const,
  ocean: ['#667eea', '#764ba2'] as const,
  forest: ['#11998e', '#38ef7d'] as const,
  hero: ['#1A1A1A', '#2D2D2D'] as const,
};

// Typography system
export const Typography = {
  // Font sizes
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
  },
  // Font weights
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  // Line heights
  lineHeights: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  // Letter spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

// Spacing system (multiples of 4)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

// Border radius system
export const BorderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

// Shadow presets
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  colored: {
    shadowColor: primaryRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
