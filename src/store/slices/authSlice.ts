import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  phone: string;
  otpSent: boolean;
  user: User | null;
  loginModalVisible: boolean;
  loginModalMessage: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  phone: '',
  otpSent: false,
  user: null,
  loginModalVisible: false,
  loginModalMessage: 'Login to continue',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    openLoginModal: (state, action: PayloadAction<string | undefined>) => {
      state.loginModalVisible = true;
      state.loginModalMessage = action.payload ?? 'Login to continue';
    },
    closeLoginModal: state => {
      state.loginModalVisible = false;
      state.otpSent = false;
      state.phone = '';
      state.isLoading = false;
    },
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    sendOtp: state => {
      state.otpSent = true;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isLoading = false;
      state.loginModalVisible = false;
      state.otpSent = false;
    },
    resetOtp: state => {
      state.otpSent = false;
      state.isLoading = false;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.phone = '';
      state.otpSent = false;
      state.loginModalVisible = false;
    },
  },
});

export const {
  openLoginModal,
  closeLoginModal,
  setPhone,
  sendOtp,
  resetOtp,
  setLoading,
  loginSuccess,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
