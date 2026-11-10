import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  StyleProp,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, radius, spacing } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'cream' | 'gradient';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
}) => {
  const content =
    variant === 'gradient' ? (
      <LinearGradient
        colors={[colors.purpleLight, colors.white]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.base, styles.gradient, style]}>
        {children}
      </LinearGradient>
    ) : (
      <View style={[styles.base, styles[variant], style]}>{children}</View>
    );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  default: {},
  elevated: {
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
    borderColor: colors.border,
  },
  cream: {
    backgroundColor: colors.cream,
    borderColor: colors.creamDark,
  },
  gradient: {
    borderColor: colors.border,
    overflow: 'hidden',
  },
});
