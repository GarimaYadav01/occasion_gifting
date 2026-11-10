import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DeliveryLocation {
  shortLabel: string;
  addressLine: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
}

interface LocationState {
  sheetVisible: boolean;
  current: DeliveryLocation;
  saved: DeliveryLocation[];
}

const defaultLocation: DeliveryLocation = {
  shortLabel: 'Andheri West',
  addressLine: '123 Celebration Lane, Near Infinity Mall',
  city: 'Mumbai',
  pincode: '400053',
  lat: 19.1334,
  lng: 72.8267,
};

const initialState: LocationState = {
  sheetVisible: false,
  current: defaultLocation,
  saved: [
    defaultLocation,
    {
      shortLabel: 'Bandra West',
      addressLine: '45 Linking Road, Near National College',
      city: 'Mumbai',
      pincode: '400050',
      lat: 19.0596,
      lng: 72.8295,
    },
    {
      shortLabel: 'Powai',
      addressLine: 'Hiranandani Gardens, Central Avenue',
      city: 'Mumbai',
      pincode: '400076',
      lat: 19.1197,
      lng: 72.9051,
    },
  ],
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    openLocationSheet: state => {
      state.sheetVisible = true;
    },
    closeLocationSheet: state => {
      state.sheetVisible = false;
    },
    setDeliveryLocation: (state, action: PayloadAction<DeliveryLocation>) => {
      state.current = action.payload;
      state.sheetVisible = false;
      const exists = state.saved.some(
        a => a.pincode === action.payload.pincode && a.addressLine === action.payload.addressLine,
      );
      if (!exists) {
        state.saved.unshift(action.payload);
      }
    },
  },
});

export const { openLocationSheet, closeLocationSheet, setDeliveryLocation } =
  locationSlice.actions;

export default locationSlice.reducer;
