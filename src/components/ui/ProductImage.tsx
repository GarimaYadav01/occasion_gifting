import React from 'react';
import { Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { colors, radius } from '../../theme';

interface ProductImageProps {
  uri: string;
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  resizeMode?: 'cover' | 'contain';
}

export const ProductImage: React.FC<ProductImageProps> = ({
  uri,
  style,
  containerStyle,
  resizeMode = 'cover',
}) => (
  <Image
    source={{ uri }}
    style={[styles.image, style]}
    resizeMode={resizeMode}
  />
);

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
  },
});
