import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../utils/hooks';

/** Sticky footer that respects the bottom safe area. */
export const BottomBar = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => {
  const insets = useSafeAreaInsets();
  const { c } = useTheme();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12), backgroundColor: c.white, borderTopColor: c.line }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: { paddingHorizontal: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, shadowColor: '#3B1450', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: -4 }, elevation: 12 },
});
