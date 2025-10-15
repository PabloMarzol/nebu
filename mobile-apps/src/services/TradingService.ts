import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = Platform.OS === 'ios' ? 'http://localhost:5000' : 'http://10.0.2.2:5000';

export interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'stop_limit' | 'oco' | 'ioc' | 'fok' | 'stop_loss' | 'take_profit';
  amount: number;
  price?: number;
  stopPrice?: number;
  status: 'pending' | 'open' | 'filled' | 'cancelled' | 'rejected' | 'partially_filled';
  filled: number;
  remaining: number;
  fee: number;
  timestamp: string;
  expiresAt?: string;
  createdAt?: string;
}

export interface CreateOrderRequest {
  symbol: string;
  side: 'buy' | 'sell';
  type: Order['type'];
  amount: number;
  price?: number;
  stopPrice?: number;
}

export interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  fee: number;
  timestamp: string;
  orderId: string;
}

export interface Portfolio {
  totalValue: number;
  pnl24h: number;
  pnlPercentage24h: number;
  balances: Array<{
    asset: string;
    free: number;
    locked: number;
    total: number;
    usdValue: number;
  }>;
}

class TradingService {
  private static instance: TradingService;

  static getInstance(): TradingService {
    if (!TradingService.instance) {
      TradingService.instance = new TradingService();
    }
    return TradingService.instance;
  }

  private async getAuthHeaders() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    } catch (error) {
      return {
        'Content-Type': 'application/json',
      };
    }
  }

  // Order Management
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.post(
        `${API_BASE_URL}/api/trading/orders`,
        orderData,
        { headers, timeout: 10000 }
      );
      
      if (response.data && response.data.order) {
        return response.data.order;
      }
      
      // Fallback to simulated order
      return this.createSimulatedOrder(orderData);
    } catch (error) {
      console.error('Failed to create order:', error);
      return this.createSimulatedOrder(orderData);
    }
  }

  async cancelOrder(orderId: string): Promise<Order> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.delete(
        `${API_BASE_URL}/api/trading/orders/${orderId}`,
        { headers, timeout: 10000 }
      );
      
      if (response.data && response.data.order) {
        return response.data.order;
      }
      
      throw new Error('Failed to cancel order');
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  }

  async modifyOrder(params: { orderId: string; price?: number; amount?: number }): Promise<Order> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.put(
        `${API_BASE_URL}/api/trading/orders/${params.orderId}`,
        { price: params.price, amount: params.amount },
        { headers, timeout: 10000 }
      );
      
      if (response.data && response.data.order) {
        return response.data.order;
      }
      
      throw new Error('Failed to modify order');
    } catch (error) {
      console.error('Failed to modify order:', error);
      throw error;
    }
  }

  async getOrders(params: { symbol?: string; status?: string; limit?: number } = {}): Promise<Order[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/api/trading/orders`, {
        headers,
        params,
        timeout: 10000,
      });
      
      if (response.data && response.data.orders) {
        return response.data.orders;
      }
      
      return this.getSimulatedOrders();
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      return this.getSimulatedOrders();
    }
  }

  async getTrades(params: { symbol?: string; limit?: number } = {}): Promise<Trade[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/api/trading/trades`, {
        headers,
        params,
        timeout: 10000,
      });
      
      if (response.data && response.data.trades) {
        return response.data.trades;
      }
      
      return this.getSimulatedTrades();
    } catch (error) {
      console.error('Failed to fetch trades:', error);
      return this.getSimulatedTrades();
    }
  }

  // Portfolio Management
  async getPortfolio(): Promise<Portfolio> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/api/portfolio`, {
        headers,
        timeout: 10000,
      });
      
      if (response.data && response.data.portfolio) {
        return response.data.portfolio;
      }
      
      return this.getSimulatedPortfolio();
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
      return this.getSimulatedPortfolio();
    }
  }

  async getBalance(asset: string): Promise<{ free: number; locked: number; total: number }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/api/portfolio/balance/${asset}`, {
        headers,
        timeout: 10000,
      });
      
      if (response.data && response.data.balance) {
        return response.data.balance;
      }
      
      return { free: 1000, locked: 0, total: 1000 }; // Fallback balance
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      return { free: 1000, locked: 0, total: 1000 };
    }
  }

  // Trading History
  async getTradingHistory(params: { symbol?: string; limit?: number; offset?: number } = {}): Promise<{
    orders: Order[];
    trades: Trade[];
    totalOrders: number;
    totalTrades: number;
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/api/trading/history`, {
        headers,
        params,
        timeout: 10000,
      });
      
      if (response.data) {
        return response.data;
      }
      
      return {
        orders: this.getSimulatedOrders(),
        trades: this.getSimulatedTrades(),
        totalOrders: 10,
        totalTrades: 5,
      };
    } catch (error) {
      console.error('Failed to fetch trading history:', error);
      return {
        orders: this.getSimulatedOrders(),
        trades: this.getSimulatedTrades(),
        totalOrders: 10,
        totalTrades: 5,
      };
    }
  }

  // P2P Trading
  async getP2POffers(params: { asset?: string; fiat?: string; type?: 'buy' | 'sell'; limit?: number } = {}) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/api/p2p/offers`, {
        headers,
        params,
        timeout: 10000,
      });
      
      if (response.data && response.data.offers) {
        return response.data.offers;
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch P2P offers:', error);
      return [];
    }
  }

  // Private Helper Methods
  private createSimulatedOrder(orderData: CreateOrderRequest): Order {
    const now = new Date().toISOString();
    return {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      symbol: orderData.symbol,
      side: orderData.side,
      type: orderData.type,
      amount: orderData.amount,
      price: orderData.price,
      stopPrice: orderData.stopPrice,
      status: 'pending',
      filled: 0,
      remaining: orderData.amount,
      fee: 0,
      timestamp: now,
      createdAt: now,
    };
  }

  private getSimulatedOrders(): Order[] {
    const orders: Order[] = [];
    const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'ADAUSDT'];
    
    for (let i = 0; i < 10; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const side: 'buy' | 'sell' = Math.random() > 0.5 ? 'buy' : 'sell';
      const type: Order['type'] = ['market', 'limit', 'stop_loss'][Math.floor(Math.random() * 3)] as Order['type'];
      const amount = Math.random() * 10 + 0.1;
      const price = Math.random() * 50000 + 1000;
      const status: Order['status'] = ['pending', 'open', 'filled', 'cancelled'][Math.floor(Math.random() * 4)] as Order['status'];
      
      orders.push({
        id: `order_${i}`,
        symbol,
        side,
        type,
        amount,
        price,
        status,
        filled: status === 'filled' ? amount : status === 'partially_filled' ? amount * 0.5 : 0,
        remaining: status === 'filled' ? 0 : status === 'partially_filled' ? amount * 0.5 : amount,
        fee: status === 'filled' ? amount * price * 0.001 : 0,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      });
    }
    
    return orders;
  }

  private getSimulatedTrades(): Trade[] {
    const trades: Trade[] = [];
    const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'ADAUSDT'];
    
    for (let i = 0; i < 5; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const side: 'buy' | 'sell' = Math.random() > 0.5 ? 'buy' : 'sell';
      const amount = Math.random() * 5 + 0.1;
      const price = Math.random() * 50000 + 1000;
      
      trades.push({
        id: `trade_${i}`,
        symbol,
        side,
        amount,
        price,
        fee: amount * price * 0.001,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        orderId: `order_${i}`,
      });
    }
    
    return trades;
  }

  private getSimulatedPortfolio(): Portfolio {
    const assets = ['BTC', 'ETH', 'SOL', 'ADA', 'USDT'];
    const prices = { BTC: 45000, ETH: 3200, SOL: 120, ADA: 0.85, USDT: 1 };
    
    const balances = assets.map(asset => {
      const free = Math.random() * 10 + 0.1;
      const locked = Math.random() * 2;
      const total = free + locked;
      const usdValue = total * (prices[asset as keyof typeof prices] || 1);
      
      return {
        asset,
        free,
        locked,
        total,
        usdValue,
      };
    });
    
    const totalValue = balances.reduce((sum, balance) => sum + balance.usdValue, 0);
    const pnl24h = totalValue * (Math.random() * 0.1 - 0.05); // -5% to +5%
    const pnlPercentage24h = (pnl24h / totalValue) * 100;
    
    return {
      totalValue,
      pnl24h,
      pnlPercentage24h,
      balances,
    };
  }
}

export const TradingService = TradingService.getInstance();
export default TradingService;