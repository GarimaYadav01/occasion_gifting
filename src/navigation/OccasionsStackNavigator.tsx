import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OccasionsStackParamList } from './types';
import { OccasionBookingScreen } from '../screens/events/OccasionBookingScreen';
import { EventServicesScreen } from '../screens/events/EventServicesScreen';
import { VenueSelectionScreen } from '../screens/events/VenueSelectionScreen';
import { EventCheckoutScreen } from '../screens/events/EventCheckoutScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<OccasionsStackParamList>();

export const OccasionsStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.background },
      animation: 'slide_from_right',
    }}>
    <Stack.Screen name="OccasionBooking" component={OccasionBookingScreen} />
    <Stack.Screen name="EventServices" component={EventServicesScreen} />
    <Stack.Screen name="VenueSelection" component={VenueSelectionScreen} />
    <Stack.Screen name="EventCheckout" component={EventCheckoutScreen} />
  </Stack.Navigator>
);
