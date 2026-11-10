import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colors';

// Maps each `route name to an outline/filled icon pair.
// Ionicons ships both variants ("home-outline" / "home") so the active tab
// can swap to a solid glyph instead of just recoloring the outline.
const ICONS: Record<string, { active: string; inactive: string }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Occasions: { active: 'gift', inactive: 'gift-outline' },
  Orders: { active: 'receipt', inactive: 'receipt-outline' },
  Wishlist: { active: 'heart', inactive: 'heart-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

interface TabBarIconProps {
  name: string;
  focused: boolean;
}

export const TabBarIcon = ({ name, focused }: TabBarIconProps) => {
  const icon = ICONS[name] ?? { active: 'ellipse', inactive: 'ellipse-outline' };

  return (
    <View style={[styles.wrapper, focused && styles.wrapperActive]}>
      <Icon
        name={focused ? icon.active : icon.inactive}
        size={focused ? 22 : 21}
        color={focused ? colors.white : colors.textMuted}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 40,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapperActive: {
    backgroundColor: colors.purple,
  },
});
