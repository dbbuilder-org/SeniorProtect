import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { SafeText } from './ui/SafeText';
import { BigButton } from './ui/BigButton';
import { Input } from './ui/Input';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { api } from '../lib/api';

interface CheckFormProps {
  type: 'text' | 'email';
  title: string;
  placeholder: string;
  senderField: boolean;
  subjectField: boolean;
}

type InputMode = 'text' | 'photo';

export function CheckForm({ type, title, placeholder, senderField, subjectField }: CheckFormProps) {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Permission to access photos is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 || null);
    }
  }

  function clearImage() {
    setImageUri(null);
    setImageBase64(null);
  }

  async function handleCheck() {
    const hasContent = inputMode === 'photo' ? !!imageBase64 : !!content.trim();
    if (!hasContent) return;
    setError('');
    setLoading(true);

    try {
      const metadata: any = {};
      if (sender) metadata.sender = sender;
      if (subject) metadata.subject = subject;

      const checkContent = inputMode === 'photo'
        ? `[IMAGE SCREENSHOT]\n${imageBase64}`
        : content;

      let result;
      if (type === 'email') {
        result = await api.checkEmail(checkContent, metadata);
      } else {
        result = await api.checkText(checkContent, metadata);
      }

      router.push({
        pathname: '/(tabs)/check-results',
        params: { data: JSON.stringify(result) },
      });
    } catch (err: any) {
      setError(err.message || 'Check failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const hasContent = inputMode === 'photo' ? !!imageBase64 : !!content.trim();

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner message={`Checking ${type}...`} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <SafeText variant="h1">{title}</SafeText>
          <SafeText variant="body" color="#616161" style={styles.desc}>
            Paste the content or a screenshot and we'll check it for you.
          </SafeText>

          {error && (
            <View style={styles.errorBox}>
              <SafeText color="#B71C1C">{error}</SafeText>
            </View>
          )}

          <View style={styles.modeToggle}>
            <Pressable
              style={[styles.modeButton, inputMode === 'text' && styles.modeButtonActive]}
              onPress={() => setInputMode('text')}
              accessibilityLabel="Type text"
              accessibilityRole="button"
            >
              <SafeText
                variant="body"
                color={inputMode === 'text' ? '#FFFFFF' : '#1565C0'}
                style={styles.modeButtonText}
              >
                Type Text
              </SafeText>
            </Pressable>
            <Pressable
              style={[styles.modeButton, inputMode === 'photo' && styles.modeButtonActive]}
              onPress={() => setInputMode('photo')}
              accessibilityLabel="Paste screenshot"
              accessibilityRole="button"
            >
              <SafeText
                variant="body"
                color={inputMode === 'photo' ? '#FFFFFF' : '#1565C0'}
                style={styles.modeButtonText}
              >
                Screenshot
              </SafeText>
            </Pressable>
          </View>

          {inputMode === 'photo' ? (
            <View style={styles.photoSection}>
              {imageUri ? (
                <View>
                  <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="contain" />
                  <BigButton
                    title="Remove Screenshot"
                    onPress={clearImage}
                    variant="outline"
                    accessibilityLabel="Remove screenshot"
                    style={styles.removeButton}
                  />
                </View>
              ) : (
                <Pressable
                  style={styles.photoPlaceholder}
                  onPress={pickImage}
                  accessibilityLabel="Choose a screenshot from your photos"
                  accessibilityRole="button"
                >
                  <SafeText variant="h2" color="#9E9E9E" align="center">📷</SafeText>
                  <SafeText variant="body" color="#616161" align="center" style={styles.photoText}>
                    Tap to choose a screenshot{'\n'}from your photos
                  </SafeText>
                </Pressable>
              )}
            </View>
          ) : (
            <Input
              label="Content"
              value={content}
              onChangeText={setContent}
              placeholder={placeholder}
              multiline
              autoCapitalize="none"
              style={styles.multiline}
            />
          )}

          {senderField && (
            <Input
              label="From (optional)"
              value={sender}
              onChangeText={setSender}
              placeholder="Sender email or name"
              autoCapitalize="none"
            />
          )}

          {subjectField && (
            <Input
              label="Subject (optional)"
              value={subject}
              onChangeText={setSubject}
              placeholder="Email subject line"
            />
          )}

          <BigButton
            title="Check Now"
            onPress={handleCheck}
            disabled={!hasContent}
            accessibilityLabel={`Check this ${type} for scams`}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  flex: { flex: 1 },
  content: { padding: 20, paddingTop: 16 },
  desc: { marginTop: 2, marginBottom: 12 },
  errorBox: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  multiline: { minHeight: 120 },
  modeToggle: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1565C0',
    overflow: 'hidden',
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  modeButtonActive: {
    backgroundColor: '#1565C0',
  },
  modeButtonText: {
    fontWeight: '600',
  },
  photoSection: {
    marginBottom: 12,
  },
  photoPlaceholder: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    minHeight: 140,
  },
  photoText: {
    marginTop: 8,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  removeButton: {
    marginTop: 8,
  },
});
