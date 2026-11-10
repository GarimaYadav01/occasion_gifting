import { useCallback } from 'react';
import { StatusBar, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { palettes } from '../theme';
import { useAppSelector } from '../store';
import { RootStackParamList } from '../navigation/types';

export const useMode = () => useAppSelector(s => s.app.mode);

export const useTheme = () => {
  const mode = useMode();
  return { c: palettes[mode], mode, isEvents: mode === 'events' };
};

export const useNav = () => useNavigation<NativeStackNavigationProp<RootStackParamList>>();

export const useStatusBar = (style: 'light-content' | 'dark-content') => {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(style, true);
      if (Platform.OS === 'android') {
        StatusBar.setTranslucent(true);
        StatusBar.setBackgroundColor('transparent');
      }
    }, [style]),
  );
};
