import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OccasionsStackParamList } from '../../navigation/types';
import { eventServices } from '../../data/mockData';
import { useAppDispatch } from '../../store/hooks';
import { updateEventDraft } from '../../store/slices/appSlice';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ServiceCard } from '../../components/home/ServiceCard';
import { EventServiceType } from '../../types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<OccasionsStackParamList, 'EventServices'>;

export const EventServicesScreen: React.FC<Props> = ({ navigation, route }) => {
  const { occasionId, occasionName } = route.params;
  const dispatch = useAppDispatch();
  const [selectedServices, setSelectedServices] = useState<EventServiceType[]>([]);
  const [date, setDate] = useState('');
  const [guestCount, setGuestCount] = useState('50');

  const toggleService = (serviceId: EventServiceType) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const handleContinue = () => {
    dispatch(
      updateEventDraft({
        services: selectedServices,
        date,
        guestCount: parseInt(guestCount, 10) || 50,
      }),
    );

    const needsVenue = selectedServices.includes('venue');
    if (needsVenue || selectedServices.length === 0) {
      navigation.navigate('VenueSelection', {
        occasionId,
        occasionName,
        services: selectedServices,
      });
    } else {
      navigation.navigate('VenueSelection', {
        occasionId,
        occasionName,
        services: selectedServices,
      });
    }
  };

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Header
        title="Event Services"
        subtitle={occasionName}
        showBack
        onBack={() => navigation.goBack()}
      />

      <Input
        label="Event Date"
        placeholder="DD/MM/YYYY"
        value={date}
        onChangeText={setDate}
      />
      <Input
        label="Expected Guests"
        placeholder="Number of guests"
        keyboardType="number-pad"
        value={guestCount}
        onChangeText={setGuestCount}
      />

      <Text style={styles.sectionTitle}>Select Services</Text>
      <Text style={styles.sectionSubtitle}>
        Choose the services you need for your event
      </Text>

      <View style={styles.grid}>
        {eventServices.map(service => (
          <ServiceCard
            key={service.id}
            service={service}
            selected={selectedServices.includes(service.id)}
            onPress={() => toggleService(service.id)}
          />
        ))}
      </View>

      <Button
        title={`Continue · ${selectedServices.length} selected`}
        onPress={handleContinue}
        fullWidth
        disabled={selectedServices.length === 0}
        style={styles.continueBtn}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.huge,
  },
  sectionTitle: {
    ...typography.h3,
    marginTop: spacing.md,
  },
  sectionSubtitle: {
    ...typography.bodySmall,
    marginBottom: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  continueBtn: {
    marginTop: spacing.lg,
  },
});
