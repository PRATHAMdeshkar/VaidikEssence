import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";

import { theme } from "@/app/theme";

type ButtonVariant = "primary" | "secondary";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
}

export function AppButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  style,
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" ? styles.primary : styles.secondary,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? theme.colors.white : theme.colors.textPrimary} />
      ) : (
        <Text style={[styles.label, variant === "secondary" && styles.secondaryLabel]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.lg,
    minHeight: theme.sizing.controlHeight,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.soft,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.border,
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
  disabled: {
    opacity: theme.opacity.disabled,
  },
  label: {
    ...theme.typography.button,
    color: theme.colors.white,
  },
  secondaryLabel: {
    color: theme.colors.textPrimary,
  },
});
