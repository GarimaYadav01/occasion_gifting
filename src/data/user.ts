import { img } from './images';

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  name: string;
  phone: string;
  line: string;
  area: string;
  city: string;
  pin: string;
}

export interface Reminder {
  id: string;
  name: string;
  relation: string;
  type: 'Birthday' | 'Anniversary' | 'Other';
  date: string; // YYYY-MM-DD (year ignored for recurrence)
  avatar?: string;
}

export interface AppNotification {
  id: string;
  kind: 'order' | 'booking' | 'reminder' | 'promo';
  title: string;
  body: string;
  time: string;
  read: boolean;
  image?: string;
}

export const onboardingSlides = [
  { id: 'o1', title: 'Gifts that arrive\nin hours', body: 'Fresh flowers, cakes and curated hampers from the best local sellers — delivered the same day.', image: img('tulips', 900), icon: 'gift' },
  { id: 'o2', title: 'Plan events\nwithout stress', body: 'Book decorators, caterers, photographers, DJs and venues for any celebration in a few taps.', image: img('aisle', 900), icon: 'party-popper' },
  { id: 'o3', title: 'Never miss a\nspecial day', body: 'Save birthdays & anniversaries and get timely reminders with perfect gift ideas.', image: img('balloonCouple', 900), icon: 'bell-ring' },
];

export const seedAddresses: Address[] = [
  { id: 'a1', label: 'Home', name: 'Aarav Mehta', phone: '98765 43210', line: 'Flat 1204, Prestige Lakeside', area: 'Koramangala 5th Block', city: 'Bengaluru', pin: '560095' },
  { id: 'a2', label: 'Work', name: 'Aarav Mehta', phone: '98765 43210', line: 'WeWork Galaxy, 43 Residency Rd', area: 'Shanthala Nagar', city: 'Bengaluru', pin: '560025' },
  { id: 'a3', label: 'Other', name: 'Neha Sharma (Sister)', phone: '99000 11223', line: '22, 3rd Cross, HAL 2nd Stage', area: 'Indiranagar', city: 'Bengaluru', pin: '560038' },
];

export const seedReminders: Reminder[] = [
  { id: 'r1', name: 'Neha Sharma', relation: 'Sister', type: 'Birthday', date: '1995-11-14', avatar: img('avatar5', 200) },
  { id: 'r2', name: 'Mom & Dad', relation: 'Parents', type: 'Anniversary', date: '1990-11-28', avatar: img('avatar2', 200) },
  { id: 'r3', name: 'Rohan Kapoor', relation: 'Best friend', type: 'Birthday', date: '1994-12-06', avatar: img('avatar3', 200) },
  { id: 'r4', name: 'Priya', relation: 'Wife', type: 'Anniversary', date: '2019-02-10', avatar: img('avatar4', 200) },
];

export const seedNotifications: AppNotification[] = [
  { id: 'n1', kind: 'order', title: 'Out for delivery 🚚', body: 'Pink Tulip Bliss Bouquet will reach Neha in 25 mins.', time: '10 min ago', read: false, image: img('tulips', 200) },
  { id: 'n2', kind: 'reminder', title: "Neha's birthday in 4 days 🎂", body: 'Send her favourite cake & flowers. Midnight delivery available.', time: '1 hr ago', read: false, image: img('avatar5', 200) },
  { id: 'n3', kind: 'booking', title: 'Vendor assigned', body: 'Balloon Bae Studio confirmed your Birthday Party décor for 22 Nov.', time: '3 hrs ago', read: false, image: img('balloons', 200) },
  { id: 'n4', kind: 'promo', title: 'Flat 20% off on hampers 🎁', body: 'Use code LOVE20 on hampers above ₹999. Valid till Sunday.', time: 'Yesterday', read: true, image: img('kraftGift', 200) },
  { id: 'n5', kind: 'reminder', title: "Mom & Dad's anniversary on 28 Nov", body: 'Plan a surprise dinner or send a luxury hamper.', time: 'Yesterday', read: true, image: img('avatar2', 200) },
  { id: 'n6', kind: 'order', title: 'Delivered ✅', body: 'Belgian Truffle Collection was delivered to Rohan. Rate your experience!', time: '2 days ago', read: true, image: img('chocBox', 200) },
  { id: 'n7', kind: 'promo', title: 'Wedding season is here 💍', body: 'Book top-rated decorators and photographers with 0% booking fee.', time: '3 days ago', read: true, image: img('aisle', 200) },
];

export const paymentOptions = [
  { id: 'upi', group: 'UPI', name: 'Google Pay', icon: 'google', detail: 'aarav@okhdfc' },
  { id: 'phonepe', group: 'UPI', name: 'PhonePe', icon: 'cellphone', detail: 'Pay via PhonePe app' },
  { id: 'card', group: 'Cards', name: 'HDFC Credit Card', icon: 'credit-card-outline', detail: '•••• 4821' },
  { id: 'netbanking', group: 'More', name: 'Net Banking', icon: 'bank-outline', detail: 'All major banks' },
  { id: 'wallet', group: 'More', name: 'Occasion Wallet', icon: 'wallet-outline', detail: 'Balance ₹350' },
  { id: 'cod', group: 'More', name: 'Cash / Pay on Delivery', icon: 'cash', detail: 'Available for gifts under ₹3,000' },
];

export const faqs = [
  { q: 'Can I schedule a gift for a future date?', a: 'Yes. Pick any date up to 60 days ahead on the product page and choose a time slot, including midnight delivery.' },
  { q: 'Who fulfils my order?', a: 'Occasion is a marketplace. Products and event services are provided by verified third-party sellers and vendors, and we handle payments, support and quality checks.' },
  { q: 'How do event bookings work?', a: 'Pick your event, date and guests, choose services and vendors, and pay a booking amount. Your vendors confirm within 2 hours and a coordinator is assigned.' },
  { q: 'What is the cancellation policy?', a: 'Gift orders can be cancelled before they are prepared. Event bookings cancelled 7+ days before the event get a full refund of the booking amount.' },
  { q: 'When will I get my refund?', a: 'Refunds reach your original payment method in 3–5 working days, or instantly to your Occasion Wallet.' },
];
