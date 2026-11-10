import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Mode } from '../../theme';
import { img } from '../../data/images';

export interface User {
  name: string;
  phone: string;
  email: string;
  gender: string;
  dob: string;
  avatar: string;
}

interface AppState {
  mode: Mode;
  onboarded: boolean;
  loggedIn: boolean;
  user: User;
  location: { label: string; line: string };
}

const initialState: AppState = {
  mode: 'gifts',
  onboarded: false,
  loggedIn: false,
  user: { name: 'Aarav Mehta', phone: '9876543210', email: 'aarav.mehta@mail.com', gender: 'Male', dob: '1993-08-21', avatar: img('avatar7', 300) },
  location: { label: 'Home', line: 'Prestige Lakeside, Koramangala, Bengaluru' },
};

const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setMode: (s, a: PayloadAction<Mode>) => { s.mode = a.payload; },
    finishOnboarding: s => { s.onboarded = true; },
    login: (s, a: PayloadAction<string>) => { s.loggedIn = true; s.user.phone = a.payload; },
    updateUser: (s, a: PayloadAction<Partial<User>>) => { s.user = { ...s.user, ...a.payload }; },
    setLocation: (s, a: PayloadAction<{ label: string; line: string }>) => { s.location = a.payload; },
    logout: s => { s.loggedIn = false; },
  },
});

export const { setMode, finishOnboarding, login, updateUser, setLocation, logout } = app.actions;
export default app.reducer;
