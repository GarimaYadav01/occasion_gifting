import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import app from './slices/app';
import shop from './slices/shop';
import booking from './slices/booking';
import orders from './slices/orders';
import profile from './slices/profile';

export const store = configureStore({
  reducer: { app, shop, booking, orders, profile },
  middleware: m => m({ serializableCheck: false, immutableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
