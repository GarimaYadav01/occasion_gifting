import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WishlistStackParamList } from './types';
import { WishlistScreen } from '../screens/profile/WishlistScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<WishlistStackParamList>();

export const WishlistStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.background },
      animation: 'slide_from_right',
    }}>
    <Stack.Screen name="Wishlist" component={WishlistScreen} />
  </Stack.Navigator>
);
