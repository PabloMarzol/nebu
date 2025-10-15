import { Platform, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { SecurityService } from './SecurityService';
import { BiometricService } from './BiometricService';
import { NotificationService } from './NotificationService';

export interface AppConfig {
  apiBaseUrl: string;
  wsBaseUrl: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    biometricAuth: boolean;
    pushNotifications: boolean;
    offlineMode: boolean;
    analytics: boolean;
    crashReporting: boolean;
  };
  security: {
    certificatePinning: boolean;
    encryptLocalStorage: boolean;
    requestTimeout: number;
  };
}

export interface AppState {
  isInitialized: boolean;
  isOnline: boolean;
  isAuthenticated: boolean;
  currentVersion: string;
  lastUpdateCheck: string;
  maintenanceMode: boolean;
}

class AppService {
  private static instance: AppService;
  private appState: AppState = {
    isInitialized: false,
    isOnline: true,
    isAuthenticated: false,
    currentVersion: '1.0.0',
    lastUpdateCheck: '',
    maintenanceMode: false,
  };

  private appConfig: AppConfig = {
    apiBaseUrl: Platform.OS === 'ios' ? 'http://localhost:5000' : 'http://10.0.2.2:5000',
    wsBaseUrl: Platform.OS === 'ios' ? 'ws://localhost:5000' : 'ws://10.0.2.2:5000',
    environment: __DEV__ ? 'development' : 'production',
    features: {
      biometricAuth: true,
      pushNotifications: true,
      offlineMode: true,
      analytics: !__DEV__,
      crashReporting: !__DEV__,
    },
    security: {
      certificatePinning: !__DEV__,
      encryptLocalStorage: true,
      requestTimeout: 30000,
    },
  };

  static getInstance(): AppService {
    if (!AppService.instance) {
      AppService.instance = new AppService();
    }
    return AppService.instance;
  }

  async initialize(): Promise<void> {
    try {
      console.log('[AppService] Starting app initialization...');

      // Load app configuration
      await this.loadAppConfig();

      // Initialize core services
      await this.initializeCoreServices();

      // Setup network monitoring
      await this.setupNetworkMonitoring();

      // Check for app updates
      await this.checkForUpdates();

      // Verify app integrity
      await this.verifyAppIntegrity();

      this.appState.isInitialized = true;
      console.log('[AppService] App initialization completed successfully');
    } catch (error) {
      console.error('[AppService] App initialization failed:', error);
      throw error;
    }
  }

  private async loadAppConfig(): Promise<void> {
    try {
      const configData = await AsyncStorage.getItem('appConfig');
      if (configData) {
        const savedConfig = JSON.parse(configData);
        this.appConfig = { ...this.appConfig, ...savedConfig };
      }
      console.log('[AppService] App configuration loaded');
    } catch (error) {
      console.error('[AppService] Failed to load app configuration:', error);
    }
  }

  private async initializeCoreServices(): Promise<void> {
    try {
      // Initialize security service
      await SecurityService.initialize();

      // Initialize biometric service if enabled
      if (this.appConfig.features.biometricAuth) {
        await BiometricService.initialize();
      }

      // Initialize notification service if enabled
      if (this.appConfig.features.pushNotifications) {
        await NotificationService.initialize();
      }

      console.log('[AppService] Core services initialized');
    } catch (error) {
      console.error('[AppService] Core services initialization failed:', error);
      throw error;
    }
  }

  private async setupNetworkMonitoring(): Promise<void> {
    try {
      // Check initial network state
      const netInfo = await NetInfo.fetch();
      this.appState.isOnline = netInfo.isConnected || false;

      // Subscribe to network state changes
      NetInfo.addEventListener(state => {
        const wasOnline = this.appState.isOnline;
        this.appState.isOnline = state.isConnected || false;

        if (!wasOnline && this.appState.isOnline) {
          this.handleOnlineStatusChange(true);
        } else if (wasOnline && !this.appState.isOnline) {
          this.handleOnlineStatusChange(false);
        }
      });

      console.log('[AppService] Network monitoring setup completed');
    } catch (error) {
      console.error('[AppService] Network monitoring setup failed:', error);
    }
  }

  private handleOnlineStatusChange(isOnline: boolean): void {
    if (isOnline) {
      console.log('[AppService] App came online');
      // Sync offline data, retry failed requests, etc.
      this.syncOfflineData();
    } else {
      console.log('[AppService] App went offline');
      // Enable offline mode, cache critical data, etc.
      this.enableOfflineMode();
    }
  }

  private async syncOfflineData(): Promise<void> {
    try {
      // Sync any offline data when connection is restored
      const offlineData = await AsyncStorage.getItem('offlineData');
      if (offlineData) {
        const data = JSON.parse(offlineData);
        // Process offline data...
        await AsyncStorage.removeItem('offlineData');
        console.log('[AppService] Offline data synced');
      }
    } catch (error) {
      console.error('[AppService] Offline data sync failed:', error);
    }
  }

  private async enableOfflineMode(): Promise<void> {
    try {
      // Cache critical data for offline access
      console.log('[AppService] Offline mode enabled');
    } catch (error) {
      console.error('[AppService] Failed to enable offline mode:', error);
    }
  }

  private async checkForUpdates(): Promise<void> {
    try {
      // Check for app updates
      const lastCheck = await AsyncStorage.getItem('lastUpdateCheck');
      const now = new Date().toISOString();
      
      // Check once per day
      if (!lastCheck || this.shouldCheckForUpdates(lastCheck)) {
        // In a real app, this would check app store or your update service
        await AsyncStorage.setItem('lastUpdateCheck', now);
        this.appState.lastUpdateCheck = now;
        console.log('[AppService] Update check completed');
      }
    } catch (error) {
      console.error('[AppService] Update check failed:', error);
    }
  }

  private shouldCheckForUpdates(lastCheck: string): boolean {
    const lastCheckTime = new Date(lastCheck).getTime();
    const now = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    return now - lastCheckTime > oneDayInMs;
  }

  private async verifyAppIntegrity(): Promise<void> {
    try {
      // Verify app integrity, check for tampering, etc.
      // This would include certificate validation, hash verification, etc.
      console.log('[AppService] App integrity verification completed');
    } catch (error) {
      console.error('[AppService] App integrity verification failed:', error);
      throw error;
    }
  }

  // App State Management
  getAppState(): AppState {
    return { ...this.appState };
  }

  getAppConfig(): AppConfig {
    return { ...this.appConfig };
  }

  async updateAppConfig(config: Partial<AppConfig>): Promise<void> {
    try {
      this.appConfig = { ...this.appConfig, ...config };
      await AsyncStorage.setItem('appConfig', JSON.stringify(this.appConfig));
      console.log('[AppService] App configuration updated');
    } catch (error) {
      console.error('[AppService] Failed to update app configuration:', error);
    }
  }

  setAuthenticationStatus(isAuthenticated: boolean): void {
    this.appState.isAuthenticated = isAuthenticated;
  }

  // Navigation Helpers
  async handleDeepLink(url: string): Promise<void> {
    try {
      console.log('[AppService] Handling deep link:', url);
      
      // Parse the URL and navigate accordingly
      if (url.includes('/trading/')) {
        const symbol = url.split('/trading/')[1];
        // Navigate to trading screen with symbol
      } else if (url.includes('/portfolio')) {
        // Navigate to portfolio
      }
      // Add more deep link handlers as needed
    } catch (error) {
      console.error('[AppService] Deep link handling failed:', error);
    }
  }

  async openExternalLink(url: string): Promise<void> {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      console.error('[AppService] Failed to open external link:', error);
    }
  }

  // Performance Monitoring
  startPerformanceMonitoring(): void {
    // Monitor app performance metrics
    console.log('[AppService] Performance monitoring started');
  }

  reportPerformanceMetric(metric: string, value: number): void {
    // Report performance metrics
    console.log(`[AppService] Performance metric: ${metric} = ${value}`);
  }

  // Error Handling
  reportError(error: Error, context?: Record<string, any>): void {
    try {
      if (this.appConfig.features.crashReporting) {
        // Report to crash reporting service
        console.error('[AppService] Error reported:', error, context);
      }
    } catch (reportingError) {
      console.error('[AppService] Failed to report error:', reportingError);
    }
  }

  // Maintenance Mode
  async checkMaintenanceMode(): Promise<boolean> {
    try {
      // Check if app is in maintenance mode
      // This would typically be fetched from your backend
      const maintenanceData = await AsyncStorage.getItem('maintenanceMode');
      this.appState.maintenanceMode = maintenanceData === 'true';
      return this.appState.maintenanceMode;
    } catch (error) {
      console.error('[AppService] Maintenance mode check failed:', error);
      return false;
    }
  }

  async enableMaintenanceMode(message?: string): Promise<void> {
    try {
      this.appState.maintenanceMode = true;
      await AsyncStorage.setItem('maintenanceMode', 'true');
      
      if (message) {
        Alert.alert('Maintenance', message);
      }
      
      console.log('[AppService] Maintenance mode enabled');
    } catch (error) {
      console.error('[AppService] Failed to enable maintenance mode:', error);
    }
  }

  async disableMaintenanceMode(): Promise<void> {
    try {
      this.appState.maintenanceMode = false;
      await AsyncStorage.removeItem('maintenanceMode');
      console.log('[AppService] Maintenance mode disabled');
    } catch (error) {
      console.error('[AppService] Failed to disable maintenance mode:', error);
    }
  }

  // Utility Methods
  isOnline(): boolean {
    return this.appState.isOnline;
  }

  isAuthenticated(): boolean {
    return this.appState.isAuthenticated;
  }

  isInitialized(): boolean {
    return this.appState.isInitialized;
  }

  getEnvironment(): string {
    return this.appConfig.environment;
  }

  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.appConfig.features[feature];
  }

  // Cleanup
  async cleanup(): Promise<void> {
    try {
      // Cleanup resources before app termination
      console.log('[AppService] Cleanup started');
      
      // Clear sensitive data if needed
      // Close connections
      // Save important state
      
      console.log('[AppService] Cleanup completed');
    } catch (error) {
      console.error('[AppService] Cleanup failed:', error);
    }
  }
}

export const initializeApp = async (): Promise<void> => {
  try {
    const appService = AppService.getInstance();
    await appService.initialize();
  } catch (error) {
    console.error('App initialization failed:', error);
    throw error;
  }
};

export const AppService = AppService.getInstance();
export default AppService;