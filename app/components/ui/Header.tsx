import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeText } from './SafeText';

const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <SafeText variant="h1" style={styles.title}>
        {title}
      </SafeText>
      {subtitle && (
        <SafeText variant="body" style={styles.subtitle}>
          {subtitle}
        </SafeText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  title: {
    marginBottom: SPACING.sm,
  },
  subtitle: {
    // Additional subtitle styles can be added here if needed
  },
});
