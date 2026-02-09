import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { SafeText } from '../../components/ui/SafeText';
import { BigButton } from '../../components/ui/BigButton';
import { Input } from '../../components/ui/Input';

export default function RegisterScreen() {
  const { register, error, clearError, isLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  async function handleRegister() {
    setLocalError('');
    if (!displayName || !email || !password) return;
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }
    try {
      await register(email, password, displayName);
      router.replace('/(tabs)');
    } catch {
      // Error is handled in context
    }
  }

  const displayError = localError || error;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <SafeText variant="h1" align="center">Create Account</SafeText>
            <SafeText variant="bodyLarge" color="#616161" align="center" style={styles.subtitle}>
              Join SeniorProtect to stay safe online
            </SafeText>
          </View>

          {displayError && (
            <View style={styles.errorBox}>
              <SafeText color="#B71C1C">{displayError}</SafeText>
            </View>
          )}

          <Input
            label="Your Name"
            value={displayName}
            onChangeText={(text) => { clearError(); setDisplayName(text); }}
            placeholder="John Smith"
          />

          <Input
            label="Email Address"
            value={email}
            onChangeText={(text) => { clearError(); setEmail(text); }}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={(text) => { clearError(); setLocalError(''); setPassword(text); }}
            placeholder="At least 8 characters"
            secureTextEntry
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => { setLocalError(''); setConfirmPassword(text); }}
            placeholder="Type your password again"
            secureTextEntry
          />

          <BigButton
            title="Create Account"
            onPress={handleRegister}
            loading={isLoading}
            disabled={!displayName || !email || !password || !confirmPassword}
            accessibilityLabel="Create your account"
          />

          <View style={styles.linkRow}>
            <SafeText color="#616161">Already have an account? </SafeText>
            <Link href="/(auth)/login">
              <SafeText color="#1565C0" style={styles.linkText}>Sign In</SafeText>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  flex: { flex: 1 },
  content: { padding: 24, paddingTop: 32 },
  header: { marginBottom: 32, alignItems: 'center' },
  subtitle: { marginTop: 8 },
  errorBox: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  linkText: { fontWeight: '600' },
});
