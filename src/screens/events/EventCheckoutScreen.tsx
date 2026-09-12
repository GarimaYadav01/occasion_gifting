import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OccasionsStackParamList } from '../../navigation/types';
import { eventServices, venues, formatPrice } from '../../data/mockData';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addOrder } from '../../store/slices/ordersSlice';
import { setEventDraft } from '../../store/slices/appSlice';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/layout/Header';
import { GradientButton } from '../../components/ui/GradientButton';
import { Icon } from '../../components/ui/Icon';
import { Card } from '../../components/ui/Card';
import { colors, spacing, typography } from '../../theme';
import { Order } from '../../types';

type Props = NativeStackScreenProps<OccasionsStackParamList, 'EventCheckout'>;

export const EventCheckoutScreen: React.FC<Props> = ({ navigation, route }) => {
  const { occasionName, services, venueId } = route.params;
  const dispatch = useAppDispatch();
  const { requireAuth } = useRequireAuth();
  const eventDraft = useAppSelector(state => state.app.eventDraft);
  const [loading, setLoading] = useState(false);

  const venue = venues.find(v => v.id === venueId);
  const selectedServices = eventServices.filter(s => services.includes(s.id));

  const total = useMemo(() => {
    let sum = venue?.pricePerDay ?? 0;
    selectedServices.forEach(s => {
      sum += s.priceFrom;
    });
    return sum;
  }, [venue, selectedServices]);

  const confirmBooking = () => {
    setLoading(true);
    setTimeout(() => {
      const orderId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;
      const order: Order = {
        id: orderId,
        items: [
          {
            product: {
              id: venueId,
              name: `${occasionName} at ${venue?.name}`,
              description: selectedServices.map(s => s.name).join(', '),
              price: total,
              category: 'surprise',
              imageUrl: venue?.imageUrl ?? '',
              rating: venue?.rating ?? 4.8,
              reviews: 0,
              sameDayDelivery: false,
              tags: ['Event'],
            },
            quantity: 1,
          },
        ],
        total,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        estimatedDelivery: eventDraft?.date || new Date().toISOString(),
        address: venue?.location ?? '',
        type: 'event',
      };
      dispatch(addOrder(order));
      dispatch(setEventDraft(null));
      setLoading(false);
      navigation.getParent()?.navigate('OrdersTab', {
        screen: 'OrderTracking',
        params: { orderId },
      });
    }, 1500);
  };

  const handleConfirmBooking = () => {
    requireAuth(confirmBooking, 'Login to confirm your event booking');
  };

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Header
        title="Event Checkout"
        subtitle="Review your booking"
        showBack
        onBack={() => navigation.goBack()}
      />

      <Card variant="cream" style={styles.section}>
        <Text style={styles.sectionTitle}>{occasionName}</Text>
        {eventDraft?.date ? (
          <View style={styles.detailRow}>
            <Icon name="calendar" size={16} color={colors.textSecondary} />
            <Text style={styles.detail}>{eventDraft.date}</Text>
          </View>
        ) : null}
        <View style={styles.detailRow}>
          <Icon name="account-group" size={16} color={colors.textSecondary} />
          <Text style={styles.detail}>{eventDraft?.guestCount ?? 50} guests</Text>
        </View>
      </Card>

      {venue ? (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Venue</Text>
          <View style={styles.row}>
            <Image source={{ uri: venue.imageUrl }} style={styles.rowImage} />
            <View style={styles.rowInfo}>
              <Text style={styles.rowName}>{venue.name}</Text>
              <Text style={styles.rowSub}>{venue.location}</Text>
            </View>
            <Text style={styles.rowPrice}>{formatPrice(venue.pricePerDay)}</Text>
          </View>
        </Card>
      ) : null}

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        {selectedServices.map(service => (
          <View key={service.id} style={styles.row}>
            <View style={styles.serviceIcon}>
              <Icon name={service.icon} size={20} color={colors.skyBlue} />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowName}>{service.name}</Text>
            </View>
            <Text style={styles.rowPrice}>
              {formatPrice(service.priceFrom)}
            </Text>
          </View>
        ))}
      </Card>

      <Card variant="elevated" style={styles.totalCard}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Estimated Total</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>
        <Text style={styles.totalNote}>
          Final price confirmed after consultation with providers
        </Text>
      </Card>

      <GradientButton
        title="Confirm Booking"
        rightText={formatPrice(total)}
        icon="check-circle-outline"
        onPress={handleConfirmBooking}
        loading={loading}
        fullWidth
        style={styles.confirmBtn}
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  detail: {
    ...typography.body,
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  rowImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: spacing.md,
    backgroundColor: colors.surface,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.purpleLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    ...typography.body,
    fontWeight: '500',
  },
  rowSub: {
    ...typography.caption,
    textTransform: 'none',
  },
  rowPrice: {
    ...typography.body,
    fontWeight: '600',
    color: colors.skyBlue,
  },
  totalCard: {
    marginBottom: spacing.xxl,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  totalLabel: {
    ...typography.h3,
  },
  totalValue: {
    ...typography.h2,
    color: colors.skyBlue,
  },
  totalNote: {
    ...typography.caption,
    textTransform: 'none',
    letterSpacing: 0,
    lineHeight: 16,
  },
  confirmBtn: {
    marginBottom: spacing.lg,
  },
});
