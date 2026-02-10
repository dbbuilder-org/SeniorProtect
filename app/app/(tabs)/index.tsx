import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Pressable, RefreshControl, FlatList } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { SafeText } from '../../components/ui/SafeText';
import { BigButton } from '../../components/ui/BigButton';
import { api } from '../../lib/api';
import Ionicons from '@expo/vector-icons/Ionicons';

const CATEGORIES = [
  { key: '', label: 'All' },
  { key: 'banking', label: 'Banking' },
  { key: 'government', label: 'Government' },
  { key: 'healthcare', label: 'Healthcare' },
  { key: 'shopping', label: 'Shopping' },
  { key: 'social', label: 'Social' },
  { key: 'email', label: 'Email' },
  { key: 'utilities', label: 'Utilities' },
];

interface Site {
  id: string;
  name: string;
  domain: string;
  category: string;
  description: string;
  verified: boolean;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const [sites, setSites] = useState<Site[]>([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSites = useCallback(async (cat: string) => {
    try {
      const data = await api.getSites(cat || undefined);
      setSites(data);
    } catch {
      setSites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadSites(category);
  }, [category, loadSites]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSites(category);
    setRefreshing(false);
  }, [category, loadSites]);

  const firstName = user?.displayName?.split(' ')[0] || '';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="shield-half" size={32} color="#C62828" />
        <SafeText variant="h1" style={styles.greeting}>
          {firstName ? `Hi, ${firstName}!` : 'SeniorProtect'}
        </SafeText>
      </View>

      {/* Category pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.pillScroll}
        contentContainerStyle={styles.pillContainer}
      >
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat.key}
            style={[styles.pill, category === cat.key && styles.pillActive]}
            onPress={() => setCategory(cat.key)}
            accessibilityLabel={`Filter by ${cat.label}`}
            accessibilityRole="button"
          >
            <SafeText
              variant="body"
              color={category === cat.key ? '#FFFFFF' : '#1565C0'}
              style={styles.pillText}
            >
              {cat.label}
            </SafeText>
          </Pressable>
        ))}
      </ScrollView>

      {/* Sites list */}
      <FlatList
        data={sites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.sitesList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.siteCard}>
            <View style={styles.siteInfo}>
              <SafeText variant="h3">{item.name}</SafeText>
              <SafeText variant="body" color="#1565C0">{item.domain}</SafeText>
            </View>
            {item.verified && (
              <Ionicons name="shield-checkmark" size={24} color="#2E7D32" />
            )}
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <SafeText variant="body" color="#616161" align="center" style={styles.emptyText}>
              Loading sites...
            </SafeText>
          ) : (
            <SafeText variant="body" color="#616161" align="center" style={styles.emptyText}>
              No sites found
            </SafeText>
          )
        }
      />

      {/* Action buttons */}
      <View style={styles.actions}>
        <BigButton
          title="Check a Text"
          icon={<Ionicons name="chatbubble-outline" size={22} color="#FFFFFF" />}
          onPress={() => router.navigate('/(tabs)/check-text')}
          style={styles.actionBtn}
          accessibilityLabel="Check a text message for scams"
        />
        <BigButton
          title="Check an Email"
          icon={<Ionicons name="mail-outline" size={22} color="#FFFFFF" />}
          onPress={() => router.navigate('/(tabs)/check-email')}
          style={styles.actionBtn}
          accessibilityLabel="Check an email for scams"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  greeting: { flex: 1 },

  pillScroll: { flexGrow: 0 },
  pillContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    minHeight: 48,
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: '#1565C0',
  },
  pillText: {
    fontWeight: '600',
  },

  sitesList: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  siteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    minHeight: 64,
  },
  siteInfo: { flex: 1 },

  emptyText: { paddingTop: 48 },

  actions: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    marginTop: -12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionBtn: { marginBottom: 0 },
});
