import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventBookingDraft, Notification } from '../../types';
import { notifications as initialNotifications } from '../../data/mockData';

interface AppState {
  notifications: Notification[];
  eventDraft: EventBookingDraft | null;
}

const initialState: AppState = {
  notifications: initialNotifications,
  eventDraft: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        n => n.id === action.payload,
      );
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsRead: state => {
      state.notifications.forEach(n => {
        n.read = true;
      });
    },
    setEventDraft: (state, action: PayloadAction<EventBookingDraft | null>) => {
      state.eventDraft = action.payload;
    },
    updateEventDraft: (
      state,
      action: PayloadAction<Partial<EventBookingDraft>>,
    ) => {
      if (state.eventDraft) {
        state.eventDraft = { ...state.eventDraft, ...action.payload };
      }
    },
  },
});

export const {
  markNotificationRead,
  markAllNotificationsRead,
  setEventDraft,
  updateEventDraft,
} = appSlice.actions;

export default appSlice.reducer;
