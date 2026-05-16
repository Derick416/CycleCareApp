
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUsername } from '../components/UsernameContext';
import { loadAccounts } from '../components/AccountStorage';

export default function LoginScreen() {
  const router = useRouter();
  const { username, loading, login } = useUsername();
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotVisible, setForgotVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [savedAccounts, setSavedAccounts] = useState<string[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const store = await loadAccounts();
      setSavedAccounts(store.accounts.map((item) => item.username));
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (!loading && username) {
      router.replace('/(tabs)');
    }
  }, [username, loading, router]);

  const handleLogin = async () => {
    if (!usernameInput.trim() || !password.trim()) {
      Alert.alert('Error', 'Enter username and password');
      return;
    }

    try {
      await login(usernameInput.trim(), password, rememberMe);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    }
  };

  const selectSavedAccount = (selected: string) => {
    setUsernameInput(selected);
    setPassword('');
  };

  const handleResetPassword = () => {
    if (resetEmail.trim()) {
      setForgotVisible(false);
      Alert.alert('Reset Sent', `Password reset link sent to ${resetEmail}`);
      setResetEmail('');
    } else {
      Alert.alert('Error', 'Please enter your email');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Cycle Care</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={usernameInput}
          onChangeText={setUsernameInput}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
          <Text style={styles.rememberText}>Remember Me</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.link}>Don't have an account? Sign up</Text>
        </TouchableOpacity>

        {savedAccounts.length > 0 && (
          <View style={styles.savedAccountsContainer}>
            <Text style={styles.savedAccountsTitle}>Select a saved account</Text>
            {savedAccounts.map((account) => (
              <TouchableOpacity
                key={account}
                style={styles.savedAccountButton}
                onPress={() => selectSavedAccount(account)}
              >
                <Text style={styles.savedAccountText}>{account}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity onPress={() => setForgotVisible(true)}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Forgot Password Modal */}
      <Modal visible={forgotVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Forgot Password</Text>
            <Text style={styles.modalBody}>
              Enter your registered email to reset your password:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setForgotVisible(false)}>
                <Text style={styles.link}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={handleResetPassword}>
                <Text style={styles.primaryButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF69B4',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#FF69B4',
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#FF69B4',
  },
  rememberText: {
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#FF69B4',
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 15,
  },
  savedAccountsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  savedAccountsTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  savedAccountButton: {
    backgroundColor: '#FFF0F6',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFD1E8',
  },
  savedAccountText: {
    textAlign: 'center',
    color: '#C2185B',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 14,
    marginBottom: 12,
    color: '#444',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
});
