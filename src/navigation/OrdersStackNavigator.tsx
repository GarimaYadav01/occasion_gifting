import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrdersStackParamList } from './types';
import { OrdersScreen } from '../screens/orders/OrdersScreen';
import { OrderTrackingScreen } from '../screens/orders/OrderTrackingScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<OrdersStackParamList>();

export const OrdersStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.background },
      animation: 'slide_from_right',
    }}>
    <Stack.Screen name="Orders" component={OrdersScreen} />
    <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
  </Stack.Navigator>
);
