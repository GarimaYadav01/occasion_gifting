import { Platform, TextStyle, ViewStyle } from 'react-native';

export type Mode = 'gifts' | 'events';

const base = {
  bg: '#FBF7F2',
  card: '#FFFFFF',
  text: '#1D1424',
  sub: '#6B6275',
  muted: '#A39BAD',
  line: '#EFE7EE',
  lineSoft: '#F6F0F4',
  success: '#0C8A4B',
  successSoft: '#E4F6EC',
  danger: '#D93B4A',
  dangerSoft: '#FDECEE',
  warn: '#C98A0B',
  warnSoft: '#FFF5DE',
  info: '#2F6FEB',
  infoSoft: '#E8F0FE',
  gold: '#D9A43A',
  goldSoft: '#FFF4DC',
  pink: '#FF4F8B',
  pinkSoft: '#FFE6EF',
  plum: '#6A1B84',
  plumSoft: '#F4E9F7',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(20,10,30,0.55)',
};

export const palettes = {
  gifts: {
    ...base,
    primary: '#6A1B84',
    primaryDark: '#4A0E5E',
    onPrimary: '#FFFFFF',
    ink: '#6A1B84',
    accent: '#FF4F8B',
    accentSoft: '#FFE6EF',
    tint: '#F4E9F7',
    header: ['#4A0E5E', '#7E2596', '#B0408F'],
    headerSoft: ['#F7EAF6', '#FBF7F2'],
  },
  events: {
    ...base,
    primary: '#E3A72F',
    primaryDark: '#B9821A',
    onPrimary: '#1F1240',
    ink: '#5B2BB5',
    accent: '#7B3FE4',
    accentSoft: '#EFE7FD',
    tint: '#FFF4DC',
    header: ['#140A2E', '#2E1557', '#5A2378'],
    headerSoft: ['#FFF3DA', '#FBF7F2'],
  },
};

export type Palette = typeof palettes.gifts;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 };
export const radius = { sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, pill: 999 };

const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

export const font = {
  display: { fontSize: 28, fontWeight: '800', letterSpacing: -0.6 } as TextStyle,
  brand: { fontSize: 26, fontWeight: '700', fontFamily: serif, letterSpacing: -0.3 } as TextStyle,
  h1: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 } as TextStyle,
  h2: { fontSize: 18, fontWeight: '800', letterSpacing: -0.2 } as TextStyle,
  h3: { fontSize: 15, fontWeight: '700' } as TextStyle,
  body: { fontSize: 14, fontWeight: '500', lineHeight: 20 } as TextStyle,
  small: { fontSize: 12, fontWeight: '500' } as TextStyle,
  tiny: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 } as TextStyle,
};

export const shadow = (level = 1): ViewStyle => ({
  shadowColor: '#3B1450',
  shadowOffset: { width: 0, height: level * 2 },
  shadowOpacity: 0.06 + level * 0.03,
  shadowRadius: level * 5,
  elevation: level * 2,
});
