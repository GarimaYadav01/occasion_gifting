import { img, ImgKey } from './images';

export interface EventType {
  id: string;
  name: string;
  icon: string;
  image: string;
  from: number;
  tint: string;
  blurb: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  short: string;
  icon: string;
  image: string;
  tint: string;
  subs: string[];
  blurb: string;
}

export interface Pkg {
  id: string;
  name: string;
  price: number;
  includes: string[];
  popular?: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  service: string;
  subs: string[];
  image: string;
  gallery: string[];
  rating: number;
  reviews: number;
  area: string;
  priceFrom: number;
  unit: string;
  experience: number;
  bookings: number;
  responseTime: string;
  verified: boolean;
  description: string;
  packages: Pkg[];
  addons: { id: string; name: string; price: number }[];
  busy: number[]; // day-of-month numbers marked unavailable
  capacity?: string;
  map?: { x: number; y: number };
  tags: string[];
}

export const eventTypes: EventType[] = [
  { id: 'birthday', name: 'Birthday Party', icon: 'cake-variant', image: img('balloons', 500), from: 4999, tint: '#FFE6EF', blurb: 'Balloons, cake & fun' },
  { id: 'anniversary', name: 'Anniversary', icon: 'heart', image: img('greenTable', 500), from: 7999, tint: '#FDECEE', blurb: 'Romantic setups' },
  { id: 'wedding', name: 'Wedding', icon: 'ring', image: img('aisle', 500), from: 149999, tint: '#FFF4DC', blurb: 'Your big day, perfected' },
  { id: 'engagement', name: 'Engagement', icon: 'diamond-stone', image: img('ringsHands', 500), from: 49999, tint: '#F4E9F7', blurb: 'Ring ceremony décor' },
  { id: 'babyshower', name: 'Baby Shower', icon: 'baby-carriage', image: img('pinkBalloons', 500), from: 9999, tint: '#E8F0FE', blurb: 'Pastel themes & games' },
  { id: 'corporate', name: 'Corporate Event', icon: 'briefcase-variant', image: img('audience', 500), from: 24999, tint: '#E4F6EC', blurb: 'Offsites & launches' },
  { id: 'houseparty', name: 'House Party', icon: 'glass-cocktail', image: img('partyLights', 500), from: 5999, tint: '#FFF1DE', blurb: 'DJ, food & lights' },
  { id: 'proposal', name: 'Surprise Proposal', icon: 'heart-flash', image: img('balloonCouple', 500), from: 12999, tint: '#FFE6EF', blurb: 'Say yes in style' },
];

export const serviceCategories: ServiceCategory[] = [
  { id: 'decoration', name: 'Decoration', short: 'Décor', icon: 'balloon', image: img('tableDecor', 500), tint: '#FFE6EF', subs: ['Balloon decoration', 'Theme decoration', 'Flower decoration', 'Stage decoration', 'Entrance decoration'], blurb: 'Balloons, florals & themes' },
  { id: 'catering', name: 'Catering', short: 'Catering', icon: 'silverware-fork-knife', image: img('buffet', 500), tint: '#FFF1DE', subs: ['North Indian', 'South Indian', 'Chinese', 'Italian', 'BBQ', 'Snacks & desserts', 'Mocktails & live counters'], blurb: 'Buffets & live counters' },
  { id: 'photography', name: 'Photo & Video', short: 'Photo', icon: 'camera', image: img('camera', 500), tint: '#E8F0FE', subs: ['Photographer', 'Videographer', 'Drone photography', 'Cinematic video', 'Live streaming'], blurb: 'Capture every moment' },
  { id: 'makeup', name: 'Makeup & Styling', short: 'Makeup', icon: 'face-woman-shimmer', image: img('makeup', 500), tint: '#F4E9F7', subs: ['Makeup artist', 'Hair stylist', 'Bridal makeup'], blurb: 'Look your best' },
  { id: 'entertainment', name: 'Entertainment', short: 'Fun', icon: 'music', image: img('djConfetti', 500), tint: '#EFE7FD', subs: ['DJ', 'Live singer', 'Band', 'Anchor', 'Magician', 'Kids entertainment'], blurb: 'DJs, bands & anchors' },
  { id: 'venue', name: 'Venues', short: 'Venue', icon: 'domain', image: img('banquet', 500), tint: '#FFF4DC', subs: ['Banquet hall', 'Farmhouse', 'Rooftop', 'Party hall', 'Conference hall'], blurb: 'Halls, lawns & rooftops' },
  { id: 'additional', name: 'More Services', short: 'More', icon: 'dots-grid', image: img('crowdWarm', 500), tint: '#E4F6EC', subs: ['Lighting & sound', 'Furniture rental', 'Tent & stage setup', 'Invitation cards', 'Return gifts'], blurb: 'Lights, tents & extras' },
];

export const serviceById = (id: string) => serviceCategories.find(s => s.id === id)!;
export const eventTypeById = (id: string) => eventTypes.find(e => e.id === id);

type VSeed = {
  id: string; name: string; service: string; subs: string[]; image: ImgKey; gallery: ImgKey[];
  rating: number; reviews: number; area: string; priceFrom: number; unit: string; exp: number;
  tags?: string[]; capacity?: string; map?: { x: number; y: number };
};

const vseeds: VSeed[] = [
  // Decoration
  { id: 'v1', name: 'Balloon Bae Studio', service: 'decoration', subs: ['Balloon decoration', 'Theme decoration', 'Entrance decoration'], image: 'balloons', gallery: ['pinkBalloons', 'pineapples', 'balloonCouple'], rating: 4.8, reviews: 1240, area: 'Koramangala', priceFrom: 3499, unit: 'per setup', exp: 6, tags: ['Top rated'] },
  { id: 'v2', name: 'Petal Pavilion Décor', service: 'decoration', subs: ['Flower decoration', 'Stage decoration', 'Entrance decoration'], image: 'aisle', gallery: ['tableDecor', 'lawnChairs', 'longTable'], rating: 4.9, reviews: 860, area: 'Indiranagar', priceFrom: 24999, unit: 'per event', exp: 11, tags: ['Premium'] },
  { id: 'v3', name: 'Theme Story Events', service: 'decoration', subs: ['Theme decoration', 'Stage decoration'], image: 'tableDecor', gallery: ['partyLights', 'greenTable', 'balloons'], rating: 4.6, reviews: 430, area: 'HSR Layout', priceFrom: 8999, unit: 'per setup', exp: 4, tags: [] },
  // Catering
  { id: 'v4', name: 'Saffron Spoon Caterers', service: 'catering', subs: ['North Indian', 'South Indian', 'Mocktails & live counters'], image: 'buffet', gallery: ['longTable', 'fineDining', 'grillPlate'], rating: 4.7, reviews: 2110, area: 'Jayanagar', priceFrom: 549, unit: 'per plate', exp: 14, tags: ['Most booked'] },
  { id: 'v5', name: 'La Tavola Kitchen', service: 'catering', subs: ['Italian', 'Snacks & desserts'], image: 'fineDining', gallery: ['greenTable', 'pancakes', 'toast'], rating: 4.8, reviews: 640, area: 'Whitefield', priceFrom: 899, unit: 'per plate', exp: 8, tags: ['Premium'] },
  { id: 'v6', name: 'Smoke & Grill Co.', service: 'catering', subs: ['BBQ', 'Chinese', 'Snacks & desserts'], image: 'grillPlate', gallery: ['buffet', 'friendsDinner', 'toast'], rating: 4.5, reviews: 520, area: 'Bellandur', priceFrom: 649, unit: 'per plate', exp: 5, tags: [] },
  // Photography
  { id: 'v7', name: 'Frame & Fable Studios', service: 'photography', subs: ['Photographer', 'Cinematic video', 'Drone photography'], image: 'bwCouple', gallery: ['desertCouple', 'brideBouquet', 'weddingHands'], rating: 4.9, reviews: 980, area: 'MG Road', priceFrom: 14999, unit: 'per day', exp: 9, tags: ['Top rated'] },
  { id: 'v8', name: 'Candid Clicks Co.', service: 'photography', subs: ['Photographer', 'Videographer', 'Live streaming'], image: 'camera', gallery: ['balloonCouple', 'partyLights', 'liveStream'], rating: 4.6, reviews: 610, area: 'BTM Layout', priceFrom: 6999, unit: 'per event', exp: 5, tags: ['Budget pick'] },
  { id: 'v9', name: 'SkyView Drone Films', service: 'photography', subs: ['Drone photography', 'Cinematic video'], image: 'desertCouple', gallery: ['weddingTent', 'aisle', 'gazebo'], rating: 4.7, reviews: 290, area: 'Hebbal', priceFrom: 11999, unit: 'per event', exp: 6, tags: [] },
  // Makeup
  { id: 'v10', name: 'Glam by Riya', service: 'makeup', subs: ['Bridal makeup', 'Makeup artist'], image: 'makeup', gallery: ['brushes', 'brideBouquet', 'salon'], rating: 4.9, reviews: 1430, area: 'Indiranagar', priceFrom: 7999, unit: 'per look', exp: 8, tags: ['Top rated'] },
  { id: 'v11', name: 'The Style Lounge', service: 'makeup', subs: ['Hair stylist', 'Makeup artist'], image: 'salon', gallery: ['makeup', 'brushes'], rating: 4.6, reviews: 720, area: 'Koramangala', priceFrom: 2999, unit: 'per person', exp: 7, tags: [] },
  { id: 'v12', name: 'Brush & Blush', service: 'makeup', subs: ['Makeup artist', 'Bridal makeup'], image: 'brushes', gallery: ['makeup', 'salon'], rating: 4.5, reviews: 380, area: 'JP Nagar', priceFrom: 3499, unit: 'per look', exp: 4, tags: ['Budget pick'] },
  // Entertainment
  { id: 'v13', name: 'DJ Neon Nights', service: 'entertainment', subs: ['DJ'], image: 'djConfetti', gallery: ['crowdWarm', 'headphones', 'concertConfetti'], rating: 4.8, reviews: 1120, area: 'Koramangala', priceFrom: 9999, unit: '4 hours', exp: 10, tags: ['Most booked'] },
  { id: 'v14', name: 'The Velvet Strings Band', service: 'entertainment', subs: ['Band', 'Live singer'], image: 'band', gallery: ['crowdWarm', 'liveStream'], rating: 4.7, reviews: 460, area: 'Indiranagar', priceFrom: 34999, unit: 'per show', exp: 12, tags: ['Premium'] },
  { id: 'v15', name: 'Mic Drop Anchors', service: 'entertainment', subs: ['Anchor', 'Kids entertainment', 'Magician'], image: 'audience', gallery: ['confettiCrowd', 'pineapples'], rating: 4.6, reviews: 340, area: 'Whitefield', priceFrom: 7999, unit: 'per event', exp: 7, tags: [] },
  // Venues
  { id: 'v16', name: 'The Grand Orchid Banquet', service: 'venue', subs: ['Banquet hall', 'Party hall'], image: 'banquet', gallery: ['longTable', 'tableDecor', 'aisle'], rating: 4.7, reviews: 890, area: 'MG Road', priceFrom: 89999, unit: 'per day', exp: 15, capacity: '150–600 guests', map: { x: 330, y: 260 }, tags: ['Top rated'] },
  { id: 'v17', name: 'Whispering Pines Farmhouse', service: 'venue', subs: ['Farmhouse'], image: 'weddingTent', gallery: ['gazebo', 'lawnChairs', 'longTable'], rating: 4.8, reviews: 420, area: 'Devanahalli', priceFrom: 74999, unit: 'per day', exp: 9, capacity: '100–800 guests', map: { x: 610, y: 150 }, tags: ['Outdoor'] },
  { id: 'v18', name: 'Skyline Rooftop Lounge', service: 'venue', subs: ['Rooftop', 'Party hall'], image: 'gardenCafe', gallery: ['partyLights', 'greenTable', 'friendsDinner'], rating: 4.6, reviews: 640, area: 'Indiranagar', priceFrom: 39999, unit: 'per evening', exp: 6, capacity: '40–150 guests', map: { x: 480, y: 420 }, tags: ['Trending'] },
  { id: 'v19', name: 'Garden Gazebo Retreat', service: 'venue', subs: ['Farmhouse', 'Banquet hall'], image: 'gazebo', gallery: ['lawnChairs', 'aisle', 'weddingTent'], rating: 4.9, reviews: 310, area: 'Yelahanka', priceFrom: 119999, unit: 'per day', exp: 12, capacity: '200–1000 guests', map: { x: 200, y: 520 }, tags: ['Premium'] },
  { id: 'v20', name: 'Summit Conference Centre', service: 'venue', subs: ['Conference hall'], image: 'conference', gallery: ['audience', 'buffet'], rating: 4.5, reviews: 270, area: 'Whitefield', priceFrom: 49999, unit: 'per day', exp: 10, capacity: '50–400 guests', map: { x: 700, y: 560 }, tags: [] },
  // Additional
  { id: 'v21', name: 'LumaSound Productions', service: 'additional', subs: ['Lighting & sound', 'Tent & stage setup'], image: 'crowdWarm', gallery: ['concertConfetti', 'band', 'headphones'], rating: 4.7, reviews: 510, area: 'Hebbal', priceFrom: 14999, unit: 'per event', exp: 9, tags: [] },
  { id: 'v22', name: 'Rent-a-Royal Furniture', service: 'additional', subs: ['Furniture rental', 'Tent & stage setup'], image: 'lawnChairs', gallery: ['longTable', 'weddingTent'], rating: 4.5, reviews: 280, area: 'Peenya', priceFrom: 9999, unit: 'per event', exp: 8, tags: [] },
  { id: 'v23', name: 'Paper & Gold Invites', service: 'additional', subs: ['Invitation cards', 'Return gifts'], image: 'goldBows', gallery: ['kraftGift', 'redGift'], rating: 4.8, reviews: 650, area: 'Jayanagar', priceFrom: 59, unit: 'per card', exp: 11, tags: ['Top rated'] },
];

const pkgNames = ['Silver', 'Gold', 'Platinum'];

export const vendors: Vendor[] = vseeds.map((s, i) => {
  const cat = serviceById(s.service);
  return {
    id: s.id, name: s.name, service: s.service, subs: s.subs,
    image: img(s.image, 700),
    gallery: [s.image, ...s.gallery].map(k => img(k, 900)),
    rating: s.rating, reviews: s.reviews, area: s.area, priceFrom: s.priceFrom, unit: s.unit,
    experience: s.exp, bookings: s.reviews * 3 + 120, responseTime: i % 2 ? 'within 1 hr' : 'within 30 min',
    verified: true, capacity: s.capacity, map: s.map, tags: s.tags || [],
    description: `${s.name} is one of ${s.area}'s most loved ${cat.name.toLowerCase()} partners with ${s.exp}+ years of experience crafting birthdays, weddings and corporate celebrations. Every booking includes a dedicated coordinator, on-time setup and transparent pricing — no hidden charges.`,
    packages: pkgNames.map((n, k) => ({
      id: `${s.id}-${n.toLowerCase()}`,
      name: n,
      price: Math.round(s.priceFrom * [1, 1.8, 3][k]),
      popular: k === 1,
      includes: [
        `${s.subs[0]} by senior team`,
        k >= 0 ? 'Setup & cleanup included' : '',
        k >= 1 ? `${s.subs[1] || 'Premium materials'}` : '',
        k >= 1 ? 'Dedicated event coordinator' : '',
        k >= 2 ? 'Priority date blocking' : '',
        k >= 2 ? 'Complimentary upgrade & extras' : '',
      ].filter(Boolean),
    })),
    addons: [
      { id: `${s.id}-a1`, name: s.service === 'catering' ? 'Live chaat counter' : s.service === 'photography' ? 'Printed photo album' : s.service === 'venue' ? 'Valet parking' : 'Extra hour', price: Math.round(s.priceFrom * 0.25) + 500 },
      { id: `${s.id}-a2`, name: s.service === 'catering' ? 'Mocktail bar' : s.service === 'decoration' ? 'LED name sign' : 'Express setup', price: Math.round(s.priceFrom * 0.15) + 300 },
      { id: `${s.id}-a3`, name: 'Weekend priority slot', price: 999 },
    ],
    busy: [(i * 3) % 27 + 2, (i * 5) % 27 + 3, (i * 7) % 27 + 1],
  };
});

export const vendorById = (id: string) => vendors.find(v => v.id === id)!;
export const vendorsFor = (service: string) => vendors.filter(v => v.service === service);

export const eventBanners = [
  { id: 'e1', title: 'Plan your\ndream wedding', sub: 'Verified vendors · 0% booking fee', cta: 'Start planning', image: img('aisle', 800), colors: ['#140A2E', '#5A2378'], event: 'wedding' },
  { id: 'e2', title: 'Birthday bash\nfrom ₹4,999', sub: 'Décor + cake + DJ combos', cta: 'Book now', image: img('balloons', 800), colors: ['#7A1F5C', '#E3A72F'], event: 'birthday' },
  { id: 'e3', title: 'Surprise\nproposals', sub: 'Rooftop setups, candles & roses', cta: 'Explore', image: img('balloonCouple', 800), colors: ['#3B1C5A', '#C2185B'], event: 'proposal' },
];

export const guestPresets = [25, 50, 100, 200, 350, 500];
