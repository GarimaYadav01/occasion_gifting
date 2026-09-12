import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { getProductById, formatPrice } from '../../data/mockData';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearCart } from '../../store/slices/cartSlice';
import { addOrder } from '../../store/slices/ordersSlice';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/layout/Header';
import { GradientButton } from '../../components/ui/GradientButton';
import { Icon } from '../../components/ui/Icon';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { colors, spacing, typography } from '../../theme';
import { Order } from '../../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Checkout'>;

export const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { requireAuth } = useRequireAuth();
  const cartItems = useAppSelector(state => state.cart.items);
  const deliveryAddress = useAppSelector(state => state.cart.deliveryAddress);
  const [address, setAddress] = useState(deliveryAddress);
  const [loading, setLoading] = useState(false);

  const { subtotal, orderItems } = useMemo(() => {
    let total = 0;
    const items = cartItems
      .map(item => {
        const product = getProductById(item.productId);
        if (!product) return null;
        total += product.price * item.quantity;
        return { product, quantity: item.quantity };
      })
      .filter(Boolean) as Order['items'];
    return { subtotal: total, orderItems: items };
  }, [cartItems]);

  const deliveryFee = subtotal > 999 ? 0 : 99;
  const total = subtotal + deliveryFee;

  const placeOrder = () => {
    setLoading(true);
    setTimeout(() => {
      const orderId = `OCN-${Math.floor(1000 + Math.random() * 9000)}`;
      const order: Order = {
        id: orderId,
        items: orderItems,
        total,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 6 * 3600000).toISOString(),
        address,
        type: 'gift',
      };
      dispatch(addOrder(order));
      dispatch(clearCart());
      setLoading(false);
      navigation.replace('OrderTracking', { orderId });
    }, 1500);
  };

  const handlePlaceOrder = () => {
    requireAuth(placeOrder, 'Login to place your order');
  };

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Header
        title="Checkout"
        subtitle="Review & confirm"
        showBack
        onBack={() => navigation.goBack()}
      />

      <Card variant="elevated" style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <Input
          label="Address"
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
          containerStyle={styles.inputNoMargin}
        />
      </Card>

      <Card variant="cream" style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {orderItems.map(({ product, quantity }) => (
          <View key={product.id} style={styles.itemRow}>
            <Image source={{ uri: product.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {product.name}
              </Text>
              <Text style={styles.itemQty}>Qty: {quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>
              {formatPrice(product.price * quantity)}
            </Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>
      </Card>

      <Card style={styles.paymentCard}>
        <Icon name="credit-card-outline" size={32} color={colors.skyBlue} />
        <View style={styles.paymentText}>
          <Text style={styles.paymentTitle}>Secure Payment</Text>
          <Text style={styles.paymentSubtitle}>UPI · Cards · Net Banking</Text>
        </View>
      </Card>

      <GradientButton
        title="Place Order"
        rightText={formatPrice(total)}
        icon="check-circle-outline"
        onPress={handlePlaceOrder}
        loading={loading}
        fullWidth
        style={styles.placeOrderBtn}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.huge,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  inputNoMargin: {
    marginBottom: 0,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: spacing.md,
    backgroundColor: colors.surface,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...typography.body,
    fontWeight: '500',
    fontSize: 14,
  },
  itemQty: {
    ...typography.caption,
    textTransform: 'none',
  },
  itemPrice: {
    ...typography.body,
    fontWeight: '600',
    color: colors.purple,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    ...typography.h3,
  },
  totalValue: {
    ...typography.h3,
    color: colors.skyBlue,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxl,
    gap: spacing.lg,
  },
  paymentText: {
    flex: 1,
  },
  paymentTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  paymentSubtitle: {
    ...typography.bodySmall,
  },
  placeOrderBtn: {
    marginBottom: spacing.lg,
  },
});
