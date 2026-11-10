import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address, seedAddresses } from '../../data/user';

export const GIFT_STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'] as const;
export const EVENT_STATUSES = ['Pending', 'Confirmed', 'Vendor Assigned', 'In Progress', 'Completed'] as const;

export interface GiftOrder {
  id: string;
  items: { productId: string; qty: number; price: number; options: Record<string, string> }[];
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  step: number; // index in GIFT_STATUSES
  cancelled: boolean;
  cancelReason?: string;
  placedAt: string;
  deliveryDate: string;
  slot: string;
  address: Address;
  recipient: { name: string; phone: string };
  message: string;
  payment: string;
  review?: { rating: number; text: string };
}

export interface BookedService {
  service: string;
  vendorId: string;
  packageId: string;
  addons: string[];
  notes: string;
  amount: number;
}

export interface EventBooking {
  id: string;
  eventType: string;
  date: string;
  time: string;
  guests: number;
  services: BookedService[];
  venue: { name: string; address: string };
  total: number;
  paid: number;
  step: number; // index in EVENT_STATUSES
  cancelled: boolean;
  cancelReason?: string;
  payment: string;
  createdAt: string;
  review?: { rating: number; text: string };
}

const now = new Date();
const day = (offset: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + offset);
  return d.toISOString();
};

const seedGifts: GiftOrder[] = [
  { id: 'OCG48213', items: [{ productId: 'p1', qty: 1, price: 899, options: {} }, { productId: 'p9', qty: 1, price: 649, options: { Weight: '500 g' } }], subtotal: 1548, delivery: 0, discount: 150, total: 1398, step: 3, cancelled: false, placedAt: day(0), deliveryDate: day(0), slot: '3 PM – 6 PM', address: seedAddresses[2], recipient: { name: 'Neha Sharma', phone: '99000 11223' }, message: 'Happy birthday, little sis! 💜', payment: 'Google Pay' },
  { id: 'OCG47750', items: [{ productId: 'p24', qty: 1, price: 2499, options: {} }], subtotal: 2499, delivery: 0, discount: 0, total: 2499, step: 1, cancelled: false, placedAt: day(-1), deliveryDate: day(2), slot: '12 PM – 3 PM', address: seedAddresses[1], recipient: { name: 'Kabir Rao', phone: '98450 22110' }, message: 'Congrats on the promotion!', payment: 'HDFC Credit Card' },
  { id: 'OCG46102', items: [{ productId: 'p16', qty: 2, price: 1199, options: {} }], subtotal: 2398, delivery: 0, discount: 300, total: 2098, step: 4, cancelled: false, placedAt: day(-6), deliveryDate: day(-5), slot: '6 PM – 9 PM', address: seedAddresses[0], recipient: { name: 'Rohan Kapoor', phone: '98861 33445' }, message: '', payment: 'PhonePe' },
  { id: 'OCG45011', items: [{ productId: 'p30', qty: 1, price: 999, options: {} }], subtotal: 999, delivery: 49, discount: 0, total: 1048, step: 1, cancelled: true, cancelReason: 'Ordered by mistake', placedAt: day(-12), deliveryDate: day(-11), slot: '9 AM – 12 PM', address: seedAddresses[0], recipient: { name: 'Aarav Mehta', phone: '98765 43210' }, message: '', payment: 'Occasion Wallet' },
];

const seedBookings: EventBooking[] = [
  { id: 'OCE90311', eventType: 'birthday', date: day(12), time: '07:00 PM', guests: 60, services: [
    { service: 'decoration', vendorId: 'v1', packageId: 'v1-gold', addons: ['v1-a2'], notes: 'Pastel unicorn theme', amount: 7698 },
    { service: 'catering', vendorId: 'v4', packageId: 'v4-silver', addons: [], notes: 'Veg only', amount: 32940 },
    { service: 'entertainment', vendorId: 'v13', packageId: 'v13-silver', addons: [], notes: '', amount: 9999 },
  ], venue: { name: 'Skyline Rooftop Lounge', address: 'Indiranagar, Bengaluru' }, total: 50637, paid: 10127, step: 2, cancelled: false, payment: 'Google Pay', createdAt: day(-2) },
  { id: 'OCE88120', eventType: 'anniversary', date: day(-20), time: '08:00 PM', guests: 2, services: [
    { service: 'decoration', vendorId: 'v2', packageId: 'v2-silver', addons: [], notes: 'Rose petals & candles', amount: 24999 },
  ], venue: { name: 'Home', address: 'Prestige Lakeside, Koramangala' }, total: 24999, paid: 24999, step: 4, cancelled: false, payment: 'HDFC Credit Card', createdAt: day(-30) },
];

interface OrdersState {
  gifts: GiftOrder[];
  bookings: EventBooking[];
}

const orders = createSlice({
  name: 'orders',
  initialState: { gifts: seedGifts, bookings: seedBookings } as OrdersState,
  reducers: {
    placeGiftOrder: (s, a: PayloadAction<GiftOrder>) => { s.gifts.unshift(a.payload); },
    placeBooking: (s, a: PayloadAction<EventBooking>) => { s.bookings.unshift(a.payload); },
    advanceGift: (s, a: PayloadAction<string>) => {
      const o = s.gifts.find(x => x.id === a.payload);
      if (o && !o.cancelled && o.step < GIFT_STATUSES.length - 1) { o.step += 1; }
    },
    advanceBooking: (s, a: PayloadAction<string>) => {
      const o = s.bookings.find(x => x.id === a.payload);
      if (o && !o.cancelled && o.step < EVENT_STATUSES.length - 1) { o.step += 1; }
    },
    cancelGift: (s, a: PayloadAction<{ id: string; reason: string }>) => {
      const o = s.gifts.find(x => x.id === a.payload.id);
      if (o) { o.cancelled = true; o.cancelReason = a.payload.reason; }
    },
    cancelBooking: (s, a: PayloadAction<{ id: string; reason: string }>) => {
      const o = s.bookings.find(x => x.id === a.payload.id);
      if (o) { o.cancelled = true; o.cancelReason = a.payload.reason; }
    },
    reviewOrder: (s, a: PayloadAction<{ kind: 'gift' | 'event'; id: string; rating: number; text: string }>) => {
      const list: (GiftOrder | EventBooking)[] = a.payload.kind === 'gift' ? s.gifts : s.bookings;
      const o = list.find(x => x.id === a.payload.id);
      if (o) { o.review = { rating: a.payload.rating, text: a.payload.text }; }
    },
  },
});

export const { placeGiftOrder, placeBooking, advanceGift, advanceBooking, cancelGift, cancelBooking, reviewOrder } = orders.actions;
export default orders.reducer;
