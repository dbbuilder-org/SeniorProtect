import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { SafeText } from '../../components/ui/SafeText';
import { BigButton } from '../../components/ui/BigButton';
import { Card } from '../../components/ui/Card';

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SafeText variant="h1">Settings</SafeText>

        <Card style={styles.card}>
          <SafeText variant="h3">Account</SafeText>
          <View style={styles.row}>
            <SafeText color="#616161">Name</SafeText>
            <SafeText>{user?.displayName || 'Unknown'}</SafeText>
          </View>
          <View style={styles.row}>
            <SafeText color="#616161">Email</SafeText>
            <SafeText>{user?.email || 'Unknown'}</SafeText>
          </View>
        </Card>

        <Card style={styles.card}>
          <SafeText variant="h3">About</SafeText>
          <View style={styles.row}>
            <SafeText color="#616161">Version</SafeText>
            <SafeText>1.0.0</SafeText>
          </View>
          <SafeText variant="caption" color="#616161" style={styles.about}>
            SeniorProtect helps you stay safe from online scams, phishing, and fraud.
            We check emails, websites, and text messages to identify potential threats.
          </SafeText>
        </Card>

        <BigButton
          title="Sign Out"
          onPress={logout}
          variant="outline"
          accessibilityLabel="Sign out of your account"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24 },
  card: { marginTop: 16, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  about: { marginTop: 8 },
});
