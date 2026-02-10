import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSignUp } from '@clerk/clerk-expo';
import { SafeText } from '../../components/ui/SafeText';
import { BigButton } from '../../components/ui/BigButton';
import { Input } from '../../components/ui/Input';

export default function RegisterScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = useCallback(async () => {
    if (!isLoaded || !displayName || !email || !password) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Split name into first/last for Clerk
      const parts = displayName.trim().split(' ');
      const firstName = parts[0];
      const lastName = parts.slice(1).join(' ') || undefined;

      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, displayName, email, password, confirmPassword, signUp]);

  const handleVerify = useCallback(async () => {
    if (!isLoaded || !code) return;
    setError('');
    setLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/(tabs)');
      } else {
        setError('Verification could not be completed. Please try again.');
      }
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Verification failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, code, signUp, setActive]);

  if (pendingVerification) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <SafeText variant="h1" align="center">Verify Your Email</SafeText>
              <SafeText variant="bodyLarge" color="#616161" align="center" style={styles.subtitle}>
                We sent a verification code to {email}
              </SafeText>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <SafeText color="#B71C1C">{error}</SafeText>
              </View>
            ) : null}

            <Input
              label="Verification Code"
              value={code}
              onChangeText={(text) => { setError(''); setCode(text); }}
              placeholder="Enter 6-digit code"
              keyboardType="number-pad"
            />

            <BigButton
              title="Verify Email"
              onPress={handleVerify}
              loading={loading}
              disabled={!code}
              accessibilityLabel="Verify your email address"
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

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

          {error ? (
            <View style={styles.errorBox}>
              <SafeText color="#B71C1C">{error}</SafeText>
            </View>
          ) : null}

          <Input
            label="Your Name"
            value={displayName}
            onChangeText={(text) => { setError(''); setDisplayName(text); }}
            placeholder="John Smith"
          />

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
            placeholder="At least 8 characters"
            secureTextEntry
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => { setError(''); setConfirmPassword(text); }}
            placeholder="Type your password again"
            secureTextEntry
          />

          <BigButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
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
