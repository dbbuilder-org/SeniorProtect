import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { SafeText } from '../../components/ui/SafeText';
import { BigButton } from '../../components/ui/BigButton';
import { api } from '../../lib/api';
import { getFavorites } from '../../lib/favorites';
import Ionicons from '@expo/vector-icons/Ionicons';

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  banking: { bg: '#BBDEFB', text: '#0D47A1' },
  government: { bg: '#FFCDD2', text: '#B71C1C' },
  healthcare: { bg: '#C8E6C9', text: '#1B5E20' },
  shopping: { bg: '#FFE0B2', text: '#E65100' },
  social: { bg: '#E1BEE7', text: '#6A1B9A' },
  email: { bg: '#B3E5FC', text: '#01579B' },
  utilities: { bg: '#CFD8DC', text: '#263238' },
  transportation: { bg: '#FFE0B2', text: '#E65100' },
};

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
  const [favoriteSites, setFavoriteSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        setLoading(true);
        try {
          const [allSites, favIds] = await Promise.all([
            api.getSites(),
            getFavorites(),
          ]);
          if (cancelled) return;
          const favSet = new Set(favIds);
          setFavoriteSites(allSites.filter((s: Site) => favSet.has(s.id)));
        } catch {
          if (!cancelled) setFavoriteSites([]);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
      return () => { cancelled = true; };
    }, [])
  );

  const firstName = user?.displayName?.split(' ')[0] || '';

  function renderFavoriteSite({ item }: { item: Site }) {
    const colors = CATEGORY_COLORS[item.category] || { bg: '#CFD8DC', text: '#263238' };
    return (
      <View style={[styles.favCard, { backgroundColor: colors.bg }]}>
        <Image
          source={{ uri: `https://www.google.com/s2/favicons?domain=${item.domain}&sz=32` }}
          style={styles.favFavicon}
        />
        <View style={styles.favInfo}>
          <SafeText variant="h3" color={colors.text}>{item.name}</SafeText>
          <SafeText variant="caption" color={colors.text + 'CC'}>{item.domain}</SafeText>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="shield-half" size={32} color="#C62828" />
        <SafeText variant="h1" style={styles.greeting}>
          {firstName ? `Hi, ${firstName}!` : 'SeniorProtect'}
        </SafeText>
      </View>

      <SafeText variant="body" color="#616161" style={styles.subtitle}>
        Your favorite trusted sites
      </SafeText>

      {/* Favorites list */}
      <FlatList
        data={favoriteSites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.favList}
        renderItem={renderFavoriteSite}
        ListEmptyComponent={
          loading ? (
            <SafeText variant="body" color="#616161" align="center" style={styles.emptyText}>
              Loading...
            </SafeText>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="star-outline" size={48} color="#BDBDBD" />
              <SafeText variant="body" color="#616161" align="center" style={styles.emptyLabel}>
                Add favorites on the Sites tab
              </SafeText>
              <Pressable
                style={styles.goToSitesBtn}
                onPress={() => router.navigate('/(tabs)/sites')}
                accessibilityLabel="Go to Sites tab"
                accessibilityRole="button"
              >
                <SafeText variant="body" color="#1565C0" style={styles.goToSitesText}>
                  Go to Sites
                </SafeText>
              </Pressable>
            </View>
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
    paddingBottom: 4,
    gap: 12,
  },
  greeting: { flex: 1 },

  subtitle: {
    paddingHorizontal: 24,
    paddingBottom: 12,
  },

  favList: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  favCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    minHeight: 68,
  },
  favFavicon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 14,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  favInfo: { flex: 1 },

  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: { paddingTop: 48 },
  emptyLabel: { marginTop: 4 },
  goToSitesBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    minHeight: 52,
    justifyContent: 'center',
  },
  goToSitesText: { fontWeight: '600' },

  actions: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionBtn: { marginBottom: 0 },
});
