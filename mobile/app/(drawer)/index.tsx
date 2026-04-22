import { StyleSheet, Text, View } from "react-native";

import { AppCard } from "@/app/components/ui/AppCard";
import { theme } from "@/app/theme";

export default function DrawerIndex() {
  return (
    <View style={styles.container}>
      <AppCard style={styles.card}>
        <Text style={styles.title}>Drawer Info</Text>
        <Text style={styles.subtitle}>Simple drawer message screen.</Text>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  card: {
    width: "100%",
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.heading,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
