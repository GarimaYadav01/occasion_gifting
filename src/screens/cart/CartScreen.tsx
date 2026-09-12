import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { getProductById, formatPrice } from '../../data/mockData';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateQuantity, removeFromCart } from '../../store/slices/cartSlice';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/layout/Header';
import { GradientButton } from '../../components/ui/GradientButton';
import { EmptyState } from '../../components/ui/EmptyState';
import { CartItemRow } from '../../components/cart/CartItemRow';
import { Card } from '../../components/ui/Card';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'Cart'>;

export const CartScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { requireAuth } = useRequireAuth();
  const cartItems = useAppSelector(state => state.cart.items);

  const { subtotal, itemCount } = useMemo(() => {
    let total = 0;
    let count = 0;
    cartItems.forEach(item => {
      const product = getProductById(item.productId);
      if (product) {
        total += product.price * item.quantity;
        count += item.quantity;
      }
    });
    return { subtotal: total, itemCount: count };
  }, [cartItems]);

  const deliveryFee = subtotal > 999 ? 0 : 99;
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <ScreenContainer scroll={false}>
        <Header
          title="Your Cart"
          showBack
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          icon="cart-outline"
          title="Cart is Empty"
          message="Browse our collection and add gifts you love."
          actionLabel="Start Shopping"
          onAction={() => navigation.navigate('Home')}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll={false} contentStyle={styles.container}>
      <Header
        title="Your Cart"
        subtitle={`${itemCount} item${itemCount > 1 ? 's' : ''}`}
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.list}>
        {cartItems.map(item => (
          <CartItemRow
            key={item.productId}
            productId={item.productId}
            quantity={item.quantity}
            onIncrease={() =>
              dispatch(
                updateQuantity({
                  productId: item.productId,
                  quantity: item.quantity + 1,
                }),
              )
            }
            onDecrease={() =>
              dispatch(
                updateQuantity({
                  productId: item.productId,
                  quantity: item.quantity - 1,
                }),
              )
            }
            onRemove={() => dispatch(removeFromCart(item.productId))}
          />
        ))}
      </View>

      <Card variant="cream" style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>
            {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>
      </Card>

      <GradientButton
        title={`Checkout`}
        rightText={formatPrice(total)}
        icon="cart-outline"
        onPress={() =>
          requireAuth(
            () => navigation.navigate('Checkout'),
            'Login to place your order',
          )
        }
        fullWidth
        style={styles.checkoutBtn}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  summary: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.body,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.sm,
    marginBottom: 0,
  },
  totalLabel: {
    ...typography.h3,
  },
  totalValue: {
    ...typography.h3,
    color: colors.purple,
  },
  checkoutBtn: {
    marginBottom: spacing.lg,
  },
});
