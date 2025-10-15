import { ethers } from 'ethers';

export interface WalletAuthResponse {
  token: string;
  walletAddress: string;
  message: string;
}

/**
 * Connect to MetaMask and get wallet address
 */
export async function connectWallet(): Promise<string> {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please unlock MetaMask.');
    }

    return accounts[0].toLowerCase();
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('User rejected the connection request.');
    }
    throw error;
  }
}

/**
 * Request nonce from backend
 */
export async function requestNonce(walletAddress: string): Promise<{ nonce: string; message: string }> {
  const response = await fetch('/api/wallet-auth/nonce', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get nonce');
  }

  const data = await response.json();
  return { nonce: data.nonce, message: data.message };
}

/**
 * Sign message with wallet
 */
export async function signMessage(message: string): Promise<string> {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const signature = await signer.signMessage(message);
    return signature;
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('User rejected the signature request.');
    }
    throw error;
  }
}

/**
 * Verify signature with backend and get JWT
 */
export async function verifySignature(
  walletAddress: string,
  signature: string
): Promise<WalletAuthResponse> {
  const response = await fetch('/api/wallet-auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress, signature }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to verify signature');
  }

  return response.json();
}

/**
 * Complete authentication flow
 */
export async function authenticateWithWallet(): Promise<WalletAuthResponse> {
  // Step 1: Connect wallet
  const walletAddress = await connectWallet();
  console.log('=== FRONTEND AUTH FLOW ===');
  console.log('Connected wallet:', walletAddress);

  // Step 2: Get nonce AND message from backend
  const { message } = await requestNonce(walletAddress);
  console.log('Message to sign:', message);

  // Step 3: Sign the exact message from backend
  const signature = await signMessage(message);
  console.log('Signature:', signature);
  console.log('==========================');

  // Step 4: Verify and get JWT
  return verifySignature(walletAddress, signature);
}

/**
 * Store JWT token in localStorage
 */
export function storeAuthToken(token: string): void {
  localStorage.setItem('wallet_auth_token', token);
}

/**
 * Get JWT token from localStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('wallet_auth_token');
}

/**
 * Remove JWT token from localStorage
 */
export function clearAuthToken(): void {
  localStorage.removeItem('wallet_auth_token');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Get Authorization header for API requests
 */
export function getAuthHeader(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Add ethereum to window type
declare global {
  interface Window {
    ethereum?: any;
  }
}