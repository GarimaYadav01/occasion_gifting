import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../types';

interface CartState {
  items: CartItem[];
  promoCode: string;
  deliveryAddress: string;
}

const initialState: CartState = {
  items: [],
  promoCode: '',
  deliveryAddress: '123 Celebration Lane, Mumbai 400001',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<string>) => {
      const existing = state.items.find(i => i.productId === action.payload);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ productId: action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.productId !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const item = state.items.find(
        i => i.productId === action.payload.productId,
      );
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            i => i.productId !== action.payload.productId,
          );
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearCart: state => {
      state.items = [];
    },
    setPromoCode: (state, action: PayloadAction<string>) => {
      state.promoCode = action.payload;
    },
    setDeliveryAddress: (state, action: PayloadAction<string>) => {
      state.deliveryAddress = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setPromoCode,
  setDeliveryAddress,
} = cartSlice.actions;

export default cartSlice.reducer;
