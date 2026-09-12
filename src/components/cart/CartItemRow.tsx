import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getProductById, formatPrice } from '../../data/mockData';
import { Icon } from '../ui/Icon';
import { colors, radius, spacing } from '../../theme';

interface CartItemRowProps {
  productId: string;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  productId,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const product = getProductById(productId);
  if (!product) return null;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <View style={styles.actions}>
          <View style={styles.quantityControl}>
            <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease}>
              <Icon name="minus" size={16} color={colors.skyBlue} />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease}>
              <Icon name="plus" size={16} color={colors.skyBlue} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onRemove}>
            <Text style={styles.remove}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    marginRight: spacing.md,
  },
  content: { flex: 1 },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.skyBlue,
    marginBottom: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    padding: 2,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontWeight: '600',
    paddingHorizontal: spacing.md,
    minWidth: 32,
    textAlign: 'center',
  },
  remove: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '500',
  },
});
