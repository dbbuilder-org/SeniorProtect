import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSignIn } from '@clerk/clerk-expo';
import { SafeText } from '../../components/ui/SafeText';
import { BigButton } from '../../components/ui/BigButton';
import { Input } from '../../components/ui/Input';

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    if (!isLoaded || !email || !password) return;
    setError('');
    setLoading(true);

    try {
      const result = await signIn.create({ identifier: email, password });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/(tabs)');
      } else {
        setError('Sign in could not be completed. Please try again.');
      }
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Sign in failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, email, password, signIn, setActive]);

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

          {error ? (
            <View style={styles.errorBox}>
              <SafeText color="#B71C1C">{error}</SafeText>
            </View>
          ) : null}

          <Input
            label="Email Address"
            value={email}
            onChangeText={(text) => { setError(''); setEmail(text); }}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={(text) => { setError(''); setPassword(text); }}
            placeholder="Your password"
            secureTextEntry
          />

          <BigButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
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
