import React from 'react';
import { Image, StyleSheet, ImageStyle, View, Text } from 'react-native';
import { colors, typography } from '../../theme';

interface BrandLogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  style?: ImageStyle;
}

const sizes = {
  icon: { sm: 80, md: 110, lg: 140 },
};

/**
 * Uses app-icon only. Drop brand-logo.png — replace app-icon.png with your new logo.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'icon',
  size = 'md',
  style,
}) => {
  if (variant === 'full') {
    return (
      <View style={[styles.wordmark, style as object]}>
        <Image
          source={require('../../assets/images/app-icon.png')}
          style={{ width: 48, height: 48 }}
          resizeMode="contain"
        />
        <Text style={styles.wordmarkText}>ONG</Text>
      </View>
    );
  }

  const dimension = sizes.icon[size];
  return (
    <Image
      source={require('../../assets/images/app-icon.png')}
      style={[styles.logo, { width: dimension, height: dimension }, style]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  wordmark: {
    alignSelf: 'center',
    alignItems: 'center',
    gap: 8,
  },
  wordmarkText: {
    ...typography.h2,
    color: colors.purple,
  },
});
