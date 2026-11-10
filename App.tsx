/**
 * Occasion — Gifts · Events · Moments
 * Customer app (gifting marketplace + event booking).
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ToastProvider } from './src/components/Toast';
import { palettes } from './src/theme';

const navTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: palettes.gifts.bg } };

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <ToastProvider>
            <NavigationContainer theme={navTheme}>
              <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
              <RootNavigator />
            </NavigationContainer>
          </ToastProvider>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
