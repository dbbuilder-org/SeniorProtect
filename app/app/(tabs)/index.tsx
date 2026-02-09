import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { SafeText } from '../../components/ui/SafeText';

const BUTTONS = [
  {
    title: 'Check Email',
    icon: '📧',
    description: 'Paste an email to check if it\'s safe',
    route: '/check/email',
    color: '#E3F2FD',
    textColor: '#1565C0',
  },
  {
    title: 'Check Website',
    icon: '🌐',
    description: 'Enter a web address to verify',
    route: '/check/url',
    color: '#E3F2FD',
    textColor: '#1565C0',
  },
  {
    title: 'Check Text',
    icon: '💬',
    description: 'Paste a text message to check',
    route: '/check/text',
    color: '#E3F2FD',
    textColor: '#1565C0',
  },
  {
    title: 'I Made a Mistake',
    icon: '🆘',
    description: 'Get help if something went wrong',
    route: '/emergency',
    color: '#FFEBEE',
    textColor: '#B71C1C',
  },
];

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SafeText variant="h1">
            Hello{user?.displayName ? `, ${user.displayName}` : ''}!
          </SafeText>
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
              <Text style={styles.gridIcon}>{btn.icon}</Text>
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
  gridIcon: { fontSize: 40, marginBottom: 8 },
  gridDesc: { marginTop: 4 },
});
