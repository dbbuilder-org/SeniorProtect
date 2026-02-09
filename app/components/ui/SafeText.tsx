import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';

const TYPOGRAPHY = {
  body: 18,
  bodyLarge: 20,
  h1: 32,
  h2: 26,
  h3: 22,
  caption: 16,
  button: 20
};

const COLORS = {
  neutral: { bg: '#FFFFFF', text: '#212121', secondary: '#616161', border: '#E0E0E0', surface: '#F5F5F5' },
};

interface SafeTextProps {
  children: React.ReactNode;
  variant?: 'body' | 'bodyLarge' | 'h1' | 'h2' | 'h3' | 'caption' | 'button';
  color?: string;
  style?: TextStyle | TextStyle[];
  align?: 'left' | 'center' | 'right';
}

export const SafeText: React.FC<SafeTextProps> = ({
  children,
  variant = 'body',
  color = COLORS.neutral.text,
  style,
  align = 'left',
}) => {
  const getFontSize = () => TYPOGRAPHY[variant];
  const getLineHeight = () => getFontSize() * 1.5;

  const getVariantStyles = (): TextStyle => {
    const fontSize = getFontSize();
    const lineHeight = getLineHeight();

    switch (variant) {
      case 'h1':
        return { fontSize, lineHeight, fontWeight: '700' };
      case 'h2':
        return { fontSize, lineHeight, fontWeight: '600' };
      case 'h3':
        return { fontSize, lineHeight, fontWeight: '600' };
      case 'button':
        return { fontSize, lineHeight, fontWeight: '600' };
      case 'bodyLarge':
        return { fontSize, lineHeight, fontWeight: '400' };
      case 'caption':
        return { fontSize, lineHeight, fontWeight: '400' };
      case 'body':
      default:
        return { fontSize, lineHeight, fontWeight: '400' };
    }
  };

  return (
    <RNText
      accessibilityRole="text"
      style={[
        styles.text,
        getVariantStyles(),
        { color, textAlign: align },
        style,
      ]}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    // Base text styles
  },
});
