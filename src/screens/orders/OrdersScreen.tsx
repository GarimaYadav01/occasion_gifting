import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OrdersStackParamList } from '../../navigation/types';
import { formatPrice } from '../../data/mockData';
import { useAppSelector } from '../../store/hooks';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/layout/Header';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Card } from '../../components/ui/Card';
import { colors, spacing, typography } from '../../theme';
import { Icon } from '../../components/ui/Icon';
import { OrderStatus } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { openLoginModal } from '../../store/slices/authSlice';

type Props = NativeStackScreenProps<OrdersStackParamList, 'Orders'>;

const statusVariant: Record<
  OrderStatus,
  'purple' | 'pink' | 'success' | 'warning' | 'cream'
> = {
  placed: 'cream',
  confirmed: 'purple',
  preparing: 'warning',
  'out-for-delivery': 'pink',
  delivered: 'success',
  cancelled: 'cream',
};

const statusLabel: Record<OrderStatus, string> = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  'out-for-delivery': 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const OrdersScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useRequireAuth();
  const orders = useAppSelector(state => state.orders.orders);

  if (!isAuthenticated) {
    return (
      <ScreenContainer scroll={false}>
        <Header title="My Orders" subtitle="Track your purchases" />
        <EmptyState
          icon="package-variant"
          title="Login to View Orders"
          message="Sign in to track your gift and event orders."
          actionLabel="Login / Sign Up"
          onAction={() => dispatch(openLoginModal('Login to view your orders'))}
        />
      </ScreenContainer>
    );
  }

  if (orders.length === 0) {
    return (
      <ScreenContainer scroll={false}>
        <Header title="My Orders" subtitle="Track your purchases" />
        <EmptyState
          icon="package-variant"
          title="No Orders Yet"
          message="Your gift and event orders will appear here."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Header title="My Orders" subtitle={`${orders.length} orders`} />

      {orders.map(order => (
        <TouchableOpacity
          key={order.id}
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate('OrderTracking', { orderId: order.id })
          }>
          <Card variant="elevated" style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              <Badge
                label={statusLabel[order.status]}
                variant={statusVariant[order.status]}
              />
            </View>
            <View style={styles.orderItems}>
              {order.items.slice(0, 2).map(({ product, quantity }) => (
              <View key={product.id} style={styles.orderItemRow}>
                {product.imageUrl ? (
                  <Image source={{ uri: product.imageUrl }} style={styles.orderThumb} />
                ) : null}
                <Text style={styles.orderItem} numberOfLines={1}>
                  {product.name} × {quantity}
                </Text>
              </View>
              ))}
            </View>
            <View style={styles.orderFooter}>
              <Text style={styles.orderTotal}>{formatPrice(order.total)}</Text>
              <View style={styles.trackRow}>
                <Text style={styles.trackLink}>Track Order</Text>
                <Icon name="chevron-right" size={18} color={colors.skyBlue} />
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.huge,
  },
  orderCard: {
    marginBottom: spacing.lg,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderId: {
    ...typography.body,
    fontWeight: '700',
  },
  orderDate: {
    ...typography.caption,
    textTransform: 'none',
    marginTop: 2,
  },
  orderItems: {
    marginBottom: spacing.md,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  orderThumb: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.surface,
  },
  orderItem: {
    ...typography.bodySmall,
    marginBottom: spacing.xs,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
  },
  orderTotal: {
    ...typography.h3,
    color: colors.skyBlue,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trackLink: {
    ...typography.bodySmall,
    color: colors.skyBlue,
    fontWeight: '600',
  },
});
