import { coupons, productById, timeSlots } from '../data/gifts';
import { vendorById } from '../data/events';
import { CartItem } from '../store/slices/shop';
import { BookingDraft, ServicePick } from '../store/slices/booking';

export const linePrice = (i: CartItem) => (productById(i.productId).price + (i.extra || 0)) * i.qty;

export const cartTotals = (items: CartItem[], couponCode: string | null) => {
  const subtotal = items.reduce((s, i) => s + linePrice(i), 0);
  const mrp = items.reduce((s, i) => s + (productById(i.productId).mrp + (i.extra || 0)) * i.qty, 0);
  const slotFee = items.reduce((m, i) => Math.max(m, timeSlots.find(t => t.label === i.slot)?.fee || 0), 0);
  const delivery = subtotal === 0 || subtotal >= 499 ? 0 : 49;
  const handling = items.length ? 9 : 0;
  const coupon = coupons.find(c => c.code === couponCode);
  let discount = 0;
  if (coupon && subtotal >= coupon.min) {
    discount = coupon.pct ? Math.min(Math.round((subtotal * coupon.pct) / 100), coupon.off) : coupon.off;
  }
  const total = subtotal + delivery + handling + slotFee - discount;
  const count = items.reduce((s, i) => s + i.qty, 0);
  return { subtotal, mrp, savings: mrp - subtotal + discount, delivery, handling, slotFee, discount, total, count, coupon };
};

export const serviceAmount = (service: string, pick: ServicePick | undefined, guests: number) => {
  if (!pick?.vendorId) { return 0; }
  const v = vendorById(pick.vendorId);
  const pkg = v.packages.find(p => p.id === pick.packageId) || v.packages[0];
  const perHead = v.unit === 'per plate' || v.unit === 'per card' || v.unit === 'per person';
  const base = perHead ? pkg.price * (service === 'makeup' ? Math.min(guests, 4) : guests) : pkg.price;
  const addons = v.addons.filter(a => pick.addons.includes(a.id)).reduce((s, a) => s + a.price, 0);
  return base + addons;
};

export const bookingTotals = (d: BookingDraft) => {
  const lines = d.services.map(s => ({ service: s, amount: serviceAmount(s, d.picks[s], d.guests) }));
  let venueAmt = 0;
  if (d.venue.mode === 'venue' && d.venue.vendorId && !d.services.includes('venue')) {
    venueAmt = vendorById(d.venue.vendorId).priceFrom;
  }
  const subtotal = lines.reduce((s, l) => s + l.amount, 0) + venueAmt;
  const platform = subtotal ? 199 : 0;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + platform + gst;
  const advance = Math.round(total * 0.2);
  return { lines, venueAmt, subtotal, platform, gst, total, advance };
};
