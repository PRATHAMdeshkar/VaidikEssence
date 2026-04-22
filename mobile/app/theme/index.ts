import { TextStyle, ViewStyle } from "react-native";

export const theme = {
  colors: {
    primary: "#FF9933",
    secondary: "#E65100",
    accent: "#D4AF37",
    background: "#FFF8E7",
    surface: "#FFFDF7",
    surfaceMuted: "#F9F1DF",
    textPrimary: "#3E2723",
    textSecondary: "#6D5D57",
    border: "#E7D8BE",
    white: "#FFFFFF",
    danger: "#C63D2F",
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 8,
    md: 10,
    lg: 12,
    pill: 999,
  },
  borders: {
    thin: 1,
  },
  sizing: {
    tabBarHeight: 62,
    tabIcon: 24,
    tabIconCompact: 22,
    controlHeight: 52,
  },
  opacity: {
    pressed: 0.88,
    disabled: 0.6,
  },
  tracking: {
    wide: 0.8,
  },
  typography: {
    title: {
      fontSize: 30,
      lineHeight: 38,
      fontWeight: "700",
    } satisfies TextStyle,
    heading: {
      fontSize: 24,
      lineHeight: 30,
      fontWeight: "600",
    } satisfies TextStyle,
    subheading: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: "500",
    } satisfies TextStyle,
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "400",
    } satisfies TextStyle,
    label: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "500",
    } satisfies TextStyle,
    caption: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "500",
    } satisfies TextStyle,
    button: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: "600",
    } satisfies TextStyle,
  },
  shadows: {
    soft: {
      shadowColor: "#3E2723",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    } satisfies ViewStyle,
  },
} as const;

export type AppTheme = typeof theme;
