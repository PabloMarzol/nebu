import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MarketService } from '../../services/MarketService';

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  lastUpdated: string;
}

export interface OrderBook {
  symbol: string;
  bids: [number, number][];
  asks: [number, number][];
  timestamp: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: string;
}

export interface MarketState {
  markets: MarketData[];
  favorites: string[];
  orderBooks: Record<string, OrderBook>;
  priceAlerts: PriceAlert[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  searchQuery: string;
  selectedCategory: 'all' | 'favorites' | 'gainers' | 'losers' | 'volume';
}

const initialState: MarketState = {
  markets: [],
  favorites: [],
  orderBooks: {},
  priceAlerts: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  searchQuery: '',
  selectedCategory: 'all',
};

// Async thunks
export const fetchMarkets = createAsyncThunk(
  'market/fetchMarkets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await MarketService.getMarkets();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch markets');
    }
  }
);

export const fetchOrderBook = createAsyncThunk(
  'market/fetchOrderBook',
  async (symbol: string, { rejectWithValue }) => {
    try {
      const response = await MarketService.getOrderBook(symbol);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch order book');
    }
  }
);

export const createPriceAlert = createAsyncThunk(
  'market/createPriceAlert',
  async (alert: Omit<PriceAlert, 'id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      const response = await MarketService.createPriceAlert(alert);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create price alert');
    }
  }
);

export const fetchPriceAlerts = createAsyncThunk(
  'market/fetchPriceAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await MarketService.getPriceAlerts();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch price alerts');
    }
  }
);

export const deletePriceAlert = createAsyncThunk(
  'market/deletePriceAlert',
  async (alertId: string, { rejectWithValue }) => {
    try {
      await MarketService.deletePriceAlert(alertId);
      return alertId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete price alert');
    }
  }
);

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<MarketState['selectedCategory']>) => {
      state.selectedCategory = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const symbol = action.payload;
      if (state.favorites.includes(symbol)) {
        state.favorites = state.favorites.filter(fav => fav !== symbol);
      } else {
        state.favorites.push(symbol);
      }
    },
    updateMarketData: (state, action: PayloadAction<MarketData[]>) => {
      state.markets = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    updateOrderBook: (state, action: PayloadAction<OrderBook>) => {
      state.orderBooks[action.payload.symbol] = action.payload;
    },
    togglePriceAlert: (state, action: PayloadAction<string>) => {
      const alert = state.priceAlerts.find(a => a.id === action.payload);
      if (alert) {
        alert.isActive = !alert.isActive;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Markets
      .addCase(fetchMarkets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMarkets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.markets = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchMarkets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Order Book
      .addCase(fetchOrderBook.fulfilled, (state, action) => {
        state.orderBooks[action.payload.symbol] = action.payload;
      })
      
      // Create Price Alert
      .addCase(createPriceAlert.fulfilled, (state, action) => {
        state.priceAlerts.push(action.payload);
      })
      
      // Fetch Price Alerts
      .addCase(fetchPriceAlerts.fulfilled, (state, action) => {
        state.priceAlerts = action.payload;
      })
      
      // Delete Price Alert
      .addCase(deletePriceAlert.fulfilled, (state, action) => {
        state.priceAlerts = state.priceAlerts.filter(alert => alert.id !== action.payload);
      });
  },
});

export const {
  clearError,
  setSearchQuery,
  setSelectedCategory,
  toggleFavorite,
  updateMarketData,
  updateOrderBook,
  togglePriceAlert,
} = marketSlice.actions;

export default marketSlice.reducer;