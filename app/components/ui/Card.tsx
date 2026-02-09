import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

const COLORS = {
  safe: { bg: '#E8F5E9', text: '#1B5E20', icon: '#2E7D32' },
  caution: { bg: '#FFF3E0', text: '#BF360C', icon: '#E65100' },
  danger: { bg: '#FFEBEE', text: '#B71C1C', icon: '#C62828' },
  neutral: { bg: '#FFFFFF', text: '#212121', secondary: '#616161', border: '#E0E0E0', surface: '#F5F5F5' },
};

const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

interface CardProps {
  children: React.ReactNode;
  variant?: 'safe' | 'caution' | 'danger';
  style?: ViewStyle | ViewStyle[];
}

export const Card: React.FC<CardProps> = ({ children, variant, style }) => {
  const getBorderColor = () => {
    if (!variant) return undefined;

    switch (variant) {
      case 'safe':
        return COLORS.safe.icon;
      case 'caution':
        return COLORS.caution.icon;
      case 'danger':
        return COLORS.danger.icon;
      default:
        return undefined;
    }
  };

  const borderColor = getBorderColor();

  return (
    <View
      style={[
        styles.card,
        borderColor && { borderLeftWidth: 4, borderLeftColor: borderColor },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.neutral.bg,
    borderRadius: 12,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
