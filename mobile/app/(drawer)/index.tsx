import { StyleSheet, Text, View } from "react-native";

export default function DrawerIndex() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drawer Placeholder</Text>
      <Text style={styles.subtitle}>Simple drawer message screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
});
