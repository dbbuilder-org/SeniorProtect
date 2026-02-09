import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { SafeText } from '../../components/ui/SafeText';
import { BigButton } from '../../components/ui/BigButton';
import { Input } from '../../components/ui/Input';

export default function LoginScreen() {
  const { login, error, clearError, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    if (!email || !password) return;
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch {
      // Error is handled in context
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <SafeText variant="h1" align="center">SeniorProtect</SafeText>
            <SafeText variant="bodyLarge" color="#616161" align="center" style={styles.subtitle}>
              Your trusted companion against online scams
            </SafeText>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <SafeText color="#B71C1C">{error}</SafeText>
            </View>
          )}

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
            onChangeText={(text) => { clearError(); setPassword(text); }}
            placeholder="Your password"
            secureTextEntry
          />

          <BigButton
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            disabled={!email || !password}
            accessibilityLabel="Sign in to your account"
          />

          <View style={styles.linkRow}>
            <SafeText color="#616161">Don't have an account? </SafeText>
            <Link href="/(auth)/register">
              <SafeText color="#1565C0" style={styles.linkText}>Sign Up</SafeText>
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
  content: { padding: 24, paddingTop: 48 },
  header: { marginBottom: 40, alignItems: 'center' },
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
