import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OrdersStackParamList, HomeStackParamList } from '../../navigation/types';
import { formatPrice } from '../../data/mockData';
import { useAppSelector } from '../../store/hooks';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { OrderStatusTimeline } from '../../components/cart/OrderStatusTimeline';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<
  OrdersStackParamList & HomeStackParamList,
  'OrderTracking'
>;

export const OrderTrackingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { orderId } = route.params;
  const order = useAppSelector(state =>
    state.orders.orders.find(o => o.id === orderId),
  );

  if (!order) {
    return (
      <ScreenContainer>
        <Header title="Order Not Found" showBack onBack={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Header
        title="Track Order"
        subtitle={order.id}
        showBack
        onBack={() => navigation.goBack()}
      />

      <Card variant="cream" style={styles.statusCard}>
        <View style={styles.statusIconWrap}>
          <Icon
            name={order.status === 'delivered' ? 'check-circle' : 'truck-delivery'}
            size={48}
            color={order.status === 'delivered' ? colors.green : colors.skyBlue}
          />
        </View>
        <Text style={styles.statusTitle}>
          {order.status === 'delivered'
            ? 'Delivered Successfully!'
            : 'Your order is on the way'}
        </Text>
        <Text style={styles.statusSubtitle}>
          Estimated:{' '}
          {new Date(order.estimatedDelivery).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </Card>

      <Card variant="elevated" style={styles.section}>
        <Text style={styles.sectionTitle}>Order Status</Text>
        <OrderStatusTimeline currentStatus={order.status} />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        {order.items.map(({ product, quantity }) => (
          <View key={product.id} style={styles.itemRow}>
            {product.imageUrl ? (
              <Image source={{ uri: product.imageUrl }} style={styles.itemImage} />
            ) : (
              <View style={styles.itemImagePlaceholder}>
                <Icon name="gift" size={24} color={colors.skyBlue} />
              </View>
            )}
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{product.name}</Text>
              <Text style={styles.itemQty}>Qty: {quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>
              {formatPrice(product.price * quantity)}
            </Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Paid</Text>
          <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
        </View>
      </Card>

      <Card variant="cream" style={styles.addressCard}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <Text style={styles.address}>{order.address}</Text>
      </Card>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.huge },
  statusCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  statusIconWrap: {
    marginBottom: spacing.md,
  },
  statusTitle: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  statusSubtitle: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
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
  itemImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: spacing.md,
    backgroundColor: colors.purpleLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: { flex: 1 },
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
    color: colors.skyBlue,
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
    ...typography.body,
    fontWeight: '600',
  },
  totalValue: {
    ...typography.h3,
    color: colors.skyBlue,
  },
  addressCard: { marginBottom: spacing.lg },
  address: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
