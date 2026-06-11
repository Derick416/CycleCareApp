import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert, ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from 'react-native';
import { useUsername } from '../components/UsernameContext';

export default function SignUpScreen() {
  const router = useRouter();
  const { register } = useUsername();
  const [usernameInput, setUsernameInput] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (value: string) => {
    const rules = [
      { test: (input: string) => /.{8,}/.test(input), message: 'at least 8 characters' },
      { test: (input: string) => /[A-Z]/.test(input), message: 'an uppercase letter' },
      { test: (input: string) => /[a-z]/.test(input), message: 'a lowercase letter' },
      { test: (input: string) => /\d/.test(input), message: 'a number' },
      { test: (input: string) => /[!@#$%^&*(),.?":{}|<>]/.test(input), message: 'a special character' },
    ];
    const missing = rules.filter((rule) => !rule.test(value)).map((rule) => rule.message);
    return missing.length ? `Password must contain ${missing.join(', ')}` : '';
  };

  const handleRegister = async () => {
    if (!usernameInput.trim() || !password.trim() || !confirm.trim()) {
      Alert.alert('Error', 'Fill in all required fields');
      return;
    }

    if (password !== confirm) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      Alert.alert('Weak Password', passwordError);
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address or leave it blank.');
      return;
    }

    try {
      await register(usernameInput.trim(), password, email.trim() || undefined);
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Registration failed', error.message || 'Unable to create account');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={usernameInput}
        onChangeText={setUsernameInput}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email (optional)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordRow}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.passwordToggle}
          onPress={() => setShowPassword((prev) => !prev)}
        >
          <MaterialIcons
            name={showPassword ? 'visibility-off' : 'visibility'}
            size={24}
            color="#FF69B4"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.passwordRow}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Confirm Password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          style={styles.passwordToggle}
          onPress={() => setShowConfirmPassword((prev) => !prev)}
        >
          <MaterialIcons
            name={showConfirmPassword ? 'visibility-off' : 'visibility'}
            size={24}
            color="#FF69B4"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>
        Password must be 5+ characters and include uppercase, lowercase, number, and special character.
      </Text>
      <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
        <Text style={styles.primaryButtonText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', color: '#FF69B4', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  passwordRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  passwordInput: { flex: 1, marginBottom: 0 },
  passwordToggle: { marginLeft: 10, paddingVertical: 12, paddingHorizontal: 10 },
  passwordToggleText: { color: '#FF69B4', fontWeight: '600' },
  primaryButton: { backgroundColor: '#FF69B4', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  hint: { fontSize: 13, color: '#666', marginBottom: 16, lineHeight: 18 },
  link: { color: '#FF69B4', textAlign: 'center', fontSize: 15 },
});
