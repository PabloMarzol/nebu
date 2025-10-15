import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SecuritySettings {
  biometricEnabled: boolean;
  pinEnabled: boolean;
  twoFactorEnabled: boolean;
  autoLockEnabled: boolean;
  autoLockTimeout: number; // in minutes
  loginAlertsEnabled: boolean;
  deviceTrustEnabled: boolean;
}

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  priceAlerts: boolean;
  tradeNotifications: boolean;
  newsNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

export interface DisplaySettings {
  theme: 'dark' | 'light' | 'auto';
  language: string;
  currency: string;
  numberFormat: 'decimal' | 'scientific';
  chartType: 'candlestick' | 'line' | 'bar';
  soundEnabled: boolean;
  hapticFeedback: boolean;
  reducedMotion: boolean;
}

export interface TradingSettings {
  defaultOrderType: 'market' | 'limit';
  confirmOrders: boolean;
  quickOrderEnabled: boolean;
  advancedModeEnabled: boolean;
  showOrderBook: boolean;
  showTrades: boolean;
  autoRefreshInterval: number; // in seconds
  riskWarnings: boolean;
}

export interface SettingsState {
  security: SecuritySettings;
  notifications: NotificationSettings;
  display: DisplaySettings;
  trading: TradingSettings;
  isLoading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  security: {
    biometricEnabled: false,
    pinEnabled: false,
    twoFactorEnabled: false,
    autoLockEnabled: true,
    autoLockTimeout: 5,
    loginAlertsEnabled: true,
    deviceTrustEnabled: false,
  },
  notifications: {
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    priceAlerts: true,
    tradeNotifications: true,
    newsNotifications: false,
    marketingEmails: false,
    securityAlerts: true,
  },
  display: {
    theme: 'dark',
    language: 'en',
    currency: 'USD',
    numberFormat: 'decimal',
    chartType: 'candlestick',
    soundEnabled: true,
    hapticFeedback: true,
    reducedMotion: false,
  },
  trading: {
    defaultOrderType: 'limit',
    confirmOrders: true,
    quickOrderEnabled: false,
    advancedModeEnabled: false,
    showOrderBook: true,
    showTrades: true,
    autoRefreshInterval: 5,
    riskWarnings: true,
  },
  isLoading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSecuritySettings: (state, action: PayloadAction<Partial<SecuritySettings>>) => {
      state.security = { ...state.security, ...action.payload };
    },
    updateNotificationSettings: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    updateDisplaySettings: (state, action: PayloadAction<Partial<DisplaySettings>>) => {
      state.display = { ...state.display, ...action.payload };
    },
    updateTradingSettings: (state, action: PayloadAction<Partial<TradingSettings>>) => {
      state.trading = { ...state.trading, ...action.payload };
    },
    resetSettings: (state) => {
      return initialState;
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light' | 'auto'>) => {
      state.display.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.display.language = action.payload;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.display.currency = action.payload;
    },
    toggleBiometric: (state) => {
      state.security.biometricEnabled = !state.security.biometricEnabled;
    },
    toggleTwoFactor: (state) => {
      state.security.twoFactorEnabled = !state.security.twoFactorEnabled;
    },
    togglePushNotifications: (state) => {
      state.notifications.pushNotifications = !state.notifications.pushNotifications;
    },
    toggleHapticFeedback: (state) => {
      state.display.hapticFeedback = !state.display.hapticFeedback;
    },
    toggleSoundEnabled: (state) => {
      state.display.soundEnabled = !state.display.soundEnabled;
    },
    setAutoLockTimeout: (state, action: PayloadAction<number>) => {
      state.security.autoLockTimeout = action.payload;
    },
    setAutoRefreshInterval: (state, action: PayloadAction<number>) => {
      state.trading.autoRefreshInterval = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  updateSecuritySettings,
  updateNotificationSettings,
  updateDisplaySettings,
  updateTradingSettings,
  resetSettings,
  setTheme,
  setLanguage,
  setCurrency,
  toggleBiometric,
  toggleTwoFactor,
  togglePushNotifications,
  toggleHapticFeedback,
  toggleSoundEnabled,
  setAutoLockTimeout,
  setAutoRefreshInterval,
  clearError,
} = settingsSlice.actions;

export default settingsSlice.reducer;