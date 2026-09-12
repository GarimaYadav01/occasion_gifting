/**
 * Occasion - Celebrate Every Moment
 * Gifting, Event Planning & Booking Platform
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { LoginModal } from './src/components/auth/LoginModal';
import { colors } from './src/theme';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar
              barStyle="dark-content"
              backgroundColor={colors.white}
            />
            <RootNavigator />
            <LoginModal />
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
