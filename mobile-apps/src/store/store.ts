import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

import authSlice from './slices/authSlice';
import marketSlice from './slices/marketSlice';
import portfolioSlice from './slices/portfolioSlice';
import tradingSlice from './slices/tradingSlice';
import settingsSlice from './slices/settingsSlice';
import notificationSlice from './slices/notificationSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'settings'], // Only persist these reducers
};

const rootReducer = combineReducers({
  auth: authSlice,
  market: marketSlice,
  portfolio: portfolioSlice,
  trading: tradingSlice,
  settings: settingsSlice,
  notification: notificationSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;