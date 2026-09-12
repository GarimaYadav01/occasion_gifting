import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Product } from '../../types';
import { formatPrice } from '../../data/mockData';
import { Icon } from '../ui/Icon';
import { StarRating } from '../ui/StarRating';
import { colors, radius, spacing } from '../../theme';

const CARD_WIDTH = (Dimensions.get('window').width - 52) / 2;

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onWishlistPress?: () => void;
  isWishlisted?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onWishlistPress,
  isWishlisted = false,
}) => (
  <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.container}>
    <View style={styles.imageWrap}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />
      {onWishlistPress ? (
        <TouchableOpacity style={styles.wishlistBtn} onPress={onWishlistPress}>
          <Icon
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={16}
            color={isWishlisted ? colors.accent : colors.textMuted}
          />
        </TouchableOpacity>
      ) : null}
      {product.sameDayDelivery ? (
        <View style={styles.sameDayBadge}>
          <Icon name="flash" size={10} color={colors.white} />
          <Text style={styles.sameDayText}>Same Day</Text>
        </View>
      ) : null}
    </View>
    <View style={styles.content}>
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>
      <StarRating rating={product.rating} size={12} />
      <View style={styles.footer}>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <TouchableOpacity style={styles.cartBtn} onPress={onPress}>
          <Icon name="cart-outline" size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
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
  wishlistBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sameDayBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    gap: 3,
  },
  sameDayText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.white,
  },
  content: {
    padding: spacing.md,
  },
  category: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
    minHeight: 36,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  cartBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.skyBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
