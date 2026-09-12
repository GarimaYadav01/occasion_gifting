import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderStatus } from '../../types';

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: [
    {
      id: 'OCN-2847',
      items: [
        {
          product: {
            id: 'p1',
            name: 'Rose Elegance Bouquet',
            description: '',
            price: 1299,
            category: 'flowers',
            imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621b9c0ee44?w=800&q=80',
            rating: 4.9,
            reviews: 342,
            sameDayDelivery: true,
            tags: [],
          },
          quantity: 1,
        },
      ],
      total: 1299,
      status: 'delivered',
      createdAt: '2026-06-19T10:00:00',
      estimatedDelivery: '2026-06-19T18:00:00',
      address: '123 Celebration Lane, Mumbai',
      type: 'gift',
    },
    {
      id: 'OCN-2901',
      items: [
        {
          product: {
            id: 'p3',
            name: 'Velvet Chocolate Truffle Cake',
            description: '',
            price: 1499,
            category: 'cakes',
            imageUrl: 'https://images.unsplash.com/photo-1578985545069-69928b1d9587?w=800&q=80',
            rating: 4.9,
            reviews: 567,
            sameDayDelivery: true,
            tags: [],
          },
          quantity: 1,
        },
      ],
      total: 1499,
      status: 'out-for-delivery',
      createdAt: '2026-06-21T09:00:00',
      estimatedDelivery: '2026-06-21T16:00:00',
      address: '123 Celebration Lane, Mumbai',
      type: 'gift',
    },
  ],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: OrderStatus }>,
    ) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
  },
});

export const { addOrder, updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;
