// FX Swap Service - Client-side API interactions
import axios from 'axios';
import { getAuthHeader } from './walletAuth'; // Import auth helper

const API_BASE = '/api/fx-swap';

export type FiatCurrency = 'GBP' | 'USD' | 'EUR';
export type TargetToken = 'USDT' | 'USDC' | 'DAI';

export const FIAT_CURRENCIES: Record<FiatCurrency, { symbol: string; name: string; flag: string }> = {
  GBP: { symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  USD: { symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  EUR: { symbol: '€', name: 'Euro', flag: '🇪🇺' },
};

export const TARGET_TOKENS: Record<TargetToken, { name: string; logo: string }> = {
  USDT: { name: 'Tether USD', logo: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
  USDC: { name: 'USD Coin', logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png' },
  DAI: { name: 'Dai', logo: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png' },
};

export interface FxSwapQuote {
  success: boolean;
  quote: {
    fiatAmount: number;
    fiatCurrency: FiatCurrency;
    fxRate: number;
    usdAmount: number;
    estimatedOutput: number;
    targetToken: string;
    platformFee: number;
    gasFee: number;
    totalCost: number;
    minimumOutput: number;
    priceImpact: number;
    rateValidUntil: string;
  };
}

export interface FxSwapLimits {
  success: boolean;
  limits: {
    minSwapAmountGbp: number;
    maxSwapAmountGbp: number;
    dailyUserLimitGbp: number;
    platformFeePercent: number;
    maxSlippagePercent: number;
  };
}

export interface FxSwapOrder {
  id: string;
  userId: string;
  gbpAmount: number;
  targetToken: string;
  destinationWallet: string;
  status: string;
  fxRate: number | null;
  usdAmount: number | null;
  estimatedOutput: number | null;
  actualOutput: number | null;
  platformFee: number | null;
  gasFee: number | null;
  stripePaymentIntentId: string | null;
  swapTxHash: string | null;
  transferTxHash: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentResponse {
  success: boolean;
  clientSecret: string;
  orderId: string;
  amount: number;
}

/**
 * Get FX swap quote
 */
export async function getFxSwapQuote(
  fiatAmount: number,
  fiatCurrency: FiatCurrency = 'GBP',
  targetToken: TargetToken = 'USDT'
): Promise<FxSwapQuote> {
  try {
    const response = await axios.post(`${API_BASE}/quote`, {
      gbpAmount: fiatAmount, // Backend currently uses gbpAmount
      targetToken,
    });
    return response.data;
  } catch (error: any) {
    console.error('FX swap quote error:', error);
    throw new Error(
      error.response?.data?.error || 
      error.response?.data?.message || 
      'Failed to get FX swap quote'
    );
  }
}

/**
 * Get platform limits
 */
export async function getFxSwapLimits(): Promise<FxSwapLimits> {
  try {
    const response = await axios.get(`${API_BASE}/limits`, {
      headers: getAuthHeader(), // Use wallet auth helper for consistency
    });
    return response.data;
  } catch (error: any) {
    console.error('FX swap limits error:', error);
    throw new Error(
      error.response?.data?.error || 
      'Failed to get platform limits'
    );
  }
}

/**
 * Create Stripe payment intent for FX swap
 */
export async function createFxSwapPayment(
  fiatAmount: number,
  destinationWallet: string,
  fiatCurrency: FiatCurrency = 'GBP',
  targetToken: TargetToken = 'USDT'
): Promise<CreatePaymentResponse> {
  try {
    const response = await axios.post(
      `${API_BASE}/create-payment`,
      {
        gbpAmount: fiatAmount, // Backend currently uses gbpAmount
        destinationWallet,
        targetToken,
      },
      {
        headers: getAuthHeader(), // Use wallet auth helper
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Create FX payment error:', error);
    throw new Error(
      error.response?.data?.error || 
      error.response?.data?.message || 
      'Failed to create payment'
    );
  }
}

/**
 * Get FX swap order by ID
 */
export async function getFxSwapOrder(orderId: string): Promise<FxSwapOrder> {
  try {
    const response = await axios.get(`${API_BASE}/order/${orderId}`, {
      headers: getAuthHeader(), // Use wallet auth helper
    });
    return response.data.order;
  } catch (error: any) {
    console.error('Get FX order error:', error);
    throw new Error(
      error.response?.data?.error || 
      'Failed to get order details'
    );
  }
}

/**
 * Get user's FX swap history
 */
export async function getFxSwapHistory(
  limit: number = 10
): Promise<FxSwapOrder[]> {
  try {
    const response = await axios.get(`${API_BASE}/history`, {
      params: { limit },
      headers: getAuthHeader(), // Use wallet auth helper
    });
    return response.data.orders;
  } catch (error: any) {
    console.error('Get FX history error:', error);
    throw new Error(
      error.response?.data?.error || 
      'Failed to get swap history'
    );
  }
}

/**
 * Format fiat currency based on type
 */
export function formatFiat(amount: number, currency: FiatCurrency): string {
  const localeMap: Record<FiatCurrency, string> = {
    GBP: 'en-GB',
    USD: 'en-US',
    EUR: 'de-DE',
  };
  
  return new Intl.NumberFormat(localeMap[currency], {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format GBP currency
 */
export function formatGBP(amount: number): string {
  return formatFiat(amount, 'GBP');
}

/**
 * Format USD currency
 */
export function formatUSD(amount: number): string {
  return formatFiat(amount, 'USD');
}

/**
 * Format EUR currency
 */
export function formatEUR(amount: number): string {
  return formatFiat(amount, 'EUR');
}

/**
 * Format crypto amount
 */
export function formatCrypto(amount: number, decimals: number = 6): string {
  return amount.toFixed(decimals);
}

/**
 * Validate wallet address (basic Ethereum address validation)
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
