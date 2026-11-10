import { img, ImgKey } from './images';

export interface GiftCategory {
  id: string;
  name: string;
  icon: string;
  tint: string;
  image: string;
  subs: string[];
  tagline: string;
}

export interface Customization {
  label: string;
  options: { name: string; price: number }[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sub: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  size: string;
  seller: string;
  sameDay: boolean;
  eta: string;
  popularity: number;
  addedDaysAgo: number;
  tags: string[];
  occasions: string[];
  description: string;
  highlights: string[];
  customizations: Customization[];
}

export const giftCategories: GiftCategory[] = [
  { id: 'flowers', name: 'Flowers', icon: 'flower-tulip', tint: '#FFE6EF', image: img('tulips', 400), subs: ['All', 'Roses', 'Bouquets', 'Exotic', 'Flower Boxes'], tagline: 'Fresh blooms, hand-tied today' },
  { id: 'cakes', name: 'Cakes', icon: 'cake-variant', tint: '#FFF1DE', image: img('pinkDripCake', 400), subs: ['All', 'Chocolate', 'Fruit', 'Designer', 'Desserts'], tagline: 'Baked fresh in 2 hours' },
  { id: 'chocolates', name: 'Chocolates', icon: 'candy', tint: '#F3E7DF', image: img('chocBox', 400), subs: ['All', 'Truffles', 'Gift Boxes', 'Bars & Bites'], tagline: 'Artisan & imported' },
  { id: 'hampers', name: 'Gift Hampers', icon: 'basket', tint: '#E9F5EC', image: img('fruitPlatter', 400), subs: ['All', 'Gourmet', 'Fruit', 'Luxury'], tagline: 'Curated boxes of joy' },
  { id: 'personalized', name: 'Personalized', icon: 'draw-pen', tint: '#E8F0FE', image: img('perfume', 400), subs: ['All', 'Accessories', 'Fragrance', 'Jewellery'], tagline: 'Made just for them' },
  { id: 'surprise', name: 'Surprise Gifts', icon: 'party-popper', tint: '#F4E9F7', image: img('balloons', 400), subs: ['All', 'Balloons', 'Combos', 'Experiences'], tagline: 'Unforgettable moments' },
];

export const occasions = [
  { id: 'birthday', name: 'Birthday', icon: 'cake-variant', image: img('sprinkleCake', 300), tint: '#FFE6EF' },
  { id: 'anniversary', name: 'Anniversary', icon: 'heart', image: img('heartFlowers', 300), tint: '#FDECEE' },
  { id: 'wedding', name: 'Wedding', icon: 'ring', image: img('weddingCake', 300), tint: '#FFF4DC' },
  { id: 'engagement', name: 'Engagement', icon: 'diamond-stone', image: img('goldRings', 300), tint: '#F4E9F7' },
  { id: 'babyshower', name: 'Baby Shower', icon: 'baby-carriage', image: img('pinkBalloons', 300), tint: '#E8F0FE' },
  { id: 'congrats', name: 'Congrats', icon: 'trophy-variant', image: img('confettiTeal', 300), tint: '#E4F6EC' },
];

const cakeCustom: Customization[] = [
  { label: 'Weight', options: [{ name: '500 g', price: 0 }, { name: '1 kg', price: 450 }, { name: '2 kg', price: 1100 }] },
  { label: 'Type', options: [{ name: 'With egg', price: 0 }, { name: 'Eggless', price: 50 }] },
];
const flowerCustom: Customization[] = [
  { label: 'Size', options: [{ name: 'Regular', price: 0 }, { name: 'Premium', price: 300 }, { name: 'Grand', price: 700 }] },
  { label: 'Add-on', options: [{ name: 'None', price: 0 }, { name: 'Greeting card', price: 49 }, { name: 'Teddy bear', price: 299 }] },
];
const chocCustom: Customization[] = [
  { label: 'Box size', options: [{ name: '12 pcs', price: 0 }, { name: '24 pcs', price: 549 }] },
];
const persCustom: Customization[] = [
  { label: 'Engraving', options: [{ name: 'No engraving', price: 0 }, { name: 'Name engraving', price: 199 }] },
  { label: 'Gift wrap', options: [{ name: 'Standard', price: 0 }, { name: 'Luxury box', price: 149 }] },
];

type Seed = [
  id: string,
  name: string,
  category: string,
  sub: string,
  price: number,
  mrp: number,
  rating: number,
  reviews: number,
  image: ImgKey,
  extra: ImgKey[],
  size: string,
  seller: string,
  sameDay: boolean,
  occasions: string[],
  tags: string[],
];

const seeds: Seed[] = [
  ['p1', 'Pink Tulip Bliss Bouquet', 'flowers', 'Bouquets', 899, 1199, 4.8, 2341, 'tulips', ['pastelVase', 'mixedBouquet'], '12 stems', 'Bloom Studio', true, ['birthday', 'anniversary'], ['Bestseller']],
  ['p2', 'Sunshine Sunflower Bunch', 'flowers', 'Bouquets', 749, 999, 4.7, 1180, 'sunflowers', ['orangeBlooms'], '8 stems', 'Petal & Co.', true, ['congrats', 'birthday'], ['Trending']],
  ['p3', 'Rainbow Rose Luxe Box', 'flowers', 'Flower Boxes', 1899, 2499, 4.9, 864, 'rainbowRoses', ['heartFlowers'], '24 roses', 'Bloom Studio', true, ['anniversary', 'engagement'], ['Premium']],
  ['p4', 'Pastel Garden Vase', 'flowers', 'Exotic', 1299, 1599, 4.6, 532, 'pastelVase', ['tulips'], 'Glass vase', 'Ferns Florist', false, ['wedding', 'babyshower'], []],
  ['p5', 'Love in Bloom Heart', 'flowers', 'Roses', 1499, 1999, 4.8, 1907, 'heartFlowers', ['rainbowRoses'], '30 blooms', 'Petal & Co.', true, ['anniversary'], ['Bestseller']],
  ['p6', 'Wildflower Meadow Bouquet', 'flowers', 'Bouquets', 999, 1299, 4.5, 412, 'mixedBouquet', ['orangeBlooms'], '15 stems', 'Ferns Florist', true, ['birthday', 'congrats'], ['New']],
  ['p7', 'Golden Poppy Basket', 'flowers', 'Exotic', 1149, 1399, 4.4, 220, 'orangeBlooms', ['sunflowers'], 'Wicker basket', 'Bloom Studio', false, ['congrats'], []],

  ['p8', 'Strawberry Drip Celebration Cake', 'cakes', 'Designer', 849, 999, 4.8, 3120, 'pinkDripCake', ['layerCake'], '500 g', 'The Cake Atelier', true, ['birthday'], ['Bestseller']],
  ['p9', 'Classic Black Forest', 'cakes', 'Chocolate', 649, 799, 4.7, 4211, 'blackForest', ['brownies'], '500 g', 'Bake House', true, ['birthday', 'anniversary'], ['Trending']],
  ['p10', 'Rainbow Sprinkle Party Cake', 'cakes', 'Designer', 999, 1249, 4.6, 980, 'sprinkleCake', ['rainbowSlice'], '1 kg', 'The Cake Atelier', true, ['birthday', 'congrats'], ['New']],
  ['p11', 'Blush Floral Wedding Tier', 'cakes', 'Designer', 4499, 5299, 4.9, 214, 'weddingCake', ['layerCake'], '3 kg', 'Sugar & Lace', false, ['wedding', 'engagement'], ['Premium']],
  ['p12', 'Tiramisu Layer Cake', 'cakes', 'Chocolate', 899, 1099, 4.7, 760, 'layerCake', ['dessertJars'], '500 g', 'Bake House', true, ['anniversary'], []],
  ['p13', 'Vanilla Rose Cupcakes', 'cakes', 'Desserts', 549, 699, 4.5, 1340, 'cupcakes', ['dessertJars'], 'Box of 6', 'Sugar & Lace', true, ['babyshower', 'birthday'], []],
  ['p14', 'Strawberry Cream Jars', 'cakes', 'Fruit', 499, 599, 4.6, 640, 'dessertJars', ['cupcakes'], 'Set of 4', 'The Cake Atelier', true, ['birthday'], ['New']],
  ['p15', 'Rainbow Slice & Candle', 'cakes', 'Desserts', 299, 349, 4.3, 410, 'rainbowSlice', ['sprinkleCake'], '1 slice', 'Bake House', true, ['birthday'], []],

  ['p16', 'Belgian Truffle Collection', 'chocolates', 'Truffles', 1199, 1499, 4.8, 1520, 'chocBox', ['chocPieces'], '12 pcs', 'Cocoa Craft', true, ['anniversary', 'birthday'], ['Bestseller']],
  ['p17', 'White Almond Bark', 'chocolates', 'Bars & Bites', 549, 649, 4.5, 380, 'whiteChoc', ['chocPieces'], '200 g', 'Cocoa Craft', true, ['congrats'], []],
  ['p18', 'Artisan Praline Box', 'chocolates', 'Gift Boxes', 899, 1099, 4.7, 712, 'chocPieces', ['chocBox'], '16 pcs', 'Maison Cacao', true, ['wedding', 'engagement'], ['Trending']],
  ['p19', 'Candy Bar Party Hamper', 'chocolates', 'Gift Boxes', 1299, 1599, 4.6, 960, 'candyBars', ['redGift'], '25 bars', 'Snack Joy', true, ['birthday', 'congrats'], ['New']],
  ['p20', 'Fudge Brownie Box', 'chocolates', 'Bars & Bites', 449, 549, 4.6, 1210, 'brownies', ['cookies'], 'Box of 6', 'Bake House', true, ['birthday'], []],
  ['p21', 'Choco Chip Cookie Tin', 'chocolates', 'Bars & Bites', 399, 499, 4.4, 860, 'cookies', ['brownies'], '400 g', 'Snack Joy', true, ['congrats'], []],

  ['p22', 'Fresh Fruit Fiesta Hamper', 'hampers', 'Fruit', 1599, 1999, 4.7, 540, 'fruitPlatter', ['figBowl'], '4 kg', 'Orchard Fresh', true, ['congrats', 'babyshower'], ['Trending']],
  ['p23', 'Gourmet Fig & Nut Bowl', 'hampers', 'Gourmet', 1899, 2299, 4.8, 320, 'figBowl', ['fruitPlatter'], '1.5 kg', 'Orchard Fresh', false, ['anniversary', 'wedding'], ['Premium']],
  ['p24', 'Signature Kraft Gift Box', 'hampers', 'Luxury', 2499, 2999, 4.8, 640, 'kraftGift', ['goldBows'], '8 items', 'The Gift Loft', true, ['birthday', 'anniversary'], ['Bestseller']],
  ['p25', 'Ruby Red Surprise Hamper', 'hampers', 'Luxury', 2999, 3699, 4.9, 410, 'redGift', ['kraftGift'], '10 items', 'The Gift Loft', true, ['anniversary', 'engagement'], []],
  ['p26', 'Golden Bow Celebration Box', 'hampers', 'Gourmet', 1799, 2199, 4.6, 290, 'goldBows', ['redGift'], '6 items', 'Hamper House', false, ['wedding', 'congrats'], ['New']],

  ['p27', 'Engraved Gold Couple Rings', 'personalized', 'Jewellery', 3499, 4299, 4.8, 520, 'goldRings', ['weddingHands'], 'Pair', 'Aurum Gifts', false, ['engagement', 'anniversary'], ['Premium']],
  ['p28', 'Monogram Signature Perfume', 'personalized', 'Fragrance', 2299, 2799, 4.7, 410, 'perfume', ['goldBows'], '100 ml', 'Scent Story', true, ['birthday', 'anniversary'], ['Trending']],
  ['p29', 'Initials Leather Handbag', 'personalized', 'Accessories', 3999, 4999, 4.6, 230, 'handbag', ['kraftGift'], 'Medium', 'Crafted Co.', false, ['birthday'], ['New']],

  ['p30', 'Balloon Bouquet Surprise', 'surprise', 'Balloons', 999, 1299, 4.7, 1320, 'balloons', ['pinkBalloons'], '20 balloons', 'Party Pop', true, ['birthday', 'congrats'], ['Bestseller']],
  ['p31', 'Its-a-Girl Pastel Balloons', 'surprise', 'Balloons', 799, 999, 4.6, 410, 'pinkBalloons', ['balloons'], '15 balloons', 'Party Pop', true, ['babyshower'], []],
  ['p32', 'Party-in-a-Box Combo', 'surprise', 'Combos', 1499, 1899, 4.5, 360, 'pineapples', ['confettiTeal'], 'Cake + decor', 'Party Pop', true, ['birthday'], ['Trending']],
  ['p33', 'Candlelight Dinner for Two', 'surprise', 'Experiences', 5999, 7499, 4.9, 180, 'greenTable', ['fineDining'], '2 guests', 'Moments Co.', false, ['anniversary', 'engagement'], ['Premium']],
];

const customFor = (cat: string) =>
  cat === 'cakes' ? cakeCustom : cat === 'flowers' ? flowerCustom : cat === 'chocolates' ? chocCustom : cat === 'personalized' ? persCustom : [];

const descFor = (name: string, cat: string) => {
  const map: Record<string, string> = {
    flowers: 'Hand-picked fresh blooms arranged by expert florists the same morning they are delivered. Wrapped in premium paper with a satin ribbon.',
    cakes: 'Freshly baked to order with premium ingredients, real cream and no preservatives. Delivered chilled in a sturdy box.',
    chocolates: 'Crafted by artisan chocolatiers using single-origin cocoa. Beautifully boxed and ready to gift.',
    hampers: 'A curated hamper of handpicked treats, packed in a reusable keepsake box with a personal note.',
    personalized: 'A thoughtful keepsake personalised with their name or initials, crafted to last a lifetime.',
    surprise: 'A complete surprise experience set up by our trusted partners — just pick a time and we handle the rest.',
  };
  return `${name} — ${map[cat]}`;
};

export const products: Product[] = seeds.map((s, i) => {
  const [id, name, category, sub, price, mrp, rating, reviews, image, extra, size, seller, sameDay, occ, tags] = s;
  return {
    id, name, category, sub, price, mrp, rating, reviews, size, seller, sameDay, tags,
    occasions: occ,
    image: img(image, 500),
    gallery: [img(image, 900), ...extra.map(e => img(e, 900))],
    eta: sameDay ? (i % 3 === 0 ? 'in 2 hrs' : 'Today') : 'Tomorrow',
    popularity: reviews,
    addedDaysAgo: (i * 7) % 40,
    description: descFor(name, category),
    highlights: ['100% fresh & quality checked', sameDay ? 'Same-day delivery available' : 'Next-day delivery', 'Free personalised message card', 'Sold by ' + seller],
    customizations: customFor(category),
  };
});

export const productById = (id: string) => products.find(p => p.id === id)!;

export const timeSlots = [
  { id: 's1', label: '9 AM – 12 PM', fee: 0 },
  { id: 's2', label: '12 PM – 3 PM', fee: 0 },
  { id: 's3', label: '3 PM – 6 PM', fee: 0 },
  { id: 's4', label: '6 PM – 9 PM', fee: 49 },
  { id: 's5', label: 'Midnight 11:30 – 12', fee: 199 },
];

export const coupons = [
  { code: 'FIRSTGIFT', title: 'Flat ₹150 off on first order', min: 699, off: 150, pct: 0 },
  { code: 'LOVE20', title: '20% off up to ₹300', min: 999, off: 300, pct: 20 },
  { code: 'CAKE100', title: '₹100 off on cakes above ₹799', min: 799, off: 100, pct: 0 },
];

export const giftBanners = [
  { id: 'b1', title: 'Anniversary\nSpecials', sub: 'Up to 40% off on roses & hampers', cta: 'Shop now', image: img('heartFlowers', 800), colors: ['#6A1B84', '#B0408F'], link: { category: 'flowers' } },
  { id: 'b2', title: 'Cakes in\n2 hours', sub: 'Freshly baked, delivered fast', cta: 'Order cake', image: img('pinkDripCake', 800), colors: ['#C2185B', '#FF6F91'], link: { category: 'cakes' } },
  { id: 'b3', title: 'Luxury\nHampers', sub: 'Curated gifts from ₹1,499', cta: 'Explore', image: img('kraftGift', 800), colors: ['#7A4A12', '#D9A43A'], link: { category: 'hampers' } },
];
