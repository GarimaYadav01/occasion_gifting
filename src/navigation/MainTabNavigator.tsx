import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from './types';
import { HomeStackNavigator } from './HomeStackNavigator';
import { OccasionsStackNavigator } from './OccasionsStackNavigator';
import { OrdersStackNavigator } from './OrdersStackNavigator';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import { WishlistScreen } from '../screens/profile/WishlistScreen';
import { TabBarIcon } from '../components/layout/TabBarIcon';
import { colors, spacing } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 56 + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: tabBarHeight,
          paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.sm,
        },
        tabBarActiveTintColor: colors.skyBlue,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name={route.name.replace('Tab', '')} focused={focused} />
        ),
      })}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="OccasionsTab"
        component={OccasionsStackNavigator}
        options={{ tabBarLabel: 'Occasions' }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStackNavigator}
        options={{ tabBarLabel: 'Orders' }}
      />
      <Tab.Screen
        name="WishlistTab"
        component={WishlistScreen}
        options={{ tabBarLabel: 'Wishlist' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.borderLight,
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: Platform.OS === 'ios' ? 0 : 4,
  },
});
