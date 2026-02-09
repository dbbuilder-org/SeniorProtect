import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeText } from './SafeText';

const COLORS = {
  safe: { bg: '#E8F5E9', text: '#1B5E20', icon: '#2E7D32' },
  caution: { bg: '#FFF3E0', text: '#BF360C', icon: '#E65100' },
  danger: { bg: '#FFEBEE', text: '#B71C1C', icon: '#C62828' },
};

const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

interface BadgeProps {
  level: 'safe' | 'caution' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({ level }) => {
  const getLabel = () => {
    switch (level) {
      case 'safe':
        return 'Safe';
      case 'caution':
        return 'Caution';
      case 'danger':
        return 'Danger';
    }
  };

  const getColors = () => {
    switch (level) {
      case 'safe':
        return { bg: COLORS.safe.bg, text: COLORS.safe.text };
      case 'caution':
        return { bg: COLORS.caution.bg, text: COLORS.caution.text };
      case 'danger':
        return { bg: COLORS.danger.bg, text: COLORS.danger.text };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[styles.badge, { backgroundColor: colors.bg }]}
      accessibilityRole="text"
      accessibilityLabel={`Threat level: ${getLabel()}`}
    >
      <SafeText variant="bodyLarge" color={colors.text} style={styles.text}>
        {getLabel()}
      </SafeText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '700',
  },
});
