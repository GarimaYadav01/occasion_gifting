import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  StatusBar,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  /** Apply top/left/right safe area. Bottom is handled for tab bar separately. */
  edges?: boolean;
  backgroundColor?: string;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scroll = true,
  style,
  contentStyle,
  edges = true,
  backgroundColor = colors.white,
}) => {
  const insets = useSafeAreaInsets();

  const bottomPad = edges ? Math.max(insets.bottom, spacing.sm) : 0;

  if (scroll) {
    return (
      <SafeAreaView
        edges={edges ? ['top', 'left', 'right'] : []}
        style={[styles.container, { backgroundColor }, style]}>
        <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: bottomPad },
            contentStyle,
          ]}
          keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={edges ? ['top', 'left', 'right'] : []}
      style={[
        styles.container,
        { backgroundColor, paddingBottom: bottomPad },
        style,
        contentStyle,
      ]}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
});
