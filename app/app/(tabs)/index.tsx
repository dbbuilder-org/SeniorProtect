import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text, RefreshControl, LayoutAnimation, Platform, UIManager } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { SafeText } from '../../components/ui/SafeText';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { BigButton } from '../../components/ui/BigButton';
import { api } from '../../lib/api';
import { shareCheckResult, shareSafetyTip } from '../../lib/share';
import Ionicons from '@expo/vector-icons/Ionicons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DAILY_TIPS = [
  'Never share your password with anyone, even if they say they\'re from your bank.',
  'If an offer sounds too good to be true, it probably is. Take a moment to verify.',
  'Always check the sender\'s email address carefully \u2014 scammers often use addresses that look similar to real ones.',
  'Don\'t click links in unexpected texts or emails. Go directly to the website instead.',
  'Your bank will never ask for your PIN or full password by phone or email.',
  'Be cautious of urgent messages that pressure you to act immediately.',
  'When in doubt, ask a trusted friend or family member before responding to a suspicious message.',
];

const TYPE_IONICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  email: 'mail-outline',
  url: 'globe-outline',
  text: 'chatbubble-outline',
};

const TYPE_LABEL: Record<string, string> = {
  email: 'Email',
  url: 'Website',
  text: 'Text',
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface Stats {
  total: number;
  safe: number;
  caution: number;
  danger: number;
  threatsCaught: number;
}

interface Check {
  id: string;
  content_type: string;
  threat_level: 'safe' | 'caution' | 'danger';
  summary: string;
  subject?: string;
  created_at: string;
}

const SAMPLE_CHECKS: Check[] = [
  {
    id: 'sample-1',
    content_type: 'email',
    threat_level: 'danger',
    subject: 'Amazon',
    summary: 'Fake Amazon order confirmation requesting payment details',
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: 'sample-2',
    content_type: 'url',
    threat_level: 'safe',
    subject: 'Chase',
    summary: 'chase.com — verified official bank website',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'sample-3',
    content_type: 'text',
    threat_level: 'caution',
    subject: 'Gift Card',
    summary: 'Message claims you won a gift card — likely a phishing attempt',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: 'sample-4',
    content_type: 'email',
    threat_level: 'safe',
    subject: 'Medicare',
    summary: 'Newsletter from Medicare.gov — legitimate government sender',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'sample-5',
    content_type: 'url',
    threat_level: 'danger',
    subject: 'Amazon',
    summary: 'amaz0n-secure-login.xyz — fake login page impersonating Amazon',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
];

function getCheckLabel(check: Check): string {
  const type = TYPE_LABEL[check.content_type] || 'Check';
  if (check.subject) return `${type} - ${check.subject}`;
  // Try to extract a keyword from the summary
  const words = check.summary.split(/[\s—\-]+/).filter((w) => w.length > 3);
  const keyword = words[0] || '';
  return keyword ? `${type} - ${keyword}` : type;
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ total: 12, safe: 8, caution: 2, danger: 2, threatsCaught: 4 });
  const [checks, setChecks] = useState<Check[]>(SAMPLE_CHECKS);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const todayTip = DAILY_TIPS[new Date().getDay()];

  const toggleCard = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const loadData = useCallback(async () => {
    try {
      const [statsData, checksData] = await Promise.all([
        api.getUserStats().catch(() => null),
        api.getRecentChecks(10).catch(() => null),
      ]);
      if (statsData) setStats(statsData);
      if (checksData) setChecks(checksData);
    } catch {
      // Graceful fallback — keep defaults
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header bar with shading */}
      <View style={styles.headerBar}>
        <View style={styles.headerRow}>
          <Ionicons name="shield-half" size={28} color="#C62828" />
          <SafeText variant="h2" style={styles.headerTitle}>
            Hello{user?.displayName ? `, ${user.displayName}` : ''}!
          </SafeText>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
            <SafeText variant="h2" color="#1565C0" align="center">{stats.total}</SafeText>
            <SafeText variant="caption" color="#1565C0" align="center">Checks</SafeText>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
            <SafeText variant="h2" color="#E65100" align="center">{stats.threatsCaught}</SafeText>
            <SafeText variant="caption" color="#E65100" align="center">Caught</SafeText>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
            <SafeText variant="h2" color="#2E7D32" align="center">{stats.safe}</SafeText>
            <SafeText variant="caption" color="#2E7D32" align="center">Safe</SafeText>
          </View>
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Recent Checks */}
        {checks.length === 0 ? (
          <Card>
            <SafeText variant="body" color="#616161" align="center">
              No checks yet. Tap "Run a Check" to get started!
            </SafeText>
          </Card>
        ) : (
          checks.map((check) => {
            const isOpen = expandedIds.has(check.id);
            return (
              <Pressable key={check.id} onPress={() => toggleCard(check.id)}>
                <View style={styles.checkCard}>
                  <View style={styles.checkRow}>
                    <Ionicons
                      name={TYPE_IONICON[check.content_type] || 'document-outline'}
                      size={20}
                      color="#616161"
                    />
                    <SafeText variant="caption" color="#424242" style={styles.checkLabel}>
                      {getCheckLabel(check)}
                    </SafeText>
                    <View style={styles.checkRight}>
                      <Badge level={check.threat_level} compact />
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation?.();
                          shareCheckResult(check);
                        }}
                        accessibilityLabel="Share this check result"
                        accessibilityRole="button"
                        style={styles.shareBtn}
                        hitSlop={8}
                      >
                        <Ionicons name="share-outline" size={18} color="#1565C0" />
                      </Pressable>
                      <Ionicons
                        name={isOpen ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color="#9E9E9E"
                      />
                    </View>
                  </View>
                  {isOpen && (
                    <View style={styles.checkExpanded}>
                      <SafeText variant="caption" color="#424242">
                        {check.summary}
                      </SafeText>
                      <SafeText variant="caption" color="#9E9E9E" style={styles.checkTime}>
                        {timeAgo(check.created_at)}
                      </SafeText>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>

      {/* Bottom: anchored actions + tip */}
      <View style={styles.bottomSection}>
        <View style={styles.actionsRow}>
          <BigButton
            title="Run a Check"
            icon={<Ionicons name="search-outline" size={20} color="#FFFFFF" />}
            onPress={() => router.push('/(tabs)/checker')}
            style={styles.actionBtn}
          />
          <BigButton
            title="Emergency Help"
            icon={<Ionicons name="alert-circle-outline" size={20} color="#FFFFFF" />}
            variant="danger"
            onPress={() => router.push('/emergency')}
            style={styles.actionBtn}
          />
        </View>

        <Card style={styles.tipCard}>
          <Pressable
            onPress={() => shareSafetyTip(todayTip)}
            accessibilityLabel="Share this tip"
            accessibilityRole="button"
            style={styles.shareTipBtn}
          >
            <Ionicons name="share-outline" size={22} color="#1565C0" />
          </Pressable>
          <SafeText variant="body" style={styles.tipText}>{todayTip}</SafeText>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  // Header bar
  headerBar: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  headerTitle: { flex: 1 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },

  // Scrollable checks
  scrollArea: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 8 },

  // Check cards
  checkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkLabel: { flex: 1 },
  checkRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shareBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkExpanded: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  checkTime: { marginTop: 4 },

  // Bottom: anchored actions + tip
  bottomSection: { paddingHorizontal: 16, paddingBottom: 0, paddingTop: 4, gap: 6 },
  actionsRow: { gap: 12 },
  actionBtn: { marginBottom: 0 },

  // Tip
  tipCard: { padding: 14, marginBottom: 0 },
  tipText: { paddingRight: 36 },
  shareTipBtn: { position: 'absolute', top: 12, right: 12, padding: 4, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});
