import React from 'react';
import { Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme';

interface TabBarIconProps {
  name: string;
  focused: boolean;
  size?: number;
}

const iconMap: Record<string, string> = {
  Home: 'home-variant',
  Occasions: 'calendar-star',
  Orders: 'package-variant-closed',
  Wishlist: 'heart',
  Profile: 'account-circle',
};

export const TabBarIcon: React.FC<TabBarIconProps> = ({
  name,
  focused,
  size = 24,
}) => (
  <MaterialCommunityIcons
    name={iconMap[name] ?? 'circle'}
    size={size}
    color={focused ? colors.skyBlue : colors.textMuted}
  />
);

export const TabBarLabel: React.FC<{ label: string; focused: boolean }> = ({
  label,
  focused,
}) => (
  <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
);

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 2,
  },
  labelFocused: {
    color: colors.skyBlue,
    fontWeight: '600',
  },
});
