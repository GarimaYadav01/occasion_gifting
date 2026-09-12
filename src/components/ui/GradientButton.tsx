import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, IconName } from './Icon';
import { colors, radius, spacing, typography } from '../../theme';

type ButtonSize = 'sm' | 'md' | 'lg';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  icon?: IconName;
  rightText?: string;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
  icon,
  rightText,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      disabled={isDisabled}
      style={[fullWidth && styles.fullWidth, isDisabled && styles.disabled, style]}>
      <LinearGradient
        colors={[colors.skyBlue, colors.skyBlueDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, styles[`size_${size}`]]}>
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <View style={styles.content}>
            {icon ? (
              <Icon name={icon} size={20} color={colors.white} style={styles.icon} />
            ) : null}
            <Text style={[styles.text, styles[`textSize_${size}`], textStyle]}>
              {title}
            </Text>
            {rightText ? (
              <>
                <View style={styles.divider} />
                <Text style={[styles.rightText, styles[`textSize_${size}`]]}>
                  {rightText}
                </Text>
              </>
            ) : null}
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    ...typography.button,
    color: colors.white,
  },
  rightText: {
    ...typography.button,
    color: colors.white,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: spacing.md,
  },
  size_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  size_md: {
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.xl,
  },
  size_lg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  textSize_sm: { fontSize: 14 },
  textSize_md: { fontSize: 16 },
  textSize_lg: { fontSize: 17 },
});
