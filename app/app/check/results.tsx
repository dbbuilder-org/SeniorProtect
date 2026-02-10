import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../../components/ui/SafeText';
import { BigButton } from '../../components/ui/BigButton';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { BottomNav } from '../../components/ui/BottomNav';

const LEVEL_STYLES = {
  safe: { bg: '#E8F5E9', text: '#1B5E20', icon: '✅', title: 'Looks Safe' },
  caution: { bg: '#FFF3E0', text: '#BF360C', icon: '⚠️', title: 'Be Careful' },
  danger: { bg: '#FFEBEE', text: '#B71C1C', icon: '🚨', title: 'Warning — Likely a Scam' },
};

export default function ResultsScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const [showSignals, setShowSignals] = useState(false);

  let result: any;
  try {
    result = JSON.parse(data || '{}');
  } catch {
    result = {};
  }

  const level = result.threatLevel || 'safe';
  const levelStyle = LEVEL_STYLES[level as keyof typeof LEVEL_STYLES] || LEVEL_STYLES.safe;
  const tq = result.threeQuestions || {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Banner */}
        <View style={[styles.banner, { backgroundColor: levelStyle.bg }]}>
          <SafeText style={styles.bannerIcon}>{levelStyle.icon}</SafeText>
          <SafeText variant="h1" color={levelStyle.text} align="center">
            {levelStyle.title}
          </SafeText>
          <SafeText variant="bodyLarge" color={levelStyle.text} align="center" style={styles.bannerDesc}>
            {result.summary}
          </SafeText>
          <Badge level={level} />
        </View>

        {/* Three Questions */}
        <SafeText variant="h2" style={styles.sectionTitle}>Three Questions</SafeText>

        {tq.whoIsThisFrom && (
          <QuestionCard
            icon="👤"
            title="Who is this from?"
            summary={tq.whoIsThisFrom.summary}
            detail={tq.whoIsThisFrom.detail}
            level={tq.whoIsThisFrom.trustIndicator}
          />
        )}

        {tq.whatDoTheyWant && (
          <QuestionCard
            icon="🎯"
            title="What do they want?"
            summary={tq.whatDoTheyWant.summary}
            detail={tq.whatDoTheyWant.detail}
            level={tq.whatDoTheyWant.trustIndicator}
          />
        )}

        {tq.shouldITrust && (
          <QuestionCard
            icon="🤔"
            title="Should I trust this?"
            summary={tq.shouldITrust.summary}
            detail={tq.shouldITrust.detail}
            level={tq.shouldITrust.trustIndicator}
          />
        )}

        {/* Signals */}
        {result.signals?.length > 0 && (
          <>
            <Pressable
              onPress={() => setShowSignals(!showSignals)}
              style={styles.signalsToggle}
              accessibilityLabel={showSignals ? 'Hide detailed findings' : 'Show detailed findings'}
              accessibilityRole="button"
            >
              <SafeText variant="h3" color="#1565C0">
                {showSignals ? '▼' : '▶'} {result.signals.length} Warning Sign{result.signals.length !== 1 ? 's' : ''} Found
              </SafeText>
            </Pressable>

            {showSignals && result.signals.map((signal: any, i: number) => (
              <Card key={i} variant={signal.severity === 'critical' ? 'danger' : 'caution'} style={styles.signalCard}>
                <SafeText variant="body">{signal.description}</SafeText>
                <SafeText variant="caption" color="#616161">
                  Category: {signal.category} • Severity: {signal.severity}
                </SafeText>
              </Card>
            ))}
          </>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <BigButton
            title="Go Home"
            onPress={() => router.replace('/(tabs)')}
            accessibilityLabel="Return to home screen"
          />
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

function QuestionCard({ icon, title, summary, detail, level }: {
  icon: string; title: string; summary: string; detail: string; level: string;
}) {
  const borderColor = level === 'danger' ? '#B71C1C' : level === 'caution' ? '#BF360C' : '#1B5E20';

  return (
    <Card style={[styles.questionCard, { borderLeftColor: borderColor, borderLeftWidth: 4 }]}>
      <SafeText style={styles.questionIcon}>{icon}</SafeText>
      <SafeText variant="h3">{title}</SafeText>
      <SafeText variant="bodyLarge" style={styles.questionSummary}>{summary}</SafeText>
      <SafeText variant="body" color="#616161">{detail}</SafeText>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingBottom: 48 },
  banner: {
    padding: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  bannerIcon: { fontSize: 64, marginBottom: 8 },
  bannerDesc: { marginTop: 8, marginBottom: 16 },
  sectionTitle: { padding: 24, paddingBottom: 8 },
  questionCard: { marginHorizontal: 24, marginBottom: 12 },
  questionIcon: { fontSize: 32, marginBottom: 4 },
  questionSummary: { marginTop: 4, marginBottom: 4, fontWeight: '600' },
  signalsToggle: { paddingHorizontal: 24, paddingVertical: 16 },
  signalCard: { marginHorizontal: 24, marginBottom: 8 },
  actions: { padding: 24, paddingTop: 16 },
});
