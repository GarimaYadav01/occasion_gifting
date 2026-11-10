import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  key: string;
  productId: string;
  qty: number;
  options: Record<string, string>;
  extra: number;
  date?: string;
  slot?: string;
  message?: string;
  sender?: string;
  receiver?: string;
}

interface ShopState {
  cart: CartItem[];
  coupon: string | null;
  wishProducts: string[];
  wishVendors: string[];
}

const initialState: ShopState = { cart: [], coupon: null, wishProducts: ['p3', 'p16', 'p24'], wishVendors: ['v2', 'v7'] };

const shop = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    addToCart: (s, a: PayloadAction<Omit<CartItem, 'key' | 'qty'> & { qty?: number }>) => {
      const key = a.payload.productId + JSON.stringify(a.payload.options || {});
      const found = s.cart.find(i => i.key === key);
      if (found) {
        found.qty += a.payload.qty || 1;
        Object.assign(found, { ...a.payload, qty: found.qty, key });
      } else {
        s.cart.push({ ...a.payload, key, qty: a.payload.qty || 1 });
      }
    },
    changeQty: (s, a: PayloadAction<{ key: string; delta: number }>) => {
      const it = s.cart.find(i => i.key === a.payload.key);
      if (!it) { return; }
      it.qty += a.payload.delta;
      if (it.qty <= 0) { s.cart = s.cart.filter(i => i.key !== a.payload.key); }
    },
    // Quick +/- from product cards: operate on the default-option line for a product.
    quickQty: (s, a: PayloadAction<{ productId: string; delta: number }>) => {
      const it = [...s.cart].reverse().find(i => i.productId === a.payload.productId);
      if (it) {
        it.qty += a.payload.delta;
        if (it.qty <= 0) { const k = it.key; s.cart = s.cart.filter(i => i.key !== k); }
      } else if (a.payload.delta > 0) {
        s.cart.push({ key: a.payload.productId + '{}', productId: a.payload.productId, qty: 1, options: {}, extra: 0 });
      }
    },
    removeFromCart: (s, a: PayloadAction<string>) => { s.cart = s.cart.filter(i => i.key !== a.payload); },
    clearCart: s => { s.cart = []; s.coupon = null; },
    applyCoupon: (s, a: PayloadAction<string | null>) => { s.coupon = a.payload; },
    toggleWishProduct: (s, a: PayloadAction<string>) => {
      s.wishProducts = s.wishProducts.includes(a.payload) ? s.wishProducts.filter(i => i !== a.payload) : [a.payload, ...s.wishProducts];
    },
    toggleWishVendor: (s, a: PayloadAction<string>) => {
      s.wishVendors = s.wishVendors.includes(a.payload) ? s.wishVendors.filter(i => i !== a.payload) : [a.payload, ...s.wishVendors];
    },
  },
});

export const { addToCart, changeQty, quickQty, removeFromCart, clearCart, applyCoupon, toggleWishProduct, toggleWishVendor } = shop.actions;
export default shop.reducer;
