import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address, AppNotification, Reminder, seedAddresses, seedNotifications, seedReminders } from '../../data/user';

interface ProfileState {
  addresses: Address[];
  selectedAddress: string;
  reminders: Reminder[];
  notifications: AppNotification[];
}

const initialState: ProfileState = {
  addresses: seedAddresses,
  selectedAddress: 'a1',
  reminders: seedReminders,
  notifications: seedNotifications,
};

const profile = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    saveAddress: (s, a: PayloadAction<Address>) => {
      const i = s.addresses.findIndex(x => x.id === a.payload.id);
      if (i >= 0) { s.addresses[i] = a.payload; } else { s.addresses.push(a.payload); }
      s.selectedAddress = a.payload.id;
    },
    deleteAddress: (s, a: PayloadAction<string>) => {
      s.addresses = s.addresses.filter(x => x.id !== a.payload);
      if (s.selectedAddress === a.payload) { s.selectedAddress = s.addresses[0]?.id || ''; }
    },
    selectAddress: (s, a: PayloadAction<string>) => { s.selectedAddress = a.payload; },
    addReminder: (s, a: PayloadAction<Reminder>) => { s.reminders.push(a.payload); },
    deleteReminder: (s, a: PayloadAction<string>) => { s.reminders = s.reminders.filter(r => r.id !== a.payload); },
    markAllRead: s => { s.notifications.forEach(n => { n.read = true; }); },
    markRead: (s, a: PayloadAction<string>) => {
      const n = s.notifications.find(x => x.id === a.payload);
      if (n) { n.read = true; }
    },
    pushNotification: (s, a: PayloadAction<AppNotification>) => { s.notifications.unshift(a.payload); },
    clearNotifications: s => { s.notifications = []; },
  },
});

export const { saveAddress, deleteAddress, selectAddress, addReminder, deleteReminder, markAllRead, markRead, pushNotification, clearNotifications } = profile.actions;
export default profile.reducer;
