import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../../components/ui/SafeText';
import Ionicons from '@expo/vector-icons/Ionicons';

const BUTTONS: {
  title: string;
  ionicon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  description: string;
  route: string;
  color: string;
  textColor: string;
}[] = [
  {
    title: 'Check Email',
    ionicon: 'mail-outline',
    iconColor: '#1565C0',
    description: 'Paste an email to check if it\'s safe',
    route: '/check/email',
    color: '#E3F2FD',
    textColor: '#1565C0',
  },
  {
    title: 'Check Website',
    ionicon: 'globe-outline',
    iconColor: '#1565C0',
    description: 'Enter a web address to verify',
    route: '/check/url',
    color: '#E3F2FD',
    textColor: '#1565C0',
  },
  {
    title: 'Check Text',
    ionicon: 'chatbubble-outline',
    iconColor: '#1565C0',
    description: 'Paste a text message to check',
    route: '/check/text',
    color: '#E3F2FD',
    textColor: '#1565C0',
  },
  {
    title: 'I Made a Mistake',
    ionicon: 'alert-circle-outline',
    iconColor: '#B71C1C',
    description: 'Get help if something went wrong',
    route: '/emergency',
    color: '#FFEBEE',
    textColor: '#B71C1C',
  },
];

export default function CheckerScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Ionicons name="search-outline" size={28} color="#1565C0" />
            <SafeText variant="h1" style={styles.headerTitle}>Checker</SafeText>
          </View>
          <SafeText variant="bodyLarge" color="#616161" style={styles.subtitle}>
            What would you like to check today?
          </SafeText>
        </View>

        <View style={styles.grid}>
          {BUTTONS.map((btn) => (
            <Pressable
              key={btn.route}
              style={[styles.gridButton, { backgroundColor: btn.color }]}
              onPress={() => router.push(btn.route as any)}
              accessibilityLabel={btn.description}
              accessibilityRole="button"
            >
              <Ionicons name={btn.ionicon} size={36} color={btn.iconColor} style={styles.gridIcon} />
              <SafeText variant="h3" color={btn.textColor} align="center">
                {btn.title}
              </SafeText>
              <SafeText variant="caption" color="#616161" align="center" style={styles.gridDesc}>
                {btn.description}
              </SafeText>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24 },
  header: { marginBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { flex: 1 },
  subtitle: { marginTop: 4 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridButton: {
    width: '48%',
    minHeight: 160,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridIcon: { marginBottom: 8 },
  gridDesc: { marginTop: 4 },
});
