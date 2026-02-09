import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';

const COLORS = {
  safe: { bg: '#E8F5E9', text: '#1B5E20', icon: '#2E7D32' },
  caution: { bg: '#FFF3E0', text: '#BF360C', icon: '#E65100' },
  danger: { bg: '#FFEBEE', text: '#B71C1C', icon: '#C62828' },
  primary: { bg: '#1565C0', text: '#FFFFFF', light: '#E3F2FD' },
  neutral: { bg: '#FFFFFF', text: '#212121', secondary: '#616161', border: '#E0E0E0', surface: '#F5F5F5' },
};

const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
const TOUCH_TARGET = 60;

interface BigButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'safe' | 'caution' | 'danger' | 'outline';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: any;
}

export const BigButton: React.FC<BigButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  accessibilityLabel,
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: COLORS.primary.bg, textColor: COLORS.primary.text };
      case 'safe':
        return { backgroundColor: COLORS.safe.icon, textColor: COLORS.neutral.bg };
      case 'caution':
        return { backgroundColor: COLORS.caution.icon, textColor: COLORS.neutral.bg };
      case 'danger':
        return { backgroundColor: COLORS.danger.icon, textColor: COLORS.neutral.bg };
      case 'outline':
        return {
          backgroundColor: COLORS.neutral.bg,
          textColor: COLORS.primary.bg,
          borderWidth: 2,
          borderColor: COLORS.primary.bg
        };
      default:
        return { backgroundColor: COLORS.primary.bg, textColor: COLORS.primary.text };
    }
  };

  const variantStyles = getVariantStyles();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={[
        styles.button,
        { backgroundColor: variantStyles.backgroundColor },
        variantStyles.borderWidth && {
          borderWidth: variantStyles.borderWidth,
          borderColor: variantStyles.borderColor
        },
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.textColor} size="large" />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.text, { color: variantStyles.textColor }]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: TOUCH_TARGET,
    width: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: SPACING.sm,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
