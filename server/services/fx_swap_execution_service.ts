import { ethers } from 'ethers';
import { db } from '../db';
import { 
  fxWalletOperations,
  WalletOperationStatus,
  FxSwapOrderStatus,
  type InsertFxWalletOperation
} from '@shared/fx_swap_schema';
import { fxSwapService } from './fx_swap_service';
import { eq } from 'drizzle-orm';
import { getNetworkConfig, getDefaultNetwork } from '../config/networks';

// ERC-20 ABI for token transfers
const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
];

/**
 * FX Swap Execution Service
 * Handles direct USDT transfer to user wallet for fiat-to-crypto swaps
 * Supports multiple networks (Ethereum, Arbitrum, Polygon, etc.)
 */
export class FxSwapExecutionService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private chainId: number;
  private networkConfig: any;
  
  constructor(network: string = getDefaultNetwork()) {
    // Initialize provider and wallet with network configuration
    this.networkConfig = getNetworkConfig(network);
    const rpcUrl = this.networkConfig.rpcUrl;
    const privateKey = process.env.HOT_WALLET_PRIVATE_KEY;
    
    if (!privateKey) {
      throw new Error('HOT_WALLET_PRIVATE_KEY not configured');
    }
    
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.chainId = this.networkConfig.chainId;
    
    console.log(`[FxSwapExecution] Initialized with ${this.networkConfig.name} network`);
    console.log(`[FxSwapExecution] Wallet: ${this.wallet.address}`);
    console.log(`[FxSwapExecution] Chain ID: ${this.chainId}`);
    console.log(`[FxSwapExecution] USDT Address: ${this.networkConfig.usdtAddress}`);
  }
  
  /**
   * Execute complete swap flow for an order
   * Called after Stripe payment confirmation
   */
  async executeSwap(orderId: string): Promise<void> {
    console.log(`[FxSwapExecution] Starting swap execution for order: ${orderId}`);
    
    const order = await fxSwapService.getOrder(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    // Verify order is in correct status
    if (order.status !== FxSwapOrderStatus.STRIPE_CONFIRMED) {
      throw new Error(`Order not ready for swap. Current status: ${order.status}`);
    }
    
    try {
      // Step 1: Lock FX rate (already done, but verify it's still valid)
      await this.verifyFxRate(order);
      
      // Step 2: Execute direct USDT transfer to user
      const transferTxHash = await this.executeDirectTransfer(order);
      
      // Step 3: Wait for transfer confirmation
      await this.waitForTransferConfirmation(order, transferTxHash);
      
      // Step 4: Mark order as completed
      await fxSwapService.updateOrderStatus(
        orderId,
        FxSwapOrderStatus.COMPLETED
      );
      
      console.log(`[FxSwapExecution] Order ${orderId} completed successfully`);
      
    } catch (error: any) {
      console.error(`[FxSwapExecution] Swap failed for order ${orderId}:`, error);
      
      await fxSwapService.updateOrderStatus(
        orderId,
        FxSwapOrderStatus.SWAP_FAILED,
        {
          errorMessage: error.message,
          errorCode: 'swap_execution_failed',
        }
      );
      
      throw error;
    }
  }
  
  /**
   * Verify FX rate is still valid (within 30 seconds)
   */
  private async verifyFxRate(order: any): Promise<void> {
    const rateAge = Date.now() - new Date(order.fxRateTimestamp).getTime();
    const maxAge = 30000; // 30 seconds
    
    if (rateAge > maxAge) {
      // Rate expired - get new rate
      const { rate: newRate } = await fxSwapService.getFxRate(
        order.fiatCurrency,
        'USD'
      );
      
      const oldRate = parseFloat(order.fxRate);
      const rateDiff = Math.abs((newRate - oldRate) / oldRate);
      
      // If rate moved more than 0.5%, fail the swap
      if (rateDiff > 0.005) {
        throw new Error('FX rate moved significantly, swap aborted');
      }
      
      // Update order with new rate
      await fxSwapService.updateOrderStatus(
        order.id,
        FxSwapOrderStatus.FX_RATE_LOCKED,
        {
          fxRate: newRate.toString(),
          fxRateTimestamp: new Date(),
        }
      );
    } else {
      // Rate still valid
      await fxSwapService.updateOrderStatus(
        order.id,
        FxSwapOrderStatus.FX_RATE_LOCKED
      );
    }
  }
  
  /**
   * Execute direct USDT transfer to user (bypassing 0x for fiat-to-crypto)
   */
  private async executeDirectTransfer(order: any): Promise<string> {
    console.log('[FxSwapExecution] Executing direct USDT transfer to user...');
    
    await fxSwapService.updateOrderStatus(
      order.id,
      FxSwapOrderStatus.SWAP_EXECUTING
    );
    
    // Check wallet balances first
    console.log('[FxSwapExecution] Checking wallet balances...');
    const ethBalance = await this.provider.getBalance(this.wallet.address);
    const ethBalanceFormatted = ethers.formatEther(ethBalance);
    console.log(`[FxSwapExecution] Hot wallet ETH balance: ${ethBalanceFormatted} ETH`);
    
    const USDT_ADDRESS = this.networkConfig.usdtAddress;
    const usdt = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, this.wallet);
    
    // Get USDT balance and decimals
    const usdtBalance = await usdt.balanceOf(this.wallet.address);
    const decimals = Number(await usdt.decimals());
    const usdtBalanceFormatted = ethers.formatUnits(usdtBalance, decimals);
    console.log(`[FxSwapExecution] Hot wallet USDT balance: ${usdtBalanceFormatted} USDT`);
    
    // Check if we have enough ETH for gas (minimum 0.001 ETH for safety)
    const minimumEthForGas = ethers.parseEther('0.001');
    if (ethBalance < minimumEthForGas) {
      throw new Error(`Insufficient ETH for gas. Have ${ethBalanceFormatted} ETH, need at least 0.001 ETH. Current balance is too low for USDT transfer.`);
    }
    
    // Calculate USD amount to transfer - FIX: Use fee-adjusted amount
    const fiatAmount = parseFloat(order.fiatAmount);
    const fxRate = parseFloat(order.fxRate);
    const platformFee = parseFloat(order.platformFeeAmount || '0');
    
    // FIX: Calculate correct amount after fees (should be ~8.33 USDT for 10 GBP)
    const usdAmount = (fiatAmount * fxRate) - platformFee;
    const usdtAmount = usdAmount.toFixed(decimals);
    const amount = ethers.parseUnits(usdtAmount, decimals);
    
    console.log(`[FxSwapExecution] Calculated amount: ${usdAmount} USD (${fiatAmount} GBP * ${fxRate} rate - ${platformFee} fee)`);
    console.log(`[FxSwapExecution] Transferring ${usdtAmount} USDT to ${order.destinationWallet}`);
    
    // Check if we have enough USDT
    if (usdtBalance < amount) {
      throw new Error(`Insufficient USDT balance. Have ${usdtBalanceFormatted} USDT, need ${usdtAmount} USDT.`);
    }
    
    try {
      // Execute transfer with lower gas limit for testing
      console.log('[FxSwapExecution] Estimating gas for USDT transfer...');
      const estimatedGas = await usdt.transfer.estimateGas(order.destinationWallet, amount);
      console.log(`[FxSwapExecution] Estimated gas: ${estimatedGas.toString()}`);
      
      // Execute transfer with conservative gas settings
      const tx = await usdt.transfer(order.destinationWallet, amount, {
        gasLimit: estimatedGas * 120n / 100n, // Add 20% buffer
        maxFeePerGas: ethers.parseUnits('20', 'gwei'), // Conservative gas price
        maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'),
      });
      
      console.log('[FxSwapExecution] USDT transfer transaction sent:', tx.hash);
      
      // Update order with transaction hash
      await fxSwapService.updateOrderStatus(
        order.id,
        FxSwapOrderStatus.SWAP_EXECUTING,
        {
          swapTxHash: tx.hash,
          targetTokenAmount: usdtAmount,
        }
      );
      
      return tx.hash;
      
    } catch (error: any) {
      console.error('[FxSwapExecution] Transfer failed:', error);
      
      // Provide more detailed error information
      if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new Error(`Insufficient ETH for gas fees. Current balance: ${ethBalanceFormatted} ETH. USDT transfer requires more ETH for transaction fees.`);
      } else if (error.code === 'CALL_EXCEPTION') {
        throw new Error(`USDT transfer failed: ${error.shortMessage || error.message}. This may be due to insufficient ETH for gas fees.`);
      } else {
        throw new Error(`USDT transfer failed: ${error.message}`);
      }
    }
  }
  
  /**
   * Wait for transfer transaction confirmation
   */
  private async waitForTransferConfirmation(order: any, txHash: string): Promise<void> {
    console.log('[FxSwapExecution] Waiting for transfer confirmation...');
    
    const receipt = await this.provider.waitForTransaction(txHash, 3);
    
    if (!receipt || receipt.status !== 1) {
      throw new Error('Transfer transaction failed on-chain');
    }
    
    // Update wallet operation
    await this.updateWalletOperation(txHash, {
      status: WalletOperationStatus.CONFIRMED,
      blockNumber: receipt.blockNumber,
      confirmations: 3,
      gasPrice: receipt.gasPrice?.toString(),
      gasUsed: Number(receipt.gasUsed),
      gasFeePaid: ethers.formatEther((receipt.gasUsed * (receipt.gasPrice || 0n))),
    });
    
    console.log('[FxSwapExecution] Transfer confirmed at block:', receipt.blockNumber);
  }
  
  /**
   * Record wallet operation to database
   */
  private async recordWalletOperation(data: InsertFxWalletOperation): Promise<void> {
    await db.insert(fxWalletOperations).values(data);
  }
  
  /**
   * Update wallet operation status
   */
  private async updateWalletOperation(
    txHash: string,
    updates: Partial<InsertFxWalletOperation>
  ): Promise<void> {
    await db
      .update(fxWalletOperations)
      .set(updates)
      .where(eq(fxWalletOperations.txHash, txHash));
  }
  
  /**
   * Get hot wallet balance for a token
   */
  async getHotWalletBalance(tokenAddress: string): Promise<string> {
    if (tokenAddress === 'ETH' || tokenAddress === ethers.ZeroAddress) {
      const balance = await this.provider.getBalance(this.wallet.address);
      return ethers.formatEther(balance);
    }
    
    const token = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
    const balance = await token.balanceOf(this.wallet.address);
    const decimals = await token.decimals();
    
    return ethers.formatUnits(balance, decimals);
  }
}

export const fxSwapExecutionService = new FxSwapExecutionService();
