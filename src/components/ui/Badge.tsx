import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

interface BadgeProps {
  label: string;
  variant?: 'purple' | 'pink' | 'cream' | 'success' | 'warning';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'purple',
  style,
}) => (
  <View style={[styles.base, styles[variant], style]}>
    <Text style={[styles.text, styles[`text_${variant}`]]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  purple: {
    backgroundColor: colors.purpleLight,
  },
  pink: {
    backgroundColor: colors.pinkLight,
  },
  cream: {
    backgroundColor: colors.creamDark,
  },
  success: {
    backgroundColor: colors.successLight,
  },
  warning: {
    backgroundColor: colors.warningLight,
  },
  text: {
    ...typography.caption,
    fontSize: 11,
    textTransform: 'none',
    letterSpacing: 0,
  },
  text_purple: { color: colors.purple },
  text_pink: { color: colors.navy },
  text_cream: { color: colors.textSecondary },
  text_success: { color: colors.success },
  text_warning: { color: '#B8860B' },
});
