import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, Pressable, TextInput, Text, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { SafeText } from '../../components/ui/SafeText';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { api } from '../../lib/api';
import { getFavorites, toggleFavorite } from '../../lib/favorites';
import Ionicons from '@expo/vector-icons/Ionicons';

const CATEGORIES = [
  { key: '', label: 'All Categories' },
  { key: 'banking', label: 'Banking' },
  { key: 'government', label: 'Government' },
  { key: 'healthcare', label: 'Healthcare' },
  { key: 'shopping', label: 'Shopping' },
  { key: 'social', label: 'Social' },
  { key: 'email', label: 'Email' },
  { key: 'utilities', label: 'Utilities' },
  { key: 'transportation', label: 'Transportation' },
];

const CATEGORY_COLORS: Record<string, string> = {
  banking: '#1565C0',
  government: '#B71C1C',
  healthcare: '#2E7D32',
  shopping: '#E65100',
  social: '#7B1FA2',
  email: '#0277BD',
  utilities: '#455A64',
  transportation: '#F57C00',
};

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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedLabel = CATEGORIES.find((c) => c.key === category)?.label || 'All Categories';

  async function loadSites(searchText: string, cat: string) {
    setLoading(true);
    try {
      if (searchText) {
        const data = await api.searchSites(searchText, cat || undefined);
        setSites(data);
      } else {
        const data = await api.getSites(cat || undefined);
        setSites(data);
      }
    } catch {
      setSites([]);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getFavorites().then(setFavorites);
    }, [])
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length >= 2 || search.length === 0) {
        loadSites(search, category);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  const sortedSites = useMemo(() => {
    const favSet = new Set(favorites);
    return [...sites].sort((a, b) => {
      const aFav = favSet.has(a.id) ? 0 : 1;
      const bFav = favSet.has(b.id) ? 0 : 1;
      return aFav - bFav;
    });
  }, [sites, favorites]);

  async function handleToggleFavorite(id: string) {
    const updated = await toggleFavorite(id);
    setFavorites(updated);
  }

  function renderSite({ item }: { item: Site }) {
    const isFav = favorites.includes(item.id);
    const catColor = CATEGORY_COLORS[item.category] || '#455A64';
    const catLabel = CATEGORIES.find((c) => c.key === item.category)?.label || item.category;

    return (
      <Pressable
        style={styles.siteRow}
        onPress={() => handleToggleFavorite(item.id)}
        accessibilityLabel={`${item.name}, ${catLabel}. ${isFav ? 'Favorited' : 'Not favorited'}. Tap to toggle favorite.`}
        accessibilityRole="button"
      >
        <Image
          source={{ uri: `https://www.google.com/s2/favicons?domain=${item.domain}&sz=32` }}
          style={styles.favicon}
        />
        <View style={styles.siteInfo}>
          <SafeText variant="h3" style={styles.siteName}>{item.name}</SafeText>
          <SafeText variant="caption" color="#616161">{item.domain}</SafeText>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: catColor + '18' }]}>
          <Text style={[styles.categoryText, { color: catColor }]}>{catLabel}</Text>
        </View>
        <Ionicons
          name={isFav ? 'star' : 'star-outline'}
          size={26}
          color={isFav ? '#F57C00' : '#BDBDBD'}
          style={styles.starIcon}
        />
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Ionicons name="shield-checkmark" size={32} color="#2E7D32" style={styles.headerIcon} />
          <SafeText variant="h1">Sites</SafeText>
        </View>
        <SafeText variant="body" color="#616161">
          Tap the star to add favorites
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

      {/* Category Dropdown */}
      <Pressable
        style={styles.dropdown}
        onPress={() => setDropdownOpen(true)}
        accessibilityLabel={`Category filter: ${selectedLabel}`}
        accessibilityRole="button"
      >
        <SafeText variant="body" color="#1565C0">{selectedLabel}</SafeText>
        <Ionicons name="chevron-down" size={20} color="#1565C0" />
      </Pressable>

      <Modal
        visible={dropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setDropdownOpen(false)}>
          <View style={styles.modalContent}>
            <SafeText variant="h3" style={styles.modalTitle}>Select Category</SafeText>
            {CATEGORIES.map((item) => (
              <Pressable
                key={item.key}
                style={[styles.modalOption, category === item.key && styles.modalOptionActive]}
                onPress={() => {
                  setCategory(item.key);
                  setDropdownOpen(false);
                }}
                accessibilityLabel={item.label}
                accessibilityRole="button"
              >
                <SafeText
                  variant="body"
                  color={category === item.key ? '#1565C0' : '#212121'}
                >
                  {item.label}
                </SafeText>
                {category === item.key && (
                  <Ionicons name="checkmark" size={22} color="#1565C0" />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {loading ? (
        <LoadingSpinner message="Loading sites..." />
      ) : (
        <FlatList
          data={sortedSites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderSite}
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
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { fontSize: 32, marginRight: 12 },
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
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginTop: 12,
    marginBottom: 8,
    height: 52,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#1565C0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    maxHeight: '70%',
  },
  modalTitle: {
    padding: 16,
    paddingBottom: 8,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    minHeight: 52,
  },
  modalOptionActive: {
    backgroundColor: '#E3F2FD',
  },
  list: { padding: 24, paddingTop: 8 },
  siteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    minHeight: 64,
  },
  favicon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: '#E0E0E0',
  },
  siteInfo: { flex: 1 },
  siteName: { marginBottom: 2 },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  starIcon: {
    marginLeft: 10,
  },
  empty: { padding: 48 },
});
