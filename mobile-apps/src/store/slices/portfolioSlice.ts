import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PortfolioService } from '../../services/PortfolioService';

export interface Balance {
  asset: string;
  available: number;
  locked: number;
  total: number;
  usdValue: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'trade' | 'staking' | 'reward';
  asset: string;
  amount: number;
  fee: number;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  timestamp: string;
}

export interface StakingPosition {
  id: string;
  asset: string;
  amount: number;
  apy: number;
  duration: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'completed';
  rewards: number;
}

export interface PortfolioState {
  balances: Balance[];
  transactions: Transaction[];
  stakingPositions: StakingPosition[];
  totalValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  selectedTimeframe: '24h' | '7d' | '30d' | '90d' | '1y' | 'all';
}

const initialState: PortfolioState = {
  balances: [],
  transactions: [],
  stakingPositions: [],
  totalValue: 0,
  totalPnl: 0,
  totalPnlPercent: 0,
  isLoading: false,
  error: null,
  lastUpdated: null,
  selectedTimeframe: '24h',
};

// Async thunks
export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      const response = await PortfolioService.getPortfolio();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch portfolio');
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'portfolio/fetchTransactions',
  async (params: { page?: number; limit?: number; type?: string }, { rejectWithValue }) => {
    try {
      const response = await PortfolioService.getTransactions(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch transactions');
    }
  }
);

export const fetchStakingPositions = createAsyncThunk(
  'portfolio/fetchStakingPositions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await PortfolioService.getStakingPositions();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch staking positions');
    }
  }
);

export const createStakingPosition = createAsyncThunk(
  'portfolio/createStakingPosition',
  async (params: { asset: string; amount: number; duration: number }, { rejectWithValue }) => {
    try {
      const response = await PortfolioService.createStakingPosition(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create staking position');
    }
  }
);

export const withdrawStaking = createAsyncThunk(
  'portfolio/withdrawStaking',
  async (positionId: string, { rejectWithValue }) => {
    try {
      const response = await PortfolioService.withdrawStaking(positionId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to withdraw staking');
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedTimeframe: (state, action: PayloadAction<PortfolioState['selectedTimeframe']>) => {
      state.selectedTimeframe = action.payload;
    },
    updateBalance: (state, action: PayloadAction<Balance>) => {
      const index = state.balances.findIndex(b => b.asset === action.payload.asset);
      if (index !== -1) {
        state.balances[index] = action.payload;
      } else {
        state.balances.push(action.payload);
      }
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    updateTotalValue: (state, action: PayloadAction<{ totalValue: number; totalPnl: number; totalPnlPercent: number }>) => {
      state.totalValue = action.payload.totalValue;
      state.totalPnl = action.payload.totalPnl;
      state.totalPnlPercent = action.payload.totalPnlPercent;
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Portfolio
      .addCase(fetchPortfolio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balances = action.payload.balances;
        state.totalValue = action.payload.totalValue;
        state.totalPnl = action.payload.totalPnl;
        state.totalPnlPercent = action.payload.totalPnlPercent;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Transactions
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
      })
      
      // Fetch Staking Positions
      .addCase(fetchStakingPositions.fulfilled, (state, action) => {
        state.stakingPositions = action.payload;
      })
      
      // Create Staking Position
      .addCase(createStakingPosition.fulfilled, (state, action) => {
        state.stakingPositions.push(action.payload);
      })
      
      // Withdraw Staking
      .addCase(withdrawStaking.fulfilled, (state, action) => {
        const index = state.stakingPositions.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.stakingPositions[index] = action.payload;
        }
      });
  },
});

export const {
  clearError,
  setSelectedTimeframe,
  updateBalance,
  addTransaction,
  updateTransaction,
  updateTotalValue,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;