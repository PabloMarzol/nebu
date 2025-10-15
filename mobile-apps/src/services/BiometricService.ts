import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/constants';

export interface BiometricResult {
  success: boolean;
  error?: string;
}

export interface BiometricAvailability {
  isAvailable: boolean;
  biometryType?: 'TouchID' | 'FaceID' | 'Biometrics';
  error?: string;
}

class BiometricServiceClass {
  private rnBiometrics = new ReactNativeBiometrics();
  
  async initialize(): Promise<void> {
    try {
      const availability = await this.checkAvailability();
      await AsyncStorage.setItem('biometric_available', JSON.stringify(availability.isAvailable));
    } catch (error) {
      console.error('Biometric initialization error:', error);
    }
  }

  async checkAvailability(): Promise<BiometricAvailability> {
    try {
      const result = await this.rnBiometrics.isSensorAvailable();
      
      return {
        isAvailable: result.available,
        biometryType: result.biometryType as 'TouchID' | 'FaceID' | 'Biometrics',
      };
    } catch (error) {
      console.error('Biometric availability check error:', error);
      return {
        isAvailable: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async createKeys(): Promise<BiometricResult> {
    try {
      const result = await this.rnBiometrics.createKeys();
      
      if (result.publicKey) {
        await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
        return { success: true };
      }
      
      return { success: false, error: 'Failed to create biometric keys' };
    } catch (error) {
      console.error('Biometric key creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create biometric keys',
      };
    }
  }

  async deleteKeys(): Promise<BiometricResult> {
    try {
      const result = await this.rnBiometrics.deleteKeys();
      
      if (result.keysDeleted) {
        await AsyncStorage.removeItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
        return { success: true };
      }
      
      return { success: false, error: 'Failed to delete biometric keys' };
    } catch (error) {
      console.error('Biometric key deletion error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete biometric keys',
      };
    }
  }

  async authenticate(reason?: string): Promise<BiometricResult> {
    try {
      const promptMessage = reason || 'Authenticate to access your NebulaX account';
      
      const result = await this.rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: 'Cancel',
      });
      
      if (result.success) {
        return { success: true };
      }
      
      return {
        success: false,
        error: result.error || 'Biometric authentication failed',
      };
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Biometric authentication failed',
      };
    }
  }

  async createSignature(payload: string): Promise<{ success: boolean; signature?: string; error?: string }> {
    try {
      const result = await this.rnBiometrics.createSignature({
        promptMessage: 'Sign transaction with biometric authentication',
        payload,
        cancelButtonText: 'Cancel',
      });
      
      if (result.success && result.signature) {
        return { success: true, signature: result.signature };
      }
      
      return {
        success: false,
        error: result.error || 'Failed to create signature',
      };
    } catch (error) {
      console.error('Biometric signature error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create signature',
      };
    }
  }

  async isEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking biometric status:', error);
      return false;
    }
  }

  async enable(): Promise<BiometricResult> {
    try {
      const availability = await this.checkAvailability();
      
      if (!availability.isAvailable) {
        return {
          success: false,
          error: 'Biometric authentication is not available on this device',
        };
      }

      // Test authentication
      const authResult = await this.authenticate('Enable biometric authentication for NebulaX');
      
      if (!authResult.success) {
        return authResult;
      }

      // Create keys
      const keyResult = await this.createKeys();
      
      if (keyResult.success) {
        await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
      }
      
      return keyResult;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to enable biometric authentication',
      };
    }
  }

  async disable(): Promise<BiometricResult> {
    try {
      const result = await this.deleteKeys();
      
      if (result.success) {
        await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, 'false');
      }
      
      return result;
    } catch (error) {
      console.error('Error disabling biometric:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to disable biometric authentication',
      };
    }
  }

  async getBiometricType(): Promise<string | null> {
    try {
      const availability = await this.checkAvailability();
      return availability.biometryType || null;
    } catch (error) {
      console.error('Error getting biometric type:', error);
      return null;
    }
  }
}

export const BiometricService = new BiometricServiceClass();