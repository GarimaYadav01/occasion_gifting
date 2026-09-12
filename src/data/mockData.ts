import {
  Category,
  EventService,
  Notification,
  Occasion,
  OnboardingSlide,
  Product,
  Venue,
} from '../types';

export const APP_NAME = 'ONG';
export const APP_TAGLINE = 'Occasion & Gifting';

export const giftCategories: Category[] = [
  {
    id: 'flowers',
    name: 'Flowers',
    icon: 'flower-tulip',
    description: 'Fresh blooms for every moment',
    color: '#C5E6F7',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
  },
  {
    id: 'cakes',
    name: 'Cakes',
    icon: 'cake-variant',
    description: 'Handcrafted celebration cakes',
    color: '#D6EBFA',
    imageUrl: 'https://images.unsplash.com/photo-1578985545069-69928b1d9587?w=400&q=80',
  },
  {
    id: 'hampers',
    name: 'Gift Hampers',
    icon: 'gift-outline',
    description: 'Curated luxury gift boxes',
    color: '#E6F2FF',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a1b9238df48?w=400&q=80',
  },
  {
    id: 'personalized',
    name: 'Personalized',
    icon: 'draw-pen',
    description: 'Gifts made just for them',
    color: '#B8D9F0',
    imageUrl: 'https://images.unsplash.com/photo-1513519245858-606abf886b11?w=400&q=80',
  },
  {
    id: 'chocolates',
    name: 'Chocolates',
    icon: 'cookie',
    description: 'Premium artisan chocolates',
    color: '#F0F8FF',
    imageUrl: 'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=400&q=80',
  },
  {
    id: 'surprise',
    name: 'Surprise Gifts',
    icon: 'party-popper',
    description: 'Unforgettable surprises',
    color: '#C5E6F7',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80',
  },
];

export const occasionTypes: Occasion[] = [
  {
    id: 'birthday',
    name: 'Birthday Parties',
    icon: 'cake-variant',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80',
    description: 'Make their day unforgettable',
    startingPrice: 4999,
  },
  {
    id: 'anniversary',
    name: 'Anniversaries',
    icon: 'heart',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    description: 'Celebrate love in style',
    startingPrice: 7999,
  },
  {
    id: 'wedding',
    name: 'Weddings',
    icon: 'rings',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    description: 'Your dream wedding, perfected',
    startingPrice: 49999,
  },
  {
    id: 'baby-shower',
    name: 'Baby Showers',
    icon: 'baby-carriage',
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e5930a6e?w=600&q=80',
    description: 'Welcome the little one',
    startingPrice: 5999,
  },
  {
    id: 'engagement',
    name: 'Engagements',
    icon: 'flower-tulip',
    imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80',
    description: 'Begin forever beautifully',
    startingPrice: 9999,
  },
  {
    id: 'corporate',
    name: 'Corporate Events',
    icon: 'office-building',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80',
    description: 'Professional events done right',
    startingPrice: 14999,
  },
];

export const eventServices: EventService[] = [
  { id: 'decoration', name: 'Decoration', icon: 'balloon', description: 'Stunning themed décor', priceFrom: 2999 },
  { id: 'catering', name: 'Catering', icon: 'silverware-fork-knife', description: 'Gourmet menus for every taste', priceFrom: 4999 },
  { id: 'photography', name: 'Photography', icon: 'camera', description: 'Capture every precious moment', priceFrom: 3999 },
  { id: 'videography', name: 'Videography', icon: 'video', description: 'Cinematic event films', priceFrom: 5999 },
  { id: 'makeup', name: 'Makeup Artist', icon: 'face-woman-shimmer', description: 'Flawless looks for your day', priceFrom: 2499 },
  { id: 'dj', name: 'DJ', icon: 'disc-player', description: 'Keep the party going', priceFrom: 3499 },
  { id: 'live-singer', name: 'Live Singer', icon: 'microphone', description: 'Live music entertainment', priceFrom: 4999 },
  { id: 'venue', name: 'Venue Booking', icon: 'domain', description: 'Premium venues for any size', priceFrom: 9999 },
  { id: 'sound-lighting', name: 'Sound & Lighting', icon: 'spotlight-beam', description: 'Professional AV setup', priceFrom: 3999 },
  { id: 'return-gifts', name: 'Return Gifts', icon: 'gift', description: 'Thoughtful guest favors', priceFrom: 1499 },
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Rose Elegance Bouquet',
    description:
      'Two dozen premium red roses arranged with eucalyptus and satin ribbon. Perfect for romantic gestures.',
    price: 1299,
    originalPrice: 1599,
    category: 'flowers',
    imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621b9c0ee44?w=800&q=80',
    rating: 4.9,
    reviews: 342,
    sameDayDelivery: true,
    tags: ['Bestseller', 'Same Day'],
  },
  {
    id: 'p2',
    name: 'Pastel Dream Arrangement',
    description:
      'Soft pink, lavender, and cream blooms in a ceramic vase. A gentle luxury statement.',
    price: 1899,
    category: 'flowers',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    rating: 4.8,
    reviews: 218,
    sameDayDelivery: true,
    tags: ['Premium'],
  },
  {
    id: 'p3',
    name: 'Velvet Chocolate Truffle Cake',
    description:
      'Rich dark chocolate layers with gold-dusted truffles. Serves 12–15 guests.',
    price: 1499,
    category: 'cakes',
    imageUrl: 'https://images.unsplash.com/photo-1578985545069-69928b1d9587?w=800&q=80',
    rating: 4.9,
    reviews: 567,
    sameDayDelivery: true,
    tags: ['Bestseller', 'Same Day'],
  },
  {
    id: 'p4',
    name: 'Blush Birthday Cake',
    description:
      'Vanilla sponge with strawberry cream and pastel buttercream florals.',
    price: 1199,
    category: 'cakes',
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80',
    rating: 4.7,
    reviews: 412,
    sameDayDelivery: true,
    tags: ['Same Day'],
  },
  {
    id: 'p5',
    name: 'Luxury Celebration Hamper',
    description:
      'Champagne, artisan chocolates, scented candles, and gourmet treats in a velvet box.',
    price: 3499,
    originalPrice: 3999,
    category: 'hampers',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a1b9238df48?w=800&q=80',
    rating: 4.9,
    reviews: 189,
    sameDayDelivery: false,
    tags: ['Premium', 'Gift Set'],
  },
  {
    id: 'p6',
    name: 'Wellness Retreat Hamper',
    description:
      'Organic teas, bath salts, silk eye mask, and aromatherapy essentials.',
    price: 2199,
    category: 'hampers',
    imageUrl: 'https://images.unsplash.com/photo-1602874801006-4fe3723ac8cc?w=800&q=80',
    rating: 4.6,
    reviews: 134,
    sameDayDelivery: false,
    tags: ['Self Care'],
  },
  {
    id: 'p7',
    name: 'Engraved Crystal Keepsake',
    description:
      'Personalized crystal heart with custom message and gift packaging.',
    price: 1799,
    category: 'personalized',
    imageUrl: 'https://images.unsplash.com/photo-1603400521630-d9f0a9a2a2c2?w=800&q=80',
    rating: 4.8,
    reviews: 276,
    sameDayDelivery: false,
    tags: ['Personalized'],
  },
  {
    id: 'p8',
    name: 'Custom Photo Frame Set',
    description:
      'Set of three rose-gold frames with your photos printed and delivered.',
    price: 999,
    category: 'personalized',
    imageUrl: 'https://images.unsplash.com/photo-1513519245858-606abf886b11?w=800&q=80',
    rating: 4.5,
    reviews: 98,
    sameDayDelivery: false,
    tags: ['Personalized'],
  },
  {
    id: 'p9',
    name: 'Belgian Praline Collection',
    description:
      '24 handcrafted pralines in a satin-lined box. Dark, milk, and white varieties.',
    price: 899,
    category: 'chocolates',
    imageUrl: 'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=800&q=80',
    rating: 4.9,
    reviews: 445,
    sameDayDelivery: true,
    tags: ['Bestseller', 'Same Day'],
  },
  {
    id: 'p10',
    name: 'Rose Gold Chocolate Hearts',
    description:
      'Limited edition heart-shaped chocolates with edible gold leaf.',
    price: 649,
    category: 'chocolates',
    imageUrl: 'https://images.unsplash.com/photo-1549007953-0d492ba21c11?w=800&q=80',
    rating: 4.7,
    reviews: 312,
    sameDayDelivery: true,
    tags: ['Same Day'],
  },
  {
    id: 'p11',
    name: 'Midnight Surprise Box',
    description:
      'Balloons, confetti, LED lights, and a mystery gift delivered at midnight.',
    price: 2499,
    category: 'surprise',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
    rating: 4.8,
    reviews: 167,
    sameDayDelivery: true,
    tags: ['Surprise', 'Same Day'],
  },
  {
    id: 'p12',
    name: 'Flash Mob Experience',
    description:
      'Coordinated surprise performance with dancers and a personalized song.',
    price: 5999,
    category: 'surprise',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    rating: 4.9,
    reviews: 54,
    sameDayDelivery: false,
    tags: ['Premium', 'Experience'],
  },
];

export const venues: Venue[] = [
  {
    id: 'v1',
    name: 'The Grand Lavender Hall',
    location: 'Downtown, 2.4 km',
    capacity: 300,
    pricePerDay: 45000,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
    amenities: ['Parking', 'AC', 'Catering Kitchen', 'Stage'],
  },
  {
    id: 'v2',
    name: 'Rose Garden Terrace',
    location: 'Westside, 5.1 km',
    capacity: 150,
    pricePerDay: 28000,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    amenities: ['Garden', 'Outdoor', 'Photography Spots'],
  },
  {
    id: 'v3',
    name: 'Crystal Ballroom',
    location: 'City Center, 1.8 km',
    capacity: 500,
    pricePerDay: 75000,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80',
    amenities: ['Valet', 'Premium AV', 'Bridal Suite', 'Bar'],
  },
  {
    id: 'v4',
    name: 'Intimate Studio Loft',
    location: 'Arts District, 3.2 km',
    capacity: 50,
    pricePerDay: 12000,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
    amenities: ['Natural Light', 'Minimal Décor', 'Sound System'],
  },
];

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Gift with Love',
    subtitle:
      'Send flowers, cakes, hampers, and personalized gifts — delivered with care.',
    emoji: '🎁',
  },
  {
    id: '2',
    title: 'Plan Every Occasion',
    subtitle:
      'Book complete event services from decoration to venue — all in one place.',
    emoji: '🎉',
  },
  {
    id: '3',
    title: 'Never Miss a Moment',
    subtitle:
      'Smart reminders and same-day delivery keep every celebration on time.',
    emoji: '⏰',
  },
];

export const notifications: Notification[] = [
  {
    id: 'n1',
    title: 'Same-Day Delivery Available',
    message: 'Order within 2 hours for delivery today in your area.',
    type: 'promo',
    read: false,
    createdAt: '2026-06-21T10:00:00',
  },
  {
    id: 'n2',
    title: "Sarah's Birthday Tomorrow",
    message: 'Send a gift now and we will deliver it on time.',
    type: 'reminder',
    read: false,
    createdAt: '2026-06-20T09:00:00',
  },
  {
    id: 'n3',
    title: 'Order #OCN-2847 Delivered',
    message: 'Your Rose Elegance Bouquet was delivered successfully.',
    type: 'order',
    read: true,
    createdAt: '2026-06-19T16:30:00',
  },
  {
    id: 'n4',
    title: 'Anniversary Reminder',
    message: 'Your 5th anniversary is in 3 days. Plan something special!',
    type: 'occasion',
    read: false,
    createdAt: '2026-06-18T08:00:00',
  },
];

export const occasionChips = [
  { id: 'birthday', label: 'Birthday', icon: 'cake-variant' },
  { id: 'anniversary', label: 'Anniversary', icon: 'heart' },
  { id: 'love', label: 'Love & Romance', icon: 'heart-outline' },
  { id: 'wedding', label: 'Wedding', icon: 'rings' },
  { id: 'congrats', label: 'Congratulations', icon: 'party-popper' },
  { id: 'sorry', label: 'Sorry', icon: 'hand-heart' },
];

export const promoBanners = [
  {
    id: 'b1',
    title: 'Same-Day Gifting',
    subtitle: 'Order by 4 PM, delivered today',
    icon: 'flash',
    color: '#C5E6F7',
  },
  {
    id: 'b2',
    title: '20% Off Hampers',
    subtitle: 'Limited time luxury collection',
    icon: 'sale',
    color: '#D6EBFA',
  },
];

export const trustBadges = [
  { id: 't1', label: 'Trusted Providers', icon: 'shield-check' },
  { id: 't2', label: 'Same-Day Delivery', icon: 'flash' },
  { id: 't3', label: 'Secure Payments', icon: 'lock' },
];

export const getProductById = (id: string): Product | undefined =>
  products.find(p => p.id === id);

export const getProductsByCategory = (categoryId: string): Product[] =>
  products.filter(p => p.category === categoryId);

export const getCategoryById = (id: string): Category | undefined =>
  giftCategories.find(c => c.id === id);

export const formatPrice = (amount: number): string =>
  `₹${amount.toLocaleString('en-IN')}`;
