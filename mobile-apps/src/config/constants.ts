// API Configuration
export const API_BASE_URL = 'http://localhost:5000'; // Development URL
export const WEBSOCKET_URL = 'ws://localhost:5000'; // Development WebSocket URL

// App Configuration
export const APP_NAME = 'NebulaX Mobile';
export const APP_VERSION = '1.0.0';
export const APP_BUILD = '100';

// Security Configuration
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
export const AUTO_LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// Trading Configuration
export const DEFAULT_TRADING_PAIRS = [
  'BTC/USDT',
  'ETH/USDT',
  'BNB/USDT',
  'SOL/USDT',
  'ADA/USDT',
  'DOT/USDT',
  'MATIC/USDT',
  'LINK/USDT',
  'UNI/USDT',
  'AAVE/USDT',
];

export const ORDER_TYPES = [
  { value: 'market', label: 'Market' },
  { value: 'limit', label: 'Limit' },
  { value: 'stop', label: 'Stop' },
  { value: 'stop_limit', label: 'Stop Limit' },
  { value: 'oco', label: 'OCO' },
  { value: 'ioc', label: 'IOC' },
  { value: 'fok', label: 'FOK' },
];

export const TIMEFRAMES = [
  { value: '1m', label: '1M' },
  { value: '5m', label: '5M' },
  { value: '15m', label: '15M' },
  { value: '30m', label: '30M' },
  { value: '1h', label: '1H' },
  { value: '4h', label: '4H' },
  { value: '1d', label: '1D' },
  { value: '1w', label: '1W' },
];

// Portfolio Configuration
export const SUPPORTED_ASSETS = [
  'BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'DOT', 'MATIC', 'LINK', 'UNI', 'AAVE',
  'USDT', 'USDC', 'BUSD', 'DAI', 'TUSD'
];

export const FIAT_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
];

// Notification Configuration
export const NOTIFICATION_TYPES = {
  PRICE_ALERT: 'price_alert',
  TRADE: 'trade',
  SECURITY: 'security',
  NEWS: 'news',
  SYSTEM: 'system',
  MARKETING: 'marketing',
};

export const PUSH_NOTIFICATION_CHANNELS = {
  TRADING: 'trading',
  SECURITY: 'security',
  ALERTS: 'alerts',
  NEWS: 'news',
  GENERAL: 'general',
};

// Chart Configuration
export const CHART_INDICATORS = [
  { value: 'sma', label: 'SMA' },
  { value: 'ema', label: 'EMA' },
  { value: 'rsi', label: 'RSI' },
  { value: 'macd', label: 'MACD' },
  { value: 'bb', label: 'Bollinger Bands' },
  { value: 'volume', label: 'Volume' },
];

// Feature Flags
export const FEATURES = {
  BIOMETRIC_AUTH: true,
  TWO_FACTOR_AUTH: true,
  PUSH_NOTIFICATIONS: true,
  ADVANCED_TRADING: true,
  P2P_TRADING: true,
  OTC_TRADING: true,
  COPY_TRADING: true,
  STAKING: true,
  NEWS_FEED: true,
  SOCIAL_FEATURES: true,
};

// Limits and Constraints
export const LIMITS = {
  MIN_ORDER_AMOUNT: 0.001,
  MAX_ORDER_AMOUNT: 1000000,
  MIN_WITHDRAWAL_AMOUNT: 10,
  MAX_WITHDRAWAL_AMOUNT: 100000,
  DAILY_WITHDRAWAL_LIMIT: 50000,
  MAX_PRICE_ALERTS: 50,
  MAX_OPEN_ORDERS: 100,
};

// URLs and Deep Links
export const DEEP_LINKS = {
  TRADING: 'nebulax://trading',
  PORTFOLIO: 'nebulax://portfolio',
  MARKETS: 'nebulax://markets',
  PROFILE: 'nebulax://profile',
  SETTINGS: 'nebulax://settings',
};

export const EXTERNAL_URLS = {
  WEBSITE: 'https://nebulax.exchange',
  SUPPORT: 'https://support.nebulax.exchange',
  PRIVACY_POLICY: 'https://nebulax.exchange/privacy',
  TERMS_OF_SERVICE: 'https://nebulax.exchange/terms',
  API_DOCS: 'https://docs.nebulax.exchange',
};

// RegEx Patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  CRYPTO_ADDRESS: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^0x[a-fA-F0-9]{40}$/,
};

// Animation Configuration
export const ANIMATIONS = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
    LINEAR: 'linear',
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  SETTINGS: 'app_settings',
  FAVORITES: 'favorite_pairs',
  PRICE_ALERTS: 'price_alerts',
  TRADING_PREFERENCES: 'trading_preferences',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  PIN_HASH: 'pin_hash',
  LAST_ACTIVITY: 'last_activity',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTH_ERROR: 'Authentication failed. Please log in again.',
  PERMISSION_ERROR: 'Permission denied. Please check your account settings.',
  RATE_LIMIT_ERROR: 'Too many requests. Please wait and try again.',
  BIOMETRIC_ERROR: 'Biometric authentication failed. Please try again.',
  PIN_ERROR: 'Invalid PIN. Please try again.',
  TWO_FACTOR_ERROR: 'Invalid two-factor authentication code.',
};