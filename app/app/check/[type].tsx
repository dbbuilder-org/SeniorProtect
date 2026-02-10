import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { SafeText } from '../../components/ui/SafeText';
import { BigButton } from '../../components/ui/BigButton';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { BottomNav } from '../../components/ui/BottomNav';
import { api } from '../../lib/api';

const TYPE_CONFIG: Record<string, { title: string; placeholder: string; multiline: boolean; senderField: boolean; subjectField: boolean; allowPhoto: boolean }> = {
  email: {
    title: 'Check an Email',
    placeholder: 'Paste the email content here...',
    multiline: true,
    senderField: true,
    subjectField: true,
    allowPhoto: true,
  },
  text: {
    title: 'Check a Text Message',
    placeholder: 'Paste the text message here...',
    multiline: true,
    senderField: true,
    subjectField: false,
    allowPhoto: true,
  },
  url: {
    title: 'Check a Website',
    placeholder: 'https://example.com',
    multiline: false,
    senderField: false,
    subjectField: false,
    allowPhoto: false,
  },
};

type InputMode = 'text' | 'photo';

export default function CheckScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.email;

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

      // For photo mode, send the base64 image as content with a flag
      const checkContent = inputMode === 'photo'
        ? `[IMAGE SCREENSHOT]\n${imageBase64}`
        : content;

      let result;
      if (type === 'email') {
        result = await api.checkEmail(checkContent, metadata);
      } else if (type === 'text') {
        result = await api.checkText(checkContent, metadata);
      } else {
        result = await api.checkUrl(checkContent);
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

  async function handleAddTrustedSite() {
    if (!content.trim()) return;
    try {
      let domain = content.trim();
      // Strip protocol and path to get just the domain
      domain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      const name = domain.replace(/^www\./, '');

      await api.addTrustedSite(name, domain, 'other', `Added by user`);
      Alert.alert('Added', `${domain} has been added to your trusted sites.`);
    } catch (err: any) {
      Alert.alert('Could not add', err.message || 'Failed to add site.');
    }
  }

  const hasContent = inputMode === 'photo' ? !!imageBase64 : !!content.trim();

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
          <Pressable
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            style={styles.backButton}
          >
            <SafeText variant="body" color="#1565C0">← Back</SafeText>
          </Pressable>

          <SafeText variant="h1">{config.title}</SafeText>
          <SafeText variant="body" color="#616161" style={styles.desc}>
            {type === 'url'
              ? 'Enter the web address you want to check.'
              : 'Paste the content or a screenshot and we\'ll check it for you.'}
          </SafeText>

          {error && (
            <View style={styles.errorBox}>
              <SafeText color="#B71C1C">{error}</SafeText>
            </View>
          )}

          {/* Input mode toggle for email/text */}
          {config.allowPhoto && (
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
          )}

          {/* Main content / photo input — shown first */}
          {inputMode === 'photo' && config.allowPhoto ? (
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
              label={type === 'url' ? 'Website Address' : 'Content'}
              value={content}
              onChangeText={setContent}
              placeholder={config.placeholder}
              multiline={config.multiline}
              autoCapitalize="none"
              keyboardType={type === 'url' ? 'url' : 'default'}
              style={config.multiline ? styles.multiline : undefined}
            />
          )}

          {/* Optional metadata fields — below main content */}
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

          <BigButton
            title="Check Now"
            onPress={handleCheck}
            disabled={!hasContent}
            accessibilityLabel={`Check this ${type} for scams`}
          />

          {type === 'url' && (
            <BigButton
              title="Add to Trusted Sites"
              onPress={handleAddTrustedSite}
              variant="outline"
              disabled={!content.trim()}
              accessibilityLabel="Add this website to your trusted sites list"
              style={styles.addSiteButton}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  flex: { flex: 1 },
  content: { padding: 20, paddingTop: 8 },
  desc: { marginTop: 2, marginBottom: 12 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8, marginBottom: 4 },
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
  addSiteButton: {
    marginTop: 8,
  },
});
