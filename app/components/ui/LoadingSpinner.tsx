import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeText } from './SafeText';

const COLORS = {
  primary: { bg: '#1565C0', text: '#FFFFFF', light: '#E3F2FD' },
  neutral: { text: '#212121' },
};

const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Checking...'
}) => {
  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <ActivityIndicator size="large" color={COLORS.primary.bg} />
      <SafeText variant="bodyLarge" style={styles.message}>
        {message}
      </SafeText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  message: {
    marginTop: SPACING.md,
    textAlign: 'center',
  },
});
