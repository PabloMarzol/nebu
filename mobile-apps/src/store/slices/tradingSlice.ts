import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TradingService } from '../../services/TradingService';
import { MarketDataService } from '../../services/MarketDataService';

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

export interface TradingPair {
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

export interface OrderBookData {
  bids: Array<{ price: number; quantity: number; total: number }>;
  asks: Array<{ price: number; quantity: number; total: number }>;
  spread: number;
  timestamp: number;
}

export interface ChartData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradingState {
  orders: Order[];
  trades: Trade[];
  openOrders: Order[];
  orderHistory: Order[];
  tradingPairs: TradingPair[];
  orderBook: OrderBookData | null;
  chartData: ChartData[];
  selectedSymbol: string;
  selectedOrderType: Order['type'];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: TradingState = {
  orders: [],
  trades: [],
  openOrders: [],
  orderHistory: [],
  tradingPairs: [],
  orderBook: null,
  chartData: [],
  selectedSymbol: 'BTCUSDT',
  selectedOrderType: 'limit',
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Async thunks
export const createOrder = createAsyncThunk(
  'trading/createOrder',
  async (orderData: Omit<Order, 'id' | 'status' | 'filled' | 'remaining' | 'fee' | 'timestamp'>, { rejectWithValue }) => {
    try {
      const response = await TradingService.createOrder(orderData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create order');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'trading/cancelOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await TradingService.cancelOrder(orderId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel order');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'trading/fetchOrders',
  async (params: { symbol?: string; status?: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await TradingService.getOrders(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const fetchTrades = createAsyncThunk(
  'trading/fetchTrades',
  async (params: { symbol?: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await TradingService.getTrades(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch trades');
    }
  }
);

export const modifyOrder = createAsyncThunk(
  'trading/modifyOrder',
  async (params: { orderId: string; price?: number; amount?: number }, { rejectWithValue }) => {
    try {
      const response = await TradingService.modifyOrder(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to modify order');
    }
  }
);

// Additional async thunks for mobile app functionality
export const fetchTradingPairs = createAsyncThunk(
  'trading/fetchTradingPairs',
  async (_, { rejectWithValue }) => {
    try {
      const tickers = await MarketDataService.getMarketTickers();
      return tickers.map(ticker => ({
        id: ticker.symbol,
        symbol: ticker.symbol,
        baseAsset: ticker.symbol.split('USDT')[0] || ticker.symbol.split('/')[0] || 'BTC',
        quoteAsset: 'USDT',
        price: ticker.price,
        change24h: ticker.change24h,
        volume24h: ticker.volume24h,
        high24h: ticker.high24h,
        low24h: ticker.low24h,
      })) as TradingPair[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch trading pairs');
    }
  }
);

export const fetchOrderBook = createAsyncThunk(
  'trading/fetchOrderBook',
  async (symbol: string, { rejectWithValue }) => {
    try {
      const orderBook = await MarketDataService.getOrderBook(symbol);
      return orderBook;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch order book');
    }
  }
);

export const fetchChartData = createAsyncThunk(
  'trading/fetchChartData',
  async (params: { symbol: string; timeframe: string }, { rejectWithValue }) => {
    try {
      const chartData = await MarketDataService.getChartData(params.symbol, params.timeframe);
      return chartData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch chart data');
    }
  }
);

export const fetchOrderHistory = createAsyncThunk(
  'trading/fetchOrderHistory',
  async (params: { symbol?: string; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await TradingService.getOrders({
        ...params,
        status: 'filled,cancelled,rejected',
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch order history');
    }
  }
);

export const placeBuyOrder = createAsyncThunk(
  'trading/placeBuyOrder',
  async (orderData: {
    symbol: string;
    type: Order['type'];
    amount: number;
    price?: number;
    stopPrice?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await TradingService.createOrder({
        ...orderData,
        side: 'buy',
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to place buy order');
    }
  }
);

export const placeSellOrder = createAsyncThunk(
  'trading/placeSellOrder',
  async (orderData: {
    symbol: string;
    type: Order['type'];
    amount: number;
    price?: number;
    stopPrice?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await TradingService.createOrder({
        ...orderData,
        side: 'sell',
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to place sell order');
    }
  }
);

const tradingSlice = createSlice({
  name: 'trading',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedSymbol: (state, action: PayloadAction<string>) => {
      state.selectedSymbol = action.payload;
    },
    setSelectedOrderType: (state, action: PayloadAction<Order['type']>) => {
      state.selectedOrderType = action.payload;
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      
      // Update open orders
      const openIndex = state.openOrders.findIndex(o => o.id === action.payload.id);
      if (action.payload.status === 'open' || action.payload.status === 'pending') {
        if (openIndex !== -1) {
          state.openOrders[openIndex] = action.payload;
        } else {
          state.openOrders.push(action.payload);
        }
      } else if (openIndex !== -1) {
        state.openOrders.splice(openIndex, 1);
      }
    },
    addTrade: (state, action: PayloadAction<Trade>) => {
      state.trades.unshift(action.payload);
    },
    clearOrders: (state) => {
      state.orders = [];
      state.openOrders = [];
      state.orderHistory = [];
    },
    clearTrades: (state) => {
      state.trades = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.unshift(action.payload);
        if (action.payload.status === 'open' || action.payload.status === 'pending') {
          state.openOrders.unshift(action.payload);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Cancel Order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const order = action.payload;
        const index = state.orders.findIndex(o => o.id === order.id);
        if (index !== -1) {
          state.orders[index] = order;
        }
        
        const openIndex = state.openOrders.findIndex(o => o.id === order.id);
        if (openIndex !== -1) {
          state.openOrders.splice(openIndex, 1);
        }
      })
      
      // Fetch Orders
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.openOrders = action.payload.filter(o => o.status === 'open' || o.status === 'pending');
        state.orderHistory = action.payload.filter(o => o.status === 'filled' || o.status === 'cancelled' || o.status === 'rejected');
      })
      
      // Fetch Trades
      .addCase(fetchTrades.fulfilled, (state, action) => {
        state.trades = action.payload;
      })
      
      // Modify Order
      .addCase(modifyOrder.fulfilled, (state, action) => {
        const order = action.payload;
        const index = state.orders.findIndex(o => o.id === order.id);
        if (index !== -1) {
          state.orders[index] = order;
        }
        
        const openIndex = state.openOrders.findIndex(o => o.id === order.id);
        if (openIndex !== -1) {
          state.openOrders[openIndex] = order;
        }
      })
      
      // Fetch Trading Pairs
      .addCase(fetchTradingPairs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTradingPairs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tradingPairs = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchTradingPairs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Order Book
      .addCase(fetchOrderBook.fulfilled, (state, action) => {
        state.orderBook = action.payload;
      })
      
      // Fetch Chart Data
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.chartData = action.payload;
      })
      
      // Fetch Order History
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.orderHistory = action.payload;
      })
      
      // Place Buy Order
      .addCase(placeBuyOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(placeBuyOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.unshift(action.payload);
        if (action.payload.status === 'open' || action.payload.status === 'pending') {
          state.openOrders.unshift(action.payload);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(placeBuyOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Place Sell Order
      .addCase(placeSellOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(placeSellOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.unshift(action.payload);
        if (action.payload.status === 'open' || action.payload.status === 'pending') {
          state.openOrders.unshift(action.payload);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(placeSellOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setSelectedSymbol,
  setSelectedOrderType,
  updateOrder,
  addTrade,
  clearOrders,
  clearTrades,
} = tradingSlice.actions;

export default tradingSlice.reducer;