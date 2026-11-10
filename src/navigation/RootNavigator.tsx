import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from './types';
import { TabBar } from '../components/TabBar';
import { useTheme } from '../utils/hooks';

import { SplashScreen } from '../screens/auth/SplashScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { OtpScreen } from '../screens/auth/OtpScreen';
import { ProfileSetupScreen } from '../screens/auth/ProfileSetupScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { SearchScreen } from '../screens/home/SearchScreen';
import { NotificationsScreen } from '../screens/home/NotificationsScreen';
import { GiftsScreen } from '../screens/gifts/GiftsScreen';
import { ProductListScreen } from '../screens/gifts/ProductListScreen';
import { ProductDetailsScreen } from '../screens/gifts/ProductDetailsScreen';
import { WishlistScreen } from '../screens/gifts/WishlistScreen';
import { CartScreen } from '../screens/cart/CartScreen';
import { CheckoutScreen } from '../screens/cart/CheckoutScreen';
import { OrderSuccessScreen } from '../screens/cart/OrderSuccessScreen';
import { EventsScreen } from '../screens/events/EventsScreen';
import { ServiceCategoryScreen } from '../screens/events/ServiceCategoryScreen';
import { VendorDetailsScreen } from '../screens/events/VendorDetailsScreen';
import { BookDateScreen, BookEventTypeScreen, BookGuestsScreen, BookServicesScreen } from '../screens/events/booking/StepsA';
import { BookCustomizeScreen, BookMapScreen, BookProvidersScreen, BookVenueScreen } from '../screens/events/booking/StepsB';
import { BookConfirmScreen, BookingSuccessScreen, BookPaymentScreen, BookReviewScreen } from '../screens/events/booking/StepsC';
import { OrdersScreen } from '../screens/orders/OrdersScreen';
import { GiftOrderDetailsScreen } from '../screens/orders/GiftOrderDetailsScreen';
import { BookingDetailsScreen } from '../screens/orders/BookingDetailsScreen';
import { ReviewScreen } from '../screens/orders/ReviewScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { AddressesScreen, AddressFormScreen, EditProfileScreen, PaymentMethodsScreen } from '../screens/profile/AccountScreens';
import { AddReminderScreen, RemindersScreen } from '../screens/profile/RemindersScreens';
import { HelpScreen, InfoScreen } from '../screens/profile/SupportScreens';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const renderTabBar = (props: BottomTabBarProps) => <TabBar {...props} />;

const Tabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={renderTabBar}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Gifts" component={GiftsScreen} />
    <Tab.Screen name="Events" component={EventsScreen} />
    <Tab.Screen name="Orders" component={OrdersScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export const RootNavigator = () => {
  const { c } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg }, animation: 'slide_from_right' }}>
      <Stack.Group screenOptions={{ animation: 'fade' }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={Tabs} />
      </Stack.Group>
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ animation: 'fade_from_bottom' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="ServiceCategory" component={ServiceCategoryScreen} />
      <Stack.Screen name="VendorDetails" component={VendorDetailsScreen} />
      <Stack.Screen name="BookEventType" component={BookEventTypeScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="BookDate" component={BookDateScreen} />
      <Stack.Screen name="BookGuests" component={BookGuestsScreen} />
      <Stack.Screen name="BookServices" component={BookServicesScreen} />
      <Stack.Screen name="BookProviders" component={BookProvidersScreen} />
      <Stack.Screen name="BookCustomize" component={BookCustomizeScreen} />
      <Stack.Screen name="BookVenue" component={BookVenueScreen} />
      <Stack.Screen name="BookMap" component={BookMapScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="BookReview" component={BookReviewScreen} />
      <Stack.Screen name="BookPayment" component={BookPaymentScreen} />
      <Stack.Screen name="BookConfirm" component={BookConfirmScreen} />
      <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="GiftOrderDetails" component={GiftOrderDetailsScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Addresses" component={AddressesScreen} />
      <Stack.Screen name="AddressForm" component={AddressFormScreen} />
      <Stack.Screen name="Reminders" component={RemindersScreen} />
      <Stack.Screen name="AddReminder" component={AddReminderScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="Info" component={InfoScreen} />
    </Stack.Navigator>
  );
};
