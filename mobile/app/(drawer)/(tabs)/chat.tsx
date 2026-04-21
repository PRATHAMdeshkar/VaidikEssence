import { StyleSheet, Text, View } from "react-native";

import { AppCard } from "@/app/components/ui/AppCard";
import { theme } from "@/app/theme";

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <AppCard style={styles.card}>
        <Text style={styles.title}>Chat</Text>
        <Text style={styles.subtitle}>Seek guidance with clarity and ease.</Text>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
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
  },
});
