import { Tabs } from 'expo-router';
import { Text, StyleSheet } from 'react-native';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    home: '🛡️',
    sites: '✅',
    settings: '⚙️',
  };
  return (
    <Text style={[styles.icon, focused && styles.iconFocused]}>
      {icons[name] || '📋'}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1565C0',
        tabBarInactiveTintColor: '#616161',
        tabBarLabelStyle: { fontSize: 16, fontWeight: '600', paddingBottom: 4 },
        tabBarStyle: { height: 80, paddingTop: 8 },
        tabBarItemStyle: { minHeight: 60 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
          tabBarAccessibilityLabel: 'Home screen',
        }}
      />
      <Tabs.Screen
        name="sites"
        options={{
          title: 'Trusted Sites',
          tabBarIcon: ({ focused }) => <TabIcon name="sites" focused={focused} />,
          tabBarAccessibilityLabel: 'Trusted websites directory',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon name="settings" focused={focused} />,
          tabBarAccessibilityLabel: 'App settings',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: { fontSize: 24 },
  iconFocused: { fontSize: 28 },
});
