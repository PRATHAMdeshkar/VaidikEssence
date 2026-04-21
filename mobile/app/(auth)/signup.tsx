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
import { registerUser } from "../services/authService";

const Signup = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter name, email, and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        password,
      });

      Alert.alert("Success", "Account created successfully. Please login.");
      router.replace("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed. Please try again.";
      Alert.alert("Signup failed", message);
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started.</Text>
          </View>

          <AppCard style={styles.formCard}>
            <AppInput label="Full Name" placeholder="Full Name" value={name} onChangeText={setName} />

            <AppInput
              label="Email"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AppInput
              label="Phone Number"
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            <AppInput
              label="Password"
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <AppButton title="Sign Up" onPress={handleSignup} loading={isSubmitting} style={styles.signupButton} />
          </AppCard>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Signup;

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
  signupButton: {
    marginTop: theme.spacing.xs,
  },
  loginText: {
    ...theme.typography.label,
    color: theme.colors.secondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
});
