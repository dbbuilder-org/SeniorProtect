import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Tab {
  key: string;
  label: string;
  icon?: string;
  ionicon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

const TABS: Tab[] = [
  { key: '/', ionicon: 'shield-half', iconColor: '#C62828', label: 'Status' },
  { key: '/(tabs)/checker', icon: '\u{1F50D}', label: 'Checker' },
  { key: '/(tabs)/sites', ionicon: 'shield-checkmark', iconColor: '#2E7D32', label: 'Sites' },
  { key: '/(tabs)/settings', icon: '\u2699\uFE0F', label: 'Settings' },
];

export function BottomNav() {
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => (
        <Pressable
          key={tab.key}
          style={styles.tab}
          onPress={() => router.replace(tab.key)}
          accessibilityLabel={tab.label}
          accessibilityRole="button"
        >
          {tab.ionicon ? (
            <Ionicons name={tab.ionicon} size={24} color={tab.iconColor} />
          ) : (
            <Text style={styles.icon}>{tab.icon}</Text>
          )}
          <Text style={styles.label}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    height: 80,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  icon: { fontSize: 24 },
  label: { fontSize: 12, fontWeight: '600', color: '#616161', paddingBottom: 4, textAlign: 'center', lineHeight: 15 },
});
