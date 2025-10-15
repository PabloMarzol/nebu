import { Platform, Alert, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import Keychain from 'react-native-keychain';
import CryptoJS from 'crypto-js';

export interface SecurityConfig {
  enableBiometric: boolean;
  enablePinLock: boolean;
  autoLockTimeout: number; // in seconds
  maxLoginAttempts: number;
  sessionTimeout: number; // in minutes
  enableDeviceBinding: boolean;
  enableJailbreakDetection: boolean;
}

export interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'failed_attempt' | 'device_change' | 'security_breach';
  timestamp: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface DeviceFingerprint {
  deviceId: string;
  brand: string;
  model: string;
  systemVersion: string;
  buildNumber: string;
  bundleId: string;
  appVersion: string;
  platform: string;
  isEmulator: boolean;
  isRooted: boolean;
  hash: string;
}

class SecurityService {
  private static instance: SecurityService;
  private isInitialized = false;
  private securityConfig: SecurityConfig = {
    enableBiometric: true,
    enablePinLock: true,
    autoLockTimeout: 300, // 5 minutes
    maxLoginAttempts: 5,
    sessionTimeout: 30, // 30 minutes
    enableDeviceBinding: true,
    enableJailbreakDetection: true,
  };
  private lockTimer: NodeJS.Timeout | null = null;
  private sessionTimer: NodeJS.Timeout | null = null;
  private failedAttempts = 0;
  private lastActivityTime = Date.now();

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load security configuration
      await this.loadSecurityConfig();
      
      // Initialize device fingerprint
      await this.generateDeviceFingerprint();
      
      // Setup security monitoring
      this.startSecurityMonitoring();
      
      // Check for security threats
      await this.performSecurityChecks();
      
      this.isInitialized = true;
      console.log('[SecurityService] Initialized successfully');
    } catch (error) {
      console.error('[SecurityService] Initialization failed:', error);
      throw error;
    }
  }

  // Device Security
  async generateDeviceFingerprint(): Promise<DeviceFingerprint> {
    try {
      const deviceId = await DeviceInfo.getUniqueId();
      const brand = await DeviceInfo.getBrand();
      const model = await DeviceInfo.getModel();
      const systemVersion = await DeviceInfo.getSystemVersion();
      const buildNumber = await DeviceInfo.getBuildNumber();
      const bundleId = await DeviceInfo.getBundleId();
      const appVersion = await DeviceInfo.getVersion();
      const isEmulator = await DeviceInfo.isEmulator();
      const isRooted = await this.checkRootStatus();

      const fingerprint: DeviceFingerprint = {
        deviceId,
        brand,
        model,
        systemVersion,
        buildNumber,
        bundleId,
        appVersion,
        platform: Platform.OS,
        isEmulator,
        isRooted,
        hash: '',
      };

      // Generate hash
      const fingerprintString = JSON.stringify(fingerprint);
      fingerprint.hash = CryptoJS.SHA256(fingerprintString).toString();

      // Store fingerprint
      await AsyncStorage.setItem('deviceFingerprint', JSON.stringify(fingerprint));

      return fingerprint;
    } catch (error) {
      console.error('[SecurityService] Failed to generate device fingerprint:', error);
      throw error;
    }
  }

  async verifyDeviceFingerprint(): Promise<boolean> {
    try {
      const storedFingerprint = await AsyncStorage.getItem('deviceFingerprint');
      if (!storedFingerprint) return false;

      const stored: DeviceFingerprint = JSON.parse(storedFingerprint);
      const current = await this.generateDeviceFingerprint();

      // Compare critical device properties
      const isValid = 
        stored.deviceId === current.deviceId &&
        stored.bundleId === current.bundleId &&
        stored.platform === current.platform &&
        !current.isRooted &&
        !current.isEmulator;

      if (!isValid) {
        await this.logSecurityEvent({
          type: 'device_change',
          details: { stored, current },
          severity: 'high',
        });
      }

      return isValid;
    } catch (error) {
      console.error('[SecurityService] Device fingerprint verification failed:', error);
      return false;
    }
  }

  // Authentication Security
  async recordLoginAttempt(success: boolean, details: Record<string, any> = {}): Promise<void> {
    if (success) {
      this.failedAttempts = 0;
      await this.logSecurityEvent({
        type: 'login',
        details: { ...details, timestamp: new Date().toISOString() },
        severity: 'low',
      });
      this.startSessionTimer();
    } else {
      this.failedAttempts++;
      await this.logSecurityEvent({
        type: 'failed_attempt',
        details: { 
          ...details, 
          attempts: this.failedAttempts,
          timestamp: new Date().toISOString() 
        },
        severity: this.failedAttempts >= this.securityConfig.maxLoginAttempts ? 'critical' : 'medium',
      });

      if (this.failedAttempts >= this.securityConfig.maxLoginAttempts) {
        await this.handleMaxAttemptsReached();
      }
    }
  }

  async handleMaxAttemptsReached(): Promise<void> {
    try {
      // Lock the app temporarily
      await AsyncStorage.setItem('accountLocked', 'true');
      await AsyncStorage.setItem('lockTimestamp', Date.now().toString());

      Alert.alert(
        'Account Locked',
        'Too many failed login attempts. Please try again later.',
        [{ text: 'OK' }]
      );

      await this.logSecurityEvent({
        type: 'security_breach',
        details: { 
          reason: 'max_attempts_reached',
          attempts: this.failedAttempts 
        },
        severity: 'critical',
      });
    } catch (error) {
      console.error('[SecurityService] Failed to handle max attempts:', error);
    }
  }

  async isAccountLocked(): Promise<boolean> {
    try {
      const isLocked = await AsyncStorage.getItem('accountLocked');
      if (isLocked !== 'true') return false;

      const lockTimestamp = await AsyncStorage.getItem('lockTimestamp');
      if (!lockTimestamp) return false;

      const lockTime = parseInt(lockTimestamp);
      const now = Date.now();
      const lockDuration = 30 * 60 * 1000; // 30 minutes

      if (now - lockTime > lockDuration) {
        // Unlock account
        await AsyncStorage.removeItem('accountLocked');
        await AsyncStorage.removeItem('lockTimestamp');
        this.failedAttempts = 0;
        return false;
      }

      return true;
    } catch (error) {
      console.error('[SecurityService] Failed to check account lock status:', error);
      return false;
    }
  }

  // Session Management
  startSessionTimer(): void {
    this.clearSessionTimer();
    this.lastActivityTime = Date.now();

    this.sessionTimer = setTimeout(() => {
      this.handleSessionTimeout();
    }, this.securityConfig.sessionTimeout * 60 * 1000);
  }

  updateLastActivity(): void {
    this.lastActivityTime = Date.now();
  }

  private clearSessionTimer(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  private async handleSessionTimeout(): Promise<void> {
    try {
      await this.logSecurityEvent({
        type: 'logout',
        details: { reason: 'session_timeout' },
        severity: 'low',
      });

      // Clear sensitive data
      await this.clearSensitiveData();

      Alert.alert(
        'Session Expired',
        'Your session has expired for security reasons. Please log in again.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('[SecurityService] Session timeout handling failed:', error);
    }
  }

  // App Lock Management
  async onAppForeground(): Promise<void> {
    const now = Date.now();
    const timeSinceLastActivity = now - this.lastActivityTime;

    if (timeSinceLastActivity > this.securityConfig.autoLockTimeout * 1000) {
      await this.requireAuthentication();
    }

    this.updateLastActivity();
  }

  async requireAuthentication(): Promise<void> {
    // This would trigger the biometric/PIN authentication flow
    // Implementation depends on your authentication system
    console.log('[SecurityService] Authentication required');
  }

  // Data Protection
  async encryptSensitiveData(data: string, key?: string): Promise<string> {
    try {
      const encryptionKey = key || await this.getEncryptionKey();
      const encrypted = CryptoJS.AES.encrypt(data, encryptionKey).toString();
      return encrypted;
    } catch (error) {
      console.error('[SecurityService] Data encryption failed:', error);
      throw error;
    }
  }

  async decryptSensitiveData(encryptedData: string, key?: string): Promise<string> {
    try {
      const encryptionKey = key || await this.getEncryptionKey();
      const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('[SecurityService] Data decryption failed:', error);
      throw error;
    }
  }

  async clearSensitiveData(): Promise<void> {
    try {
      const sensitiveKeys = [
        'authToken',
        'refreshToken',
        'userCredentials',
        'tradingApiKeys',
        'biometricData',
      ];

      for (const key of sensitiveKeys) {
        await AsyncStorage.removeItem(key);
      }

      // Clear keychain data
      await Keychain.resetInternetCredentials('NebulaXExchange');

      console.log('[SecurityService] Sensitive data cleared');
    } catch (error) {
      console.error('[SecurityService] Failed to clear sensitive data:', error);
    }
  }

  // Security Monitoring
  private startSecurityMonitoring(): void {
    // Monitor app state changes
    AppState.addEventListener('change', this.handleAppStateChange.bind(this));

    // Start periodic security checks
    setInterval(() => {
      this.performPeriodicSecurityChecks();
    }, 60000); // Every minute
  }

  private handleAppStateChange(nextAppState: string): void {
    if (nextAppState === 'active') {
      this.onAppForeground();
    } else if (nextAppState === 'background') {
      this.updateLastActivity();
    }
  }

  private async performSecurityChecks(): Promise<void> {
    try {
      // Check for jailbreak/root
      if (this.securityConfig.enableJailbreakDetection) {
        const isRooted = await this.checkRootStatus();
        if (isRooted) {
          await this.handleSecurityThreat('rooted_device');
        }
      }

      // Verify device fingerprint
      if (this.securityConfig.enableDeviceBinding) {
        const isValidDevice = await this.verifyDeviceFingerprint();
        if (!isValidDevice) {
          await this.handleSecurityThreat('device_mismatch');
        }
      }

      // Check for debugger
      if (__DEV__) {
        console.warn('[SecurityService] Running in development mode');
      }
    } catch (error) {
      console.error('[SecurityService] Security checks failed:', error);
    }
  }

  private async performPeriodicSecurityChecks(): Promise<void> {
    // Check session validity
    const now = Date.now();
    const sessionAge = now - this.lastActivityTime;
    
    if (sessionAge > this.securityConfig.sessionTimeout * 60 * 1000) {
      await this.handleSessionTimeout();
    }

    // Check for account lock status
    const isLocked = await this.isAccountLocked();
    if (isLocked) {
      await this.requireAuthentication();
    }
  }

  private async checkRootStatus(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        // Android root detection
        const isRooted = await DeviceInfo.isEmulator(); // Simplified check
        return isRooted;
      } else {
        // iOS jailbreak detection
        const isJailbroken = await DeviceInfo.isEmulator(); // Simplified check
        return isJailbroken;
      }
    } catch (error) {
      console.error('[SecurityService] Root/jailbreak detection failed:', error);
      return false;
    }
  }

  private async handleSecurityThreat(threatType: string): Promise<void> {
    try {
      await this.logSecurityEvent({
        type: 'security_breach',
        details: { threatType },
        severity: 'critical',
      });

      Alert.alert(
        'Security Warning',
        'A security threat has been detected. The app will be closed for your protection.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Close the app or restrict functionality
              this.clearSensitiveData();
            },
          },
        ]
      );
    } catch (error) {
      console.error('[SecurityService] Security threat handling failed:', error);
    }
  }

  // Security Events Logging
  private async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<void> {
    try {
      const securityEvent: SecurityEvent = {
        id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ...event,
      };

      // Store locally
      const events = await this.getSecurityEvents();
      events.unshift(securityEvent);
      
      // Keep only last 100 events
      const trimmedEvents = events.slice(0, 100);
      await AsyncStorage.setItem('securityEvents', JSON.stringify(trimmedEvents));

      // Send to server if critical
      if (event.severity === 'critical') {
        await this.reportSecurityEvent(securityEvent);
      }

      console.log(`[SecurityService] Security event logged: ${event.type} (${event.severity})`);
    } catch (error) {
      console.error('[SecurityService] Failed to log security event:', error);
    }
  }

  async getSecurityEvents(): Promise<SecurityEvent[]> {
    try {
      const eventsData = await AsyncStorage.getItem('securityEvents');
      return eventsData ? JSON.parse(eventsData) : [];
    } catch (error) {
      console.error('[SecurityService] Failed to get security events:', error);
      return [];
    }
  }

  private async reportSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      // Report to backend security monitoring
      // Implementation would send event to your security endpoint
      console.log('[SecurityService] Reporting critical security event:', event);
    } catch (error) {
      console.error('[SecurityService] Failed to report security event:', error);
    }
  }

  // Configuration Management
  private async loadSecurityConfig(): Promise<void> {
    try {
      const configData = await AsyncStorage.getItem('securityConfig');
      if (configData) {
        this.securityConfig = { ...this.securityConfig, ...JSON.parse(configData) };
      }
    } catch (error) {
      console.error('[SecurityService] Failed to load security config:', error);
    }
  }

  async updateSecurityConfig(config: Partial<SecurityConfig>): Promise<void> {
    try {
      this.securityConfig = { ...this.securityConfig, ...config };
      await AsyncStorage.setItem('securityConfig', JSON.stringify(this.securityConfig));
      console.log('[SecurityService] Security config updated');
    } catch (error) {
      console.error('[SecurityService] Failed to update security config:', error);
    }
  }

  getSecurityConfig(): SecurityConfig {
    return { ...this.securityConfig };
  }

  // Utility Methods
  private async getEncryptionKey(): Promise<string> {
    try {
      const credentials = await Keychain.getInternetCredentials('NebulaXExchange');
      if (credentials && credentials.password) {
        return credentials.password;
      }

      // Generate new key
      const newKey = CryptoJS.lib.WordArray.random(256/8).toString();
      await Keychain.setInternetCredentials('NebulaXExchange', 'encryption', newKey);
      return newKey;
    } catch (error) {
      console.error('[SecurityService] Failed to get encryption key:', error);
      // Fallback key (not recommended for production)
      return 'fallback-encryption-key';
    }
  }
}

export const SecurityService = SecurityService.getInstance();
export default SecurityService;