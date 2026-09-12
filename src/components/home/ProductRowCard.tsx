import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Product } from '../../types';
import { formatPrice } from '../../data/mockData';
import { Icon } from '../ui/Icon';
import { StarRating } from '../ui/StarRating';
import { colors, radius, spacing } from '../../theme';

const CARD_WIDTH = 160;

interface ProductRowCardProps {
  product: Product;
  onPress: () => void;
  onWishlistPress?: () => void;
  isWishlisted?: boolean;
}

export const ProductRowCard: React.FC<ProductRowCardProps> = ({
  product,
  onPress,
  onWishlistPress,
  isWishlisted = false,
}) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
    <View style={styles.imageWrap}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />
      {product.sameDayDelivery ? (
        <View style={styles.sameDay}>
          <Icon name="flash" size={10} color={colors.white} />
        </View>
      ) : null}
      {onWishlistPress ? (
        <TouchableOpacity style={styles.heart} onPress={onWishlistPress}>
          <Icon
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={14}
            color={isWishlisted ? colors.accent : colors.textMuted}
          />
        </TouchableOpacity>
      ) : null}
    </View>
    <Text style={styles.name} numberOfLines={2}>
      {product.name}
    </Text>
    <StarRating rating={product.rating} size={11} />
    <View style={styles.priceRow}>
      <Text style={styles.price}>{formatPrice(product.price)}</Text>
      {product.originalPrice ? (
        <Text style={styles.original}>{formatPrice(product.originalPrice)}</Text>
      ) : null}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginRight: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  imageWrap: {
    height: 140,
    backgroundColor: colors.surface,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  sameDay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.green,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    lineHeight: 17,
    minHeight: 40,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  original: {
    fontSize: 11,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
});
