import { NavigatorScreenParams } from '@react-navigation/native';
import { EventServiceType, OccasionType } from '../types';

export type HomeStackParamList = {
  Home: undefined;
  Search: undefined;
  Categories: { categoryId?: string } | undefined;
  ProductListing: { categoryId: string; title: string };
  ProductDetails: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderTracking: { orderId: string };
  Notifications: undefined;
};

export type OccasionsStackParamList = {
  OccasionBooking: undefined;
  EventServices: { occasionId: OccasionType; occasionName: string };
  VenueSelection: {
    occasionId: OccasionType;
    occasionName: string;
    services: EventServiceType[];
  };
  EventCheckout: {
    occasionId: OccasionType;
    occasionName: string;
    services: EventServiceType[];
    venueId: string;
  };
};

export type OrdersStackParamList = {
  Orders: undefined;
  OrderTracking: { orderId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  Notifications: undefined;
  Orders: undefined;
  OrderTracking: { orderId: string };
  Reminders: undefined;
  Addresses: undefined;
  Support: undefined;
};

export type WishlistStackParamList = {
  Wishlist: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  OccasionsTab: NavigatorScreenParams<OccasionsStackParamList>;
  OrdersTab: NavigatorScreenParams<OrdersStackParamList>;
  WishlistTab: NavigatorScreenParams<WishlistStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Splash: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
