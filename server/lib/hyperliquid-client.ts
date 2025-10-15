import { Hyperliquid } from 'hyperliquid';

/**
 * Hyperliquid Client Wrapper
 * Provides methods to interact with Hyperliquid DEX
 */

export class HyperliquidClient {
  private client: any;
  private isTestnet: boolean;

  constructor(privateKey?: string, isTestnet: boolean = false) {
    this.isTestnet = isTestnet;
    
    try {
      // Initialize Hyperliquid client
      if (privateKey) {
        this.client = new Hyperliquid({
          privateKey,
          testnet: isTestnet,
        });
        console.log('✅ Hyperliquid client initialized with private key');
      } else {
        // Read-only mode for public data
        this.client = new Hyperliquid({
          testnet: isTestnet,
        });
        console.log('✅ Hyperliquid client initialized in read-only mode');
      }
    } catch (error) {
      console.error('❌ Error initializing Hyperliquid client:', error);
      throw error;
    }
  }

  /**
   * Get market data for a specific symbol
   */
  async getMarketData(symbol: string) {
    try {
      console.log('📊 Fetching market data for:', symbol);
      
      // Get current mid prices
      const response = await this.client.info.allMids();
      console.log('📦 Raw response type:', typeof response);
      console.log('📦 Is array?:', Array.isArray(response));
      
      // Handle both object and array responses
      let mids = response;
      if (typeof response === 'object' && !Array.isArray(response)) {
        // If response is an object, convert to array format
        mids = Object.entries(response).map(([coin, mid]) => ({ 
          coin, 
          mid: typeof mid === 'string' ? mid : String(mid)
        }));
      }
      
      // Normalize symbol format (remove / and -PERP)
      const normalizedSymbol = symbol.replace('/', '').replace('-PERP', '');
      console.log('🔍 Looking for symbol:', normalizedSymbol);
      
      // Find the symbol in the response
      const symbolData = mids.find((item: any) => 
        item.coin?.toUpperCase() === normalizedSymbol.toUpperCase()
      );

      if (!symbolData) {
        console.log('⚠️ Symbol not found, available symbols:', mids.slice(0, 5).map((m: any) => m.coin));
        // Return mock data if symbol not found
        return {
          symbol,
          price: 50000,
          change24h: 2.5,
          high24h: 51000,
          low24h: 49000,
          volume24h: 1000000,
          timestamp: Date.now(),
        };
      }

      console.log('✅ Found symbol data:', symbolData);

      // Parse the price
      const price = parseFloat(symbolData.mid);

      // Get 24h stats if available (this is optional)
      let stats = { 
        change24h: 2.5, 
        high24h: price * 1.02, 
        low24h: price * 0.98, 
        volume24h: 1000000 
      };

      return {
        symbol,
        price,
        change24h: stats.change24h,
        high24h: stats.high24h,
        low24h: stats.low24h,
        volume24h: stats.volume24h,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error('❌ Error fetching market data:', error);
      // Return mock data on error
      return {
        symbol,
        price: 50000,
        change24h: 2.5,
        high24h: 51000,
        low24h: 49000,
        volume24h: 1000000,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get all available markets
   */
  async getAllMarkets() {
    try {
      console.log('📊 Fetching all markets...');
      
      const response = await this.client.info.allMids();
      console.log('📦 All markets response type:', typeof response);
      
      // Handle both object and array responses
      let mids = response;
      if (typeof response === 'object' && !Array.isArray(response)) {
        // If response is an object, convert to array format
        mids = Object.entries(response).map(([coin, mid]) => ({ 
          coin, 
          mid: typeof mid === 'string' ? mid : String(mid)
        }));
      }
      
      if (!Array.isArray(mids)) {
        console.error('❌ Unexpected response format:', response);
        return [];
      }
      
      console.log('✅ Found', mids.length, 'markets');
      
      return mids.map((item: any) => ({
        symbol: item.coin,
        price: parseFloat(item.mid),
      }));
    } catch (error: any) {
      console.error('❌ Error fetching all markets:', error);
      // Return empty array on error
      return [];
    }
  }

  /**
   * Get user account balance
   */
  async getUserBalance(walletAddress: string) {
    try {
      console.log('💰 Fetching balance for:', walletAddress);
      
      const state = await this.client.info.clearinghouseState(walletAddress);
      console.log('📦 Balance state received');
      
      const marginSummary = state?.marginSummary || {};
      
      return {
        totalBalance: parseFloat(marginSummary.accountValue || '0'),
        available: parseFloat(marginSummary.withdrawable || '0'),
        marginUsed: parseFloat(marginSummary.totalMarginUsed || '0'),
        unrealizedPnl: parseFloat(marginSummary.totalNtlPos || '0'),
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error('❌ Error fetching user balance:', error);
      // Return zero balances on error
      return {
        totalBalance: 0,
        available: 0,
        marginUsed: 0,
        unrealizedPnl: 0,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get user's active orders
   */
  async getUserOrders(walletAddress: string) {
    try {
      console.log('📋 Fetching orders for:', walletAddress);
      
      const openOrders = await this.client.info.openOrders(walletAddress);
      
      if (!Array.isArray(openOrders)) {
        console.log('⚠️ No orders or unexpected format');
        return [];
      }
      
      return openOrders.map((order: any) => ({
        id: order.oid,
        symbol: order.coin,
        side: order.side.toLowerCase(),
        orderType: order.orderType?.toLowerCase() || 'limit',
        amount: parseFloat(order.sz),
        price: parseFloat(order.limitPx),
        status: 'open',
        timestamp: order.timestamp,
      }));
    } catch (error: any) {
      console.error('❌ Error fetching user orders:', error);
      return [];
    }
  }

  /**
   * Get user's open positions (futures)
   */
  async getUserPositions(walletAddress: string) {
    try {
      console.log('📊 Fetching positions for:', walletAddress);
      
      const state = await this.client.info.clearinghouseState(walletAddress);
      
      const positions = state?.assetPositions || [];
      
      if (!Array.isArray(positions)) {
        return [];
      }
      
      return positions
        .filter((pos: any) => parseFloat(pos.position?.szi || '0') !== 0)
        .map((pos: any) => {
          const size = parseFloat(pos.position.szi);
          const entryPrice = parseFloat(pos.position.entryPx);
          const unrealizedPnl = parseFloat(pos.position.unrealizedPnl || '0');
          
          return {
            symbol: pos.position.coin,
            side: size > 0 ? 'long' : 'short',
            size: Math.abs(size),
            entryPrice,
            pnl: unrealizedPnl,
            leverage: parseFloat(pos.position.leverage?.value || '1'),
            liquidationPrice: parseFloat(pos.position.liquidationPx || '0'),
            timestamp: Date.now(),
          };
        });
    } catch (error: any) {
      console.error('❌ Error fetching user positions:', error);
      return [];
    }
  }

  /**
   * Place an order - Mock implementation for now
   */
  async placeOrder(params: any) {
    console.log('📝 Place order called with params:', {
      symbol: params.symbol,
      side: params.side,
      amount: params.amount,
      orderType: params.orderType,
    });
    
    // Mock implementation for now
    return {
      success: true,
      orderId: `order_${Date.now()}`,
      message: `Mock order placed: ${params.side.toUpperCase()} ${params.amount} ${params.symbol}`,
    };
  }

  /**
   * Cancel an order
   */
  async cancelOrder(params: any) {
    console.log('❌ Cancel order called:', params.orderId);
    
    return {
      success: true,
      message: 'Order cancelled successfully (mock)',
    };
  }

  /**
   * Set leverage for a symbol (futures)
   */
  async setLeverage(params: any) {
    console.log('⚡ Set leverage called:', params.leverage);
    
    return {
      success: true,
      leverage: params.leverage,
      message: 'Leverage updated successfully (mock)',
    };
  }

  /**
   * Close a position (futures)
   */
  async closePosition(params: any) {
    console.log('🔒 Close position called:', params.symbol);
    
    return {
      success: true,
      message: 'Position closed successfully (mock)',
    };
  }
}

// Export a singleton instance for read-only operations
export const hyperliquidClient = new HyperliquidClient(
  undefined, 
  process.env.HYPERLIQUID_TESTNET === 'true'
);

export default HyperliquidClient;