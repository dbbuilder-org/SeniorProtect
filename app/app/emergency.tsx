import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../components/ui/SafeText';
import { BigButton } from '../components/ui/BigButton';
import { Card } from '../components/ui/Card';

const EMERGENCIES = [
  {
    icon: '🔑',
    title: 'I shared my password',
    urgency: 'immediate',
    steps: [
      'Change your password RIGHT NOW on the real website',
      'If you use the same password elsewhere, change those too',
      'Turn on two-factor authentication if available',
      'Watch for unusual activity on your accounts',
    ],
  },
  {
    icon: '💳',
    title: 'I shared financial info',
    urgency: 'immediate',
    steps: [
      'Call your bank immediately using the number on your card',
      'Report the fraud and ask to freeze your accounts',
      'Place a fraud alert with credit bureaus (Equifax: 1-800-525-6285)',
      'Monitor your credit report for unauthorized activity',
    ],
  },
  {
    icon: '🔗',
    title: 'I clicked a suspicious link',
    urgency: 'soon',
    steps: [
      'Do NOT enter any information on the page',
      'Close the browser tab immediately',
      'Run a virus scan on your device',
      'Change passwords for any accounts you were logged into',
      'Watch for unusual emails or account notifications',
    ],
  },
  {
    icon: '💸',
    title: 'I sent money to a scammer',
    urgency: 'immediate',
    steps: [
      'Contact your bank or payment service immediately',
      'If you paid by credit card, request a chargeback',
      'File a report with the FTC at ReportFraud.ftc.gov',
      'File a complaint with the FBI at ic3.gov',
      'Keep all records of the transaction',
    ],
  },
];

export default function EmergencyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <BigButton
          title="← Back to Home"
          onPress={() => router.back()}
          variant="outline"
          accessibilityLabel="Go back to home screen"
          style={styles.backButton}
        />

        <SafeText variant="h1">I Made a Mistake</SafeText>
        <SafeText variant="bodyLarge" color="#616161" style={styles.subtitle}>
          It's okay — everyone makes mistakes. Here's what to do now.
        </SafeText>

        {EMERGENCIES.map((item, i) => (
          <Card key={i} variant="caution" style={styles.card}>
            <SafeText style={styles.icon}>{item.icon}</SafeText>
            <SafeText variant="h3">{item.title}</SafeText>
            {item.urgency === 'immediate' && (
              <View style={styles.urgentBadge}>
                <SafeText variant="caption" color="#B71C1C">Act Now</SafeText>
              </View>
            )}
            <View style={styles.steps}>
              {item.steps.map((step, j) => (
                <View key={j} style={styles.stepRow}>
                  <SafeText variant="bodyLarge" color="#1565C0" style={styles.stepNum}>
                    {j + 1}.
                  </SafeText>
                  <SafeText variant="body" style={styles.stepText}>{step}</SafeText>
                </View>
              ))}
            </View>
          </Card>
        ))}

        <Card style={styles.helpCard}>
          <SafeText variant="h3">Need More Help?</SafeText>
          <SafeText variant="body" color="#616161" style={styles.helpText}>
            You can report scams and get assistance from these organizations:
          </SafeText>
          <BigButton
            title="📞 Call FTC: 1-877-382-4357"
            onPress={() => Linking.openURL('tel:18773824357')}
            variant="outline"
            accessibilityLabel="Call the Federal Trade Commission"
            style={styles.helpButton}
          />
          <BigButton
            title="🌐 Report to FBI (ic3.gov)"
            onPress={() => Linking.openURL('https://www.ic3.gov')}
            variant="outline"
            accessibilityLabel="Report to the FBI Internet Crime Center"
            style={styles.helpButton}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24, paddingBottom: 48 },
  backButton: { alignSelf: 'flex-start', width: 'auto', paddingHorizontal: 16, marginBottom: 16 },
  subtitle: { marginTop: 4, marginBottom: 24 },
  card: { marginBottom: 16 },
  icon: { fontSize: 40, marginBottom: 8 },
  urgentBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  steps: { marginTop: 12 },
  stepRow: { flexDirection: 'row', marginBottom: 8 },
  stepNum: { width: 28, fontWeight: '700' },
  stepText: { flex: 1 },
  helpCard: { marginTop: 8, marginBottom: 16 },
  helpText: { marginTop: 4, marginBottom: 12 },
  helpButton: { marginTop: 8 },
});
