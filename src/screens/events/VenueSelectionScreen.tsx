import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OccasionsStackParamList } from '../../navigation/types';
import { venues, formatPrice } from '../../data/mockData';
import { useAppDispatch } from '../../store/hooks';
import { updateEventDraft } from '../../store/slices/appSlice';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/layout/Header';
import { GradientButton } from '../../components/ui/GradientButton';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Icon } from '../../components/ui/Icon';
import { StarRating } from '../../components/ui/StarRating';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<OccasionsStackParamList, 'VenueSelection'>;

export const VenueSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { occasionId, occasionName, services } = route.params;
  const dispatch = useAppDispatch();
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selectedVenueId) return;
    dispatch(updateEventDraft({ venueId: selectedVenueId }));
    navigation.navigate('EventCheckout', {
      occasionId,
      occasionName,
      services,
      venueId: selectedVenueId,
    });
  };

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Header
        title="Select Venue"
        subtitle={occasionName}
        showBack
        onBack={() => navigation.goBack()}
      />

      {venues.map(venue => {
        const isSelected = selectedVenueId === venue.id;
        return (
          <TouchableOpacity
            key={venue.id}
            activeOpacity={0.9}
            onPress={() => setSelectedVenueId(venue.id)}>
            <Card
              variant={isSelected ? 'elevated' : 'default'}
              style={
                isSelected
                  ? [styles.venueCard, styles.venueSelected]
                  : styles.venueCard
              }>
              <Image source={{ uri: venue.imageUrl }} style={styles.venueImage} />
              <View style={styles.venueBody}>
                <View style={styles.venueHeader}>
                  <View style={styles.venueInfo}>
                    <Text style={styles.venueName}>{venue.name}</Text>
                    <View style={styles.locationRow}>
                      <Icon name="map-marker-outline" size={14} color={colors.textMuted} />
                      <Text style={styles.venueLocation}>{venue.location}</Text>
                    </View>
                    <View style={styles.venueMeta}>
                      <StarRating rating={venue.rating} size={12} />
                      <Text style={styles.venueCapacity}>
                        Up to {venue.capacity} guests
                      </Text>
                    </View>
                  </View>
                  {isSelected ? (
                    <View style={styles.checkmark}>
                      <Icon name="check" size={16} color={colors.white} />
                    </View>
                  ) : null}
                </View>
                <View style={styles.amenities}>
                  {venue.amenities.map(a => (
                    <Badge key={a} label={a} variant="cream" style={styles.amenity} />
                  ))}
                </View>
                <Text style={styles.venuePrice}>
                  {formatPrice(venue.pricePerDay)} / day
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        );
      })}

      <GradientButton
        title="Continue to Checkout"
        onPress={handleContinue}
        fullWidth
        disabled={!selectedVenueId}
        style={styles.continueBtn}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.huge },
  venueCard: {
    marginBottom: spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  venueSelected: {
    borderColor: colors.skyBlue,
    borderWidth: 2,
  },
  venueImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.surface,
  },
  venueBody: {
    padding: spacing.lg,
  },
  venueHeader: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  venueInfo: { flex: 1 },
  venueName: {
    ...typography.body,
    fontWeight: '700',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.xs,
  },
  venueLocation: {
    ...typography.bodySmall,
  },
  venueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  venueCapacity: {
    ...typography.caption,
    textTransform: 'none',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.skyBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  amenity: { marginRight: spacing.xs },
  venuePrice: {
    ...typography.h3,
    color: colors.skyBlue,
  },
  continueBtn: { marginTop: spacing.md },
});
