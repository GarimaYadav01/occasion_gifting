import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ServicePick {
  vendorId?: string;
  packageId?: string;
  addons: string[];
  notes: string;
}

export interface BookingDraft {
  eventType?: string;
  date?: string;
  time: string;
  guests: number;
  services: string[];
  picks: Record<string, ServicePick>;
  venue: { mode: 'venue' | 'address'; vendorId?: string; address?: string; landmark?: string };
  payment: string;
}

const initialState: BookingDraft = {
  time: '07:00 PM',
  guests: 50,
  services: [],
  picks: {},
  venue: { mode: 'venue' },
  payment: 'upi',
};

const booking = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    resetDraft: () => initialState,
    setDraft: (s, a: PayloadAction<Partial<BookingDraft>>) => ({ ...s, ...a.payload }),
    toggleService: (s, a: PayloadAction<string>) => {
      if (s.services.includes(a.payload)) {
        s.services = s.services.filter(x => x !== a.payload);
        delete s.picks[a.payload];
      } else {
        s.services.push(a.payload);
        s.picks[a.payload] = s.picks[a.payload] || { addons: [], notes: '' };
      }
    },
    pickVendor: (s, a: PayloadAction<{ service: string; vendorId: string; packageId?: string }>) => {
      const { service, vendorId, packageId } = a.payload;
      if (!s.services.includes(service)) { s.services.push(service); }
      const prev = s.picks[service];
      const sameVendor = prev?.vendorId === vendorId;
      s.picks[service] = {
        vendorId,
        packageId: packageId || (sameVendor ? prev?.packageId : undefined) || `${vendorId}-gold`,
        addons: sameVendor ? prev.addons : [],
        notes: prev?.notes || '',
      };
    },
    updatePick: (s, a: PayloadAction<{ service: string; patch: Partial<ServicePick> }>) => {
      s.picks[a.payload.service] = { ...(s.picks[a.payload.service] || { addons: [], notes: '' }), ...a.payload.patch };
    },
    removeService: (s, a: PayloadAction<string>) => {
      s.services = s.services.filter(x => x !== a.payload);
      delete s.picks[a.payload];
    },
  },
});

export const { resetDraft, setDraft, toggleService, pickVendor, updatePick, removeService } = booking.actions;
export default booking.reducer;
