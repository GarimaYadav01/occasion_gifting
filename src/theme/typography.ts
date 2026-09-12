import { TextStyle, Platform } from 'react-native';
import { colors } from './colors';

export const typography = {
  hero: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.navy,
    letterSpacing: -0.5,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  } as TextStyle,
  h1: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.navy,
    letterSpacing: -0.3,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  } as TextStyle,
  h2: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.navy,
  } as TextStyle,
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  } as TextStyle,
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 22,
  } as TextStyle,
  bodySmall: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 18,
  } as TextStyle,
  caption: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  } as TextStyle,
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  } as TextStyle,
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  } as TextStyle,
  brandTagline: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.skyBlue,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } as TextStyle,
} as const;
