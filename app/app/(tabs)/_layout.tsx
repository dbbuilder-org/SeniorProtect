import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

function TabIcon({ name, color, focused }: { name: keyof typeof Ionicons.glyphMap; color: string; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}>
      <Ionicons name={name} size={22} color={color} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarStyle: {
          backgroundColor: '#3A3A3C',
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Status',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="shield-half" color={focused ? '#C62828' : '#FFFFFF'} focused={focused} />
          ),
          tabBarLabel: 'Status',
          tabBarAccessibilityLabel: 'Status dashboard',
        }}
      />
      <Tabs.Screen
        name="checker"
        options={{
          title: 'Checker',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}>
              <MaterialCommunityIcons name="magnify" size={24} color={focused ? '#1565C0' : '#FFFFFF'} />
            </View>
          ),
          tabBarLabel: 'Checker',
          tabBarAccessibilityLabel: 'Safety Checker',
        }}
      />
      <Tabs.Screen
        name="sites"
        options={{
          title: 'Sites',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="shield-checkmark" color={focused ? '#2E7D32' : '#FFFFFF'} focused={focused} />
          ),
          tabBarLabel: 'Sites',
          tabBarAccessibilityLabel: 'Trusted websites directory',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="settings" color={focused ? '#7B1FA2' : '#FFFFFF'} focused={focused} />
          ),
          tabBarLabel: 'Settings',
          tabBarAccessibilityLabel: 'App settings',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 28,
    borderRadius: 14,
  },
  iconWrapFocused: {
    backgroundColor: '#FFFFFF',
  },
});
