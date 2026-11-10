import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from './types';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { NotificationsScreen } from '../screens/profile/NotificationsScreen';
import { RemindersScreen } from '../screens/profile/RemindersScreen';
import { AddressesScreen } from '../screens/profile/AddressesScreen';
import { SupportScreen } from '../screens/profile/SupportScreen';
import { OrdersScreen } from '../screens/orders/OrdersScreen';
import { OrderTrackingScreen } from '../screens/orders/OrderTrackingScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.background },
      animation: 'slide_from_right',
    }}>
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Orders" component={OrdersScreen} />
    <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    <Stack.Screen name="Reminders" component={RemindersScreen} />
    <Stack.Screen name="Addresses" component={AddressesScreen} />
    <Stack.Screen name="Support" component={SupportScreen} />
  </Stack.Navigator>
);
