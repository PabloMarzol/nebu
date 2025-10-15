import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/constants';
import { User } from '../store/slices/authSlice';

export interface LoginResponse {
  user: User;
  token: string;
  expiresAt: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

class AuthServiceClass {
  private baseUrl = API_BASE_URL;
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token and user data
      await AsyncStorage.setItem(this.tokenKey, data.token);
      await AsyncStorage.setItem(this.userKey, JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(email: string, password: string, firstName: string, lastName: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Store token and user data
      await AsyncStorage.setItem(this.tokenKey, data.token);
      await AsyncStorage.setItem(this.userKey, JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async loginWithBiometric(): Promise<LoginResponse> {
    try {
      const token = await AsyncStorage.getItem(this.tokenKey);
      const userData = await AsyncStorage.getItem(this.userKey);
      
      if (!token || !userData) {
        throw new Error('No stored credentials found');
      }

      const response = await fetch(`${this.baseUrl}/api/auth/biometric-login`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Biometric login failed');
      }

      const data = await response.json();
      
      // Update token
      await AsyncStorage.setItem(this.tokenKey, data.token);
      
      return data;
    } catch (error) {
      console.error('Biometric login error:', error);
      throw error;
    }
  }

  async verifyTwoFactor(code: string): Promise<LoginResponse> {
    try {
      const token = await AsyncStorage.getItem(this.tokenKey);
      
      const response = await fetch(`${this.baseUrl}/api/auth/verify-2fa`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Two-factor verification failed');
      }

      const data = await response.json();
      
      // Update token and user data
      await AsyncStorage.setItem(this.tokenKey, data.token);
      await AsyncStorage.setItem(this.userKey, JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error('2FA verification error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem(this.tokenKey);
      
      if (token) {
        await fetch(`${this.baseUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear stored data regardless of API call result
      await AsyncStorage.removeItem(this.tokenKey);
      await AsyncStorage.removeItem(this.userKey);
    }
  }

  async refreshToken(): Promise<{ token: string; expiresAt: number }> {
    try {
      const token = await AsyncStorage.getItem(this.tokenKey);
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Token refresh failed');
      }

      const data = await response.json();
      
      // Update token
      await AsyncStorage.setItem(this.tokenKey, data.token);
      
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.tokenKey);
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  }

  async getStoredUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const token = await AsyncStorage.getItem(this.tokenKey);
      
      const response = await fetch(`${this.baseUrl}/api/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Profile update failed');
      }

      const user = await response.json();
      
      // Update stored user data
      await AsyncStorage.setItem(this.userKey, JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const token = await AsyncStorage.getItem(this.tokenKey);
      
      const response = await fetch(`${this.baseUrl}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Password change failed');
      }
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }
}

export const AuthService = new AuthServiceClass();