// Counvo Color Palette - Quick Reference
// Professional Lawyer App Theme
// NOTE: USE SOLID COLORS ONLY - NO GRADIENTS IN THE APP

export const colors = {
  // Primary - Amber/Gold (Trust, Excellence, Premium)
  primary: {
    main: '#F59E0B',
    light: '#FCD34D',
    dark: '#D97706',
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Secondary - Navy Blue (Authority, Professionalism)
  secondary: {
    main: '#1E3A8A',
    light: '#3B82F6',
    dark: '#1E40AF',
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Tertiary - Burgundy (Tradition, Sophistication)
  tertiary: {
    main: '#991B1B',
    light: '#DC2626',
    dark: '#7F1D1D',
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Success - Professional Green
  success: {
    main: '#059669',
    light: '#10B981',
    dark: '#047857',
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  // Error - Red
  error: {
    main: '#DC2626',
    light: '#EF4444',
    dark: '#B91C1C',
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Neutral - Grays
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Background
  background: {
    default: '#F9FAFB',
    paper: '#FFFFFF',
    dark: '#1F2937',
  },

  // Text
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
    white: '#FFFFFF',
  },

  // Divider
  divider: '#E5E7EB',
};

// Gradient Presets - DEPRECATED: DO NOT USE GRADIENTS IN THIS APP
// Kept for reference only
export const gradients = {
  // NOTE: These should NOT be used - solid colors only
  // primary: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  // secondary: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
  // tertiary: 'linear-gradient(135deg, #991B1B 0%, #7F1D1D 100%)',
};

// Shadow Presets
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  primary: '0 4px 15px rgba(245, 158, 11, 0.3)',
  secondary: '0 4px 15px rgba(30, 58, 138, 0.3)',
};

// Common Use Cases - SOLID COLORS ONLY
export const useCases = {
  // Buttons
  primaryButton: {
    backgroundColor: colors.primary.main,
    color: colors.text.primary,
    shadow: shadows.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary.main,
    color: colors.text.white,
    shadow: shadows.secondary,
  },
  
  // Cards
  premiumCard: {
    backgroundColor: colors.primary.light,
    color: colors.neutral[900],
    border: `2px solid ${colors.primary.main}`,
  },
  professionalCard: {
    backgroundColor: colors.background.paper,
    border: `1px solid ${colors.divider}`,
    shadow: shadows.md,
  },
  
  // Highlights
  activeItem: {
    backgroundColor: colors.primary[100],
    color: colors.primary[800],
  },
  selectedItem: {
    backgroundColor: colors.primary[50],
    color: colors.primary[700],
  },
};

export default colors;

