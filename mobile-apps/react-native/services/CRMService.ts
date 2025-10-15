import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface APIConfig {
  baseURL: string;
  timeout: number;
  headers: {
    'Content-Type': string;
    'Authorization'?: string;
  };
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  kycLevel: number;
  totalVolume: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  riskScore: number;
  accountTier: string;
  registrationDate: string;
  country: string;
  tradingPairs: string[];
  notes?: string;
}

interface Deal {
  id: string;
  title: string;
  client: string;
  email: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: string;
  lastActivity: string;
  source: string;
  assignedTo: string;
  notes?: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  customer: {
    name: string;
    email: string;
    id: string;
  };
  status: 'open' | 'in-progress' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  description: string;
}

class CRMService {
  private config: APIConfig;
  private isInitialized: boolean = false;

  constructor() {
    this.config = {
      baseURL: 'https://nebulaxexchange.replit.app',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async initialize(): Promise<void> {
    try {
      // Get auth token from storage
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        this.config.headers.Authorization = `Bearer ${token}`;
      }

      // Test connection
      await this.testConnection();
      this.isInitialized = true;
    } catch (error) {
      console.error('CRM Service initialization failed:', error);
      throw error;
    }
  }

  private async testConnection(): Promise<void> {
    try {
      const response = await fetch(`${this.config.baseURL}/api/health`, {
        method: 'GET',
        headers: this.config.headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const url = `${this.config.baseURL}${endpoint}`;
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.config.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired - clear storage and prompt re-login
          await AsyncStorage.removeItem('authToken');
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Dashboard Data
  async getDashboardData(): Promise<any> {
    try {
      const response = await this.request('/api/enhanced-crm/dashboard/metrics');
      return response;
    } catch (error) {
      // Fallback to mock data for demo
      return {
        customers: {
          total: 15420,
          new: 1250,
          active: 12800,
        },
        deals: {
          total: 145,
          value: 2450000,
          won: 87,
        },
        support: {
          tickets: 342,
          resolved: 318,
          avgResponse: 2.4,
        },
        revenue: {
          current: 2450000,
          growth: 16.7,
        },
      };
    }
  }

  // Customer Management
  async getCustomers(filters?: any): Promise<Customer[]> {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await this.request<Customer[]>(`/api/enhanced-crm/customers?${queryParams}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      return [];
    }
  }

  async getCustomer(customerId: string): Promise<Customer | null> {
    try {
      const response = await this.request<Customer>(`/api/enhanced-crm/customers/${customerId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      return null;
    }
  }

  async createCustomer(customerData: Partial<Customer>): Promise<Customer | null> {
    try {
      const response = await this.request<Customer>('/api/enhanced-crm/customers', {
        method: 'POST',
        body: JSON.stringify(customerData),
      });
      return response;
    } catch (error) {
      console.error('Failed to create customer:', error);
      Alert.alert('Error', 'Failed to create customer');
      return null;
    }
  }

  async updateCustomer(customerId: string, customerData: Partial<Customer>): Promise<Customer | null> {
    try {
      const response = await this.request<Customer>(`/api/enhanced-crm/customers/${customerId}`, {
        method: 'PUT',
        body: JSON.stringify(customerData),
      });
      return response;
    } catch (error) {
      console.error('Failed to update customer:', error);
      Alert.alert('Error', 'Failed to update customer');
      return null;
    }
  }

  // Sales Pipeline
  async getDeals(filters?: any): Promise<Deal[]> {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await this.request<Deal[]>(`/api/enhanced-crm/deals?${queryParams}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch deals:', error);
      return [];
    }
  }

  async getDeal(dealId: string): Promise<Deal | null> {
    try {
      const response = await this.request<Deal>(`/api/enhanced-crm/deals/${dealId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch deal:', error);
      return null;
    }
  }

  async createDeal(dealData: Partial<Deal>): Promise<Deal | null> {
    try {
      const response = await this.request<Deal>('/api/enhanced-crm/deals', {
        method: 'POST',
        body: JSON.stringify(dealData),
      });
      return response;
    } catch (error) {
      console.error('Failed to create deal:', error);
      Alert.alert('Error', 'Failed to create deal');
      return null;
    }
  }

  async updateDeal(dealId: string, dealData: Partial<Deal>): Promise<Deal | null> {
    try {
      const response = await this.request<Deal>(`/api/enhanced-crm/deals/${dealId}`, {
        method: 'PUT',
        body: JSON.stringify(dealData),
      });
      return response;
    } catch (error) {
      console.error('Failed to update deal:', error);
      Alert.alert('Error', 'Failed to update deal');
      return null;
    }
  }

  // Support Tickets
  async getSupportTickets(filters?: any): Promise<SupportTicket[]> {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await this.request<SupportTicket[]>(`/api/enhanced-crm/support/tickets?${queryParams}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch support tickets:', error);
      return [];
    }
  }

  async getSupportTicket(ticketId: string): Promise<SupportTicket | null> {
    try {
      const response = await this.request<SupportTicket>(`/api/enhanced-crm/support/tickets/${ticketId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch support ticket:', error);
      return null;
    }
  }

  async createSupportTicket(ticketData: Partial<SupportTicket>): Promise<SupportTicket | null> {
    try {
      const response = await this.request<SupportTicket>('/api/enhanced-crm/support/tickets', {
        method: 'POST',
        body: JSON.stringify(ticketData),
      });
      return response;
    } catch (error) {
      console.error('Failed to create support ticket:', error);
      Alert.alert('Error', 'Failed to create support ticket');
      return null;
    }
  }

  async updateSupportTicket(ticketId: string, ticketData: Partial<SupportTicket>): Promise<SupportTicket | null> {
    try {
      const response = await this.request<SupportTicket>(`/api/enhanced-crm/support/tickets/${ticketId}`, {
        method: 'PUT',
        body: JSON.stringify(ticketData),
      });
      return response;
    } catch (error) {
      console.error('Failed to update support ticket:', error);
      Alert.alert('Error', 'Failed to update support ticket');
      return null;
    }
  }

  // Analytics
  async getAnalytics(timeRange: string = '30d'): Promise<any> {
    try {
      const response = await this.request(`/api/enhanced-crm/analytics?timeRange=${timeRange}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return null;
    }
  }

  // Offline Support
  async syncOfflineData(): Promise<void> {
    try {
      const offlineData = await AsyncStorage.getItem('offlineData');
      if (offlineData) {
        const data = JSON.parse(offlineData);
        // Sync offline changes
        await this.request('/api/enhanced-crm/sync', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        await AsyncStorage.removeItem('offlineData');
      }
    } catch (error) {
      console.error('Failed to sync offline data:', error);
    }
  }

  async storeOfflineData(data: any): Promise<void> {
    try {
      const existingData = await AsyncStorage.getItem('offlineData');
      const offlineData = existingData ? JSON.parse(existingData) : [];
      offlineData.push({
        ...data,
        timestamp: new Date().toISOString(),
      });
      await AsyncStorage.setItem('offlineData', JSON.stringify(offlineData));
    } catch (error) {
      console.error('Failed to store offline data:', error);
    }
  }
}

export const CRMService = new CRMService();
export { Customer, Deal, SupportTicket };