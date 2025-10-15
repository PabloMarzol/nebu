import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';

import { store, persistor } from './src/store/store';
import { darkTheme } from './src/theme/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { WebSocketProvider } from './src/contexts/WebSocketContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import LoadingScreen from './src/components/LoadingScreen';
import { initializeApp } from './src/services/AppService';
import { BiometricService } from './src/services/BiometricService';
import { SecurityService } from './src/services/SecurityService';

const App: React.FC = () => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Initialize app services
    initializeApp();
    
    // Initialize security services
    SecurityService.initialize();
    BiometricService.initialize();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground - trigger biometric authentication if required
        SecurityService.onAppForeground();
      }
      appState.current = nextAppState;
    });

    return () => subscription?.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <SafeAreaProvider>
            <PaperProvider theme={darkTheme}>
              <AuthProvider>
                <WebSocketProvider>
                  <NotificationProvider>
                    <NavigationContainer theme={darkTheme}>
                      <AppNavigator />
                    </NavigationContainer>
                  </NotificationProvider>
                </WebSocketProvider>
              </AuthProvider>
            </PaperProvider>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;