import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { AppButton } from "@/app/components/ui/AppButton";
import { AppCard } from "@/app/components/ui/AppCard";
import { AppInput } from "@/app/components/ui/AppInput";
import { theme } from "@/app/theme";
import { loginUser } from "../services/authService";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter both email and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      await loginUser({
        email: email.trim(),
        password,
      });

      router.replace("/(drawer)/(tabs)/home");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed. Please try again.";
      Alert.alert("Login failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to continue your journey.</Text>
          </View>

          <AppCard style={styles.formCard}>
            <AppInput
              label="Email"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AppInput
              label="Password"
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <AppButton title="Login" onPress={handleLogin} loading={isSubmitting} style={styles.loginButton} />
          </AppCard>

          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.signupText}>Don’t have an account? Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  header: {
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  formCard: {
    gap: theme.spacing.xs,
  },
  loginButton: {
    marginTop: theme.spacing.xs,
  },
  signupText: {
    ...theme.typography.label,
    color: theme.colors.secondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
});
