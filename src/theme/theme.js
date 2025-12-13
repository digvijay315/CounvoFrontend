import { createTheme } from '@mui/material/styles';

// Professional Lawyer App Theme
// Primary: Gold/Yellow - Trust, Excellence, Premium
// Secondary: Navy Blue - Authority, Professionalism, Stability
// Tertiary: Burgundy - Tradition, Sophistication
// NOTE: NO GRADIENTS - Solid colors only

const theme = createTheme({
  palette: {
    primary: {
      main: "#F59E0B", // Amber/Gold - Professional yellow
      light: "#FCD34D",
      dark: "#D97706",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#1E3A8A", // Navy Blue - Professional authority
      light: "#3B82F6",
      dark: "#1E40AF",
      contrastText: "#FFFFFF",
    },
    tertiary: {
      main: "#991B1B", // Burgundy - Legal tradition
      light: "#DC2626",
      dark: "#7F1D1D",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#059669", // Professional green
      light: "#10B981",
      dark: "#047857",
    },
    error: {
      main: "#DC2626",
      light: "#EF4444",
      dark: "#B91C1C",
    },
    warning: {
      main: "#F59E0B",
      light: "#FCD34D",
      dark: "#D97706",
    },
    info: {
      main: "#3B82F6",
      light: "#60A5FA",
      dark: "#2563EB",
    },
    background: {
      default: "#F9FAFB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F2937",
      secondary: "#6B7280",
      disabled: "#9CA3AF",
    },
    divider: "#E5E7EB",
  },

  typography: {
    fontFamily: '"Inter Tight", "Roboto", "Helvetica", "Arial", sans-serif',

    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "0.02em",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
    },
  },

  shape: {
    borderRadius: 8,
  },

  shadows: [
    "none",
    "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
    "0 4px 8px 0 rgba(0, 0, 0, 0.12)",
    "0 8px 16px 0 rgba(0, 0, 0, 0.14)",
    "0 12px 24px 0 rgba(0, 0, 0, 0.16)",
    "0 16px 32px 0 rgba(0, 0, 0, 0.18)",
    "0 20px 40px 0 rgba(0, 0, 0, 0.20)",
    "0 24px 48px 0 rgba(0, 0, 0, 0.22)",
    "0 28px 56px 0 rgba(0, 0, 0, 0.24)",
    "0 32px 64px 0 rgba(0, 0, 0, 0.26)",
    "0 36px 72px 0 rgba(0, 0, 0, 0.28)",
    "0 40px 80px 0 rgba(0, 0, 0, 0.30)",
    "0 44px 88px 0 rgba(0, 0, 0, 0.32)",
    "0 48px 96px 0 rgba(0, 0, 0, 0.34)",
    "0 52px 104px 0 rgba(0, 0, 0, 0.36)",
    "0 56px 112px 0 rgba(0, 0, 0, 0.38)",
    "0 60px 120px 0 rgba(0, 0, 0, 0.40)",
    "0 64px 128px 0 rgba(0, 0, 0, 0.42)",
    "0 68px 136px 0 rgba(0, 0, 0, 0.44)",
  ],

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          fontSize: "0.875rem",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0 4px 12px rgba(245, 158, 11, 0.4)",
          },
        },
        containedPrimary: {
          backgroundColor: "#F59E0B",
          color: "#1F2937",
          "&:hover": {
            backgroundColor: "#D97706",
          },
        },
        outlined: {
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
          },
        },
        sizeSmall: {
          padding: "6px 16px",
          fontSize: "0.8125rem",
        },
        sizeLarge: {
          padding: "12px 32px",
          fontSize: "1rem",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
      defaultProps: {
        elevation: 0,
        variant: "outlined",
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        },
        elevation2: {
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
        elevation3: {
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#F59E0B",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#F59E0B",
              borderWidth: "2px",
            },
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          backgroundColor: "#FEF3C7",
          color: "#92400E",
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
          "&.Mui-selected": {
            backgroundColor: "#FEF3C7",
            color: "#92400E",
            "&:hover": {
              backgroundColor: "#FDE68A",
            },
          },
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          "&.Mui-selected": {
            color: "#F59E0B",
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: "#F9FAFB",
          color: "#1F2937",
        },
      },
    },

    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardSuccess: {
          backgroundColor: "#D1FAE5",
          color: "#065F46",
        },
        standardError: {
          backgroundColor: "#FEE2E2",
          color: "#991B1B",
        },
        standardWarning: {
          backgroundColor: "#FEF3C7",
          color: "#92400E",
        },
        standardInfo: {
          backgroundColor: "#DBEAFE",
          color: "#1E40AF",
        },
      },
    },
  },
});

export default theme;

