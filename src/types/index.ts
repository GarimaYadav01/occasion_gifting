export type GiftCategory =
  | 'flowers'
  | 'cakes'
  | 'hampers'
  | 'personalized'
  | 'chocolates'
  | 'surprise';

export type OccasionType =
  | 'birthday'
  | 'anniversary'
  | 'wedding'
  | 'baby-shower'
  | 'engagement'
  | 'corporate';

export type EventServiceType =
  | 'decoration'
  | 'catering'
  | 'photography'
  | 'videography'
  | 'makeup'
  | 'dj'
  | 'live-singer'
  | 'venue'
  | 'sound-lighting'
  | 'return-gifts';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: GiftCategory;
  imageUrl: string;
  emoji?: string;
  rating: number;
  reviews: number;
  sameDayDelivery: boolean;
  tags: string[];
}

export interface Category {
  id: GiftCategory;
  name: string;
  icon: string;
  description: string;
  color: string;
  imageUrl?: string;
}

export interface Occasion {
  id: OccasionType;
  name: string;
  icon: string;
  imageUrl: string;
  description: string;
  startingPrice: number;
}

export interface EventService {
  id: EventServiceType;
  name: string;
  icon: string;
  description: string;
  priceFrom: number;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  pricePerDay: number;
  rating: number;
  imageUrl: string;
  amenities: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: Array<{ product: Product; quantity: number }>;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  address: string;
  type: 'gift' | 'event';
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'order' | 'promo' | 'occasion';
  read: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarEmoji: string;
}

export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
}

export interface EventBookingDraft {
  occasionId: OccasionType;
  occasionName: string;
  date: string;
  guestCount: number;
  services: EventServiceType[];
  venueId?: string;
  notes: string;
}
