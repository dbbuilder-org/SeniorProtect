import React from 'react';
import { View, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { SafeText } from './SafeText';

const COLORS = {
  danger: { bg: '#FFEBEE', text: '#B71C1C', icon: '#C62828' },
  neutral: { bg: '#FFFFFF', text: '#212121', secondary: '#616161', border: '#E0E0E0', surface: '#F5F5F5' },
};

const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
const TOUCH_TARGET = 60;

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  style?: any;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: KeyboardTypeOptions;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  secureTextEntry = false,
  style,
  autoCapitalize = 'sentences',
  keyboardType = 'default',
}) => {
  return (
    <View style={[styles.container, style]}>
      <SafeText variant="body" style={styles.label}>
        {label}
      </SafeText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.neutral.secondary}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        accessibilityLabel={label}
        accessibilityHint={placeholder}
        style={[
          styles.input,
          multiline && styles.multiline,
          error && styles.inputError,
        ]}
      />
      {error && (
        <SafeText variant="caption" color={COLORS.danger.text} style={styles.error}>
          {error}
        </SafeText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  label: {
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  input: {
    minHeight: TOUCH_TARGET,
    fontSize: 18,
    color: COLORS.neutral.text,
    backgroundColor: COLORS.neutral.bg,
    borderWidth: 2,
    borderColor: COLORS.neutral.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: COLORS.danger.icon,
  },
  error: {
    marginTop: SPACING.sm,
  },
});
