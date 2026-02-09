import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../../components/ui/SafeText';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { api } from '../../lib/api';

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

export default function SitesScreen() {
  const [sites, setSites] = useState<Site[]>([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSites();
  }, [category]);

  async function loadSites() {
    setLoading(true);
    try {
      if (search) {
        const data = await api.searchSites(search, category || undefined);
        setSites(data);
      } else {
        const data = await api.getSites(category || undefined);
        setSites(data);
      }
    } catch {
      setSites([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length >= 2 || search.length === 0) {
        loadSites();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SafeText variant="h1">Trusted Sites</SafeText>
        <SafeText variant="body" color="#616161">
          These websites have been verified as safe
        </SafeText>
      </View>

      <TextInput
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
        placeholder="Search sites..."
        placeholderTextColor="#9E9E9E"
        accessibilityLabel="Search trusted sites"
      />

      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        style={styles.pills}
        contentContainerStyle={styles.pillsContent}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.pill, category === item.key && styles.pillActive]}
            onPress={() => setCategory(item.key)}
            accessibilityLabel={`Filter by ${item.label}`}
            accessibilityRole="button"
          >
            <SafeText
              variant="caption"
              color={category === item.key ? '#FFFFFF' : '#1565C0'}
            >
              {item.label}
            </SafeText>
          </Pressable>
        )}
      />

      {loading ? (
        <LoadingSpinner message="Loading sites..." />
      ) : (
        <FlatList
          data={sites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.siteCard}>
              <View style={styles.siteRow}>
                <View style={styles.siteInfo}>
                  <SafeText variant="h3">{item.name}</SafeText>
                  <SafeText variant="body" color="#1565C0">{item.domain}</SafeText>
                  <SafeText variant="caption" color="#616161">{item.description}</SafeText>
                </View>
                {item.verified && (
                  <SafeText style={styles.verified}>✅</SafeText>
                )}
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <SafeText color="#616161" align="center">No sites found</SafeText>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 24, paddingBottom: 8 },
  searchInput: {
    marginHorizontal: 24,
    height: 60,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    backgroundColor: '#F5F5F5',
  },
  pills: { maxHeight: 56, marginTop: 8 },
  pillsContent: { paddingHorizontal: 24, gap: 8 },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1565C0',
    minHeight: 40,
    justifyContent: 'center',
  },
  pillActive: { backgroundColor: '#1565C0' },
  list: { padding: 24, paddingTop: 8 },
  siteCard: { marginBottom: 8 },
  siteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 72,
  },
  siteInfo: { flex: 1 },
  verified: { fontSize: 24, marginLeft: 8 },
  empty: { padding: 48 },
});
