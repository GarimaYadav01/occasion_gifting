import React from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';

interface BrandLogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  style?: ImageStyle;
}

const sizes = {
  full: {
    sm: { width: 200, height: 80 },
    md: { width: 260, height: 104 },
    lg: { width: 320, height: 128 },
  },
  icon: { sm: 80, md: 110, lg: 140 },
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  style,
}) => {
  const dimension = sizes[variant][size];
  const source =
    variant === 'icon'
      ? require('../../assets/images/app-icon.png')
      : require('../../assets/images/brand-logo.png');

  const imageStyle =
    variant === 'full'
      ? {
          width: (dimension as { width: number; height: number }).width,
          height: (dimension as { width: number; height: number }).height,
        }
      : { width: dimension as number, height: dimension as number };

  return (
    <Image
      source={source}
      style={[styles.logo, imageStyle, style]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
});
