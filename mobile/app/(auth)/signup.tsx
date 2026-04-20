import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { registerUser } from '../services/authService';

const Signup = () => {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter name, email, and password.');
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

      Alert.alert('Success', 'Account created successfully. Please login.');
      router.replace('/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed. Please try again.';
      Alert.alert('Signup failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Create Account 🚀</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#999"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Phone Number"
        placeholderTextColor="#999"
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.signupBtn} onPress={handleSignup} disabled={isSubmitting}>
        {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupBtnText}>Sign Up</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.loginText}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1E293B',
    padding: 15,
    borderRadius: 12,
    color: '#fff',
    marginBottom: 15,
  },
  signupBtn: {
    backgroundColor: '#22C55E',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  signupBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginText: {
    color: '#38BDF8',
    textAlign: 'center',
    marginTop: 20,
  },
});
