import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OccasionsStackParamList } from '../../navigation/types';
import { occasionTypes } from '../../data/mockData';
import { useAppDispatch } from '../../store/hooks';
import { setEventDraft } from '../../store/slices/appSlice';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/layout/Header';
import { OccasionGridCard } from '../../components/home/OccasionGridCard';
import { spacing } from '../../theme';

type Props = NativeStackScreenProps<OccasionsStackParamList, 'OccasionBooking'>;

export const OccasionBookingScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const handleSelectOccasion = (occasion: (typeof occasionTypes)[0]) => {
    dispatch(
      setEventDraft({
        occasionId: occasion.id,
        occasionName: occasion.name,
        date: '',
        guestCount: 50,
        services: [],
        notes: '',
      }),
    );
    navigation.navigate('EventServices', {
      occasionId: occasion.id,
      occasionName: occasion.name,
    });
  };

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Header
        title="Plan an Occasion"
        subtitle="Choose your celebration type"
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.grid}>
        {occasionTypes.map(occasion => (
          <OccasionGridCard
            key={occasion.id}
            occasion={occasion}
            onPress={() => handleSelectOccasion(occasion)}
          />
        ))}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.huge,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
});
