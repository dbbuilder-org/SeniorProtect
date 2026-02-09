import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../../components/ui/SafeText';
import { BigButton } from '../../components/ui/BigButton';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { api } from '../../lib/api';

const TYPE_CONFIG: Record<string, { title: string; placeholder: string; multiline: boolean; senderField: boolean; subjectField: boolean }> = {
  email: {
    title: 'Check an Email',
    placeholder: 'Paste the email content here...',
    multiline: true,
    senderField: true,
    subjectField: true,
  },
  text: {
    title: 'Check a Text Message',
    placeholder: 'Paste the text message here...',
    multiline: true,
    senderField: true,
    subjectField: false,
  },
  url: {
    title: 'Check a Website',
    placeholder: 'https://example.com',
    multiline: false,
    senderField: false,
    subjectField: false,
  },
};

export default function CheckScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.email;

  const [content, setContent] = useState('');
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCheck() {
    if (!content.trim()) return;
    setError('');
    setLoading(true);

    try {
      const metadata: any = {};
      if (sender) metadata.sender = sender;
      if (subject) metadata.subject = subject;

      let result;
      if (type === 'email') {
        result = await api.checkEmail(content, metadata);
      } else if (type === 'text') {
        result = await api.checkText(content, metadata);
      } else {
        result = await api.checkUrl(content);
      }

      router.push({
        pathname: '/check/results',
        params: { data: JSON.stringify(result) },
      });
    } catch (err: any) {
      setError(err.message || 'Check failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message={`Checking ${type}...`} />
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
          <BigButton
            title="← Back"
            onPress={() => router.back()}
            variant="outline"
            accessibilityLabel="Go back"
            style={styles.backButton}
          />

          <SafeText variant="h1">{config.title}</SafeText>
          <SafeText variant="body" color="#616161" style={styles.desc}>
            {type === 'url'
              ? 'Enter the web address you want to check.'
              : 'Paste the content below and we\'ll check it for you.'}
          </SafeText>

          {error && (
            <View style={styles.errorBox}>
              <SafeText color="#B71C1C">{error}</SafeText>
            </View>
          )}

          {config.senderField && (
            <Input
              label="From (optional)"
              value={sender}
              onChangeText={setSender}
              placeholder="Sender email or name"
              autoCapitalize="none"
            />
          )}

          {config.subjectField && (
            <Input
              label="Subject (optional)"
              value={subject}
              onChangeText={setSubject}
              placeholder="Email subject line"
            />
          )}

          <Input
            label={type === 'url' ? 'Website Address' : 'Content'}
            value={content}
            onChangeText={setContent}
            placeholder={config.placeholder}
            multiline={config.multiline}
            autoCapitalize="none"
            keyboardType={type === 'url' ? 'url' : 'default'}
            style={config.multiline ? styles.multiline : undefined}
          />

          <BigButton
            title="Check Now"
            onPress={handleCheck}
            disabled={!content.trim()}
            accessibilityLabel={`Check this ${type} for scams`}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  flex: { flex: 1 },
  content: { padding: 24 },
  desc: { marginTop: 4, marginBottom: 16 },
  backButton: { alignSelf: 'flex-start', width: 'auto', paddingHorizontal: 16, marginBottom: 16 },
  errorBox: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  multiline: { minHeight: 160 },
});
