import { Router } from 'express';
import { fxSwapService } from '../services/fx_swap_service';
import { fxSwapExecutionService } from '../services/fx_swap_execution_service';
import { db } from '../db';
import { fxSwapOrders, fxWalletOperations, FxSwapOrderStatus } from '@shared/fx_swap_schema';
import { eq, desc, gte, and, sql } from 'drizzle-orm';
import { ethers } from 'ethers';

const router = Router();

/**
 * GET /api/fx-swap/monitoring/status
 * Get real-time system status for live testing
 */
router.get('/monitoring/status', async (req, res) => {
  try {
    // Hot wallet balances
    const hotWalletAddress = process.env.HOT_WALLET_PRIVATE_KEY 
      ? new ethers.Wallet(process.env.HOT_WALLET_PRIVATE_KEY).address
      : '0x5812817c149E2C6F5a8689B2e5Df73a509ec2299'; // Default from execution service

    const [ethBalance, wethBalance, usdtBalance] = await Promise.all([
      fxSwapExecutionService.getHotWalletBalance('ETH'),
      fxSwapExecutionService.getHotWalletBalance('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'), // WETH
      fxSwapExecutionService.getHotWalletBalance('0xdAC17F958D2ee523a2206206994597C13D831ec7'), // USDT
    ]);

    // Recent orders summary
    const recentOrders = await db
      .select({
        status: fxSwapOrders.status,
        count: sql<number>`count(*)`,
        totalAmount: sql<string>`sum(${fxSwapOrders.fiatAmount})`,
      })
      .from(fxSwapOrders)
      .where(gte(fxSwapOrders.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000))) // Last 24h
      .groupBy(fxSwapOrders.status);

    // Failed orders in last hour
    const failedOrders = await db
      .select()
      .from(fxSwapOrders)
      .where(
        and(
          gte(fxSwapOrders.createdAt, new Date(Date.now() - 60 * 60 * 1000)), // Last hour
          sql`${fxSwapOrders.status} LIKE '%FAILED%'`
        )
      )
      .orderBy(desc(fxSwapOrders.createdAt))
      .limit(10);

    // System health checks
    const healthChecks = {
      stripe: await checkStripeHealth(),
      blockchain: await checkBlockchainHealth(),
      zeroX: await checkZeroXHealth(),
      database: await checkDatabaseHealth(),
    };

    res.json({
      success: true,
      data: {
        hotWallet: {
          address: hotWalletAddress,
          balances: {
            eth: ethBalance,
            weth: wethBalance,
            usdt: usdtBalance,
          },
          lowBalanceWarnings: {
            eth: parseFloat(ethBalance) < 0.05,
            weth: parseFloat(wethBalance) < 0.5,
            usdt: parseFloat(usdtBalance) < 100,
          }
        },
        recentActivity: {
          last24h: recentOrders,
          failedLastHour: failedOrders.length,
          failedOrders: failedOrders.map(order => ({
            id: order.id,
            status: order.status,
            fiatAmount: order.fiatAmount,
            errorMessage: order.errorMessage,
            createdAt: order.createdAt,
          }))
        },
        systemHealth: healthChecks,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error: any) {
    console.error('[FxSwap Monitoring] Status check failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Status check failed'
    });
  }
});

/**
 * GET /api/fx-swap/monitoring/orders/:orderId
 * Get detailed order information for testing
 */
router.get('/monitoring/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await fxSwapService.getOrder(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Get related wallet operations
    const walletOps = await db
      .select()
      .from(fxWalletOperations)
      .where(eq(fxWalletOperations.fxSwapOrderId, orderId))
      .orderBy(desc(fxWalletOperations.createdAt));

    // Calculate execution timeline
    const timeline = calculateExecutionTimeline(order);

    res.json({
      success: true,
      data: {
        order,
        walletOperations: walletOps,
        executionTimeline: timeline,
        diagnostics: {
          rateAge: order.fxRateTimestamp 
            ? Date.now() - new Date(order.fxRateTimestamp).getTime() 
            : null,
          totalExecutionTime: calculateTotalExecutionTime(order),
          potentialIssues: identifyPotentialIssues(order, walletOps),
        }
      }
    });
  } catch (error: any) {
    console.error('[FxSwap Monitoring] Order details failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get order details'
    });
  }
});

/**
 * POST /api/fx-swap/monitoring/test-swap
 * Manually trigger swap execution for testing
 */
router.post('/monitoring/test-swap', async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'Order ID required'
      });
    }

    const order = await fxSwapService.getOrder(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Verify order can be executed
    if (order.status !== FxSwapOrderStatus.STRIPE_CONFIRMED) {
      return res.status(400).json({
        success: false,
        error: `Order not ready for swap. Current status: ${order.status}`
      });
    }

    // Trigger swap execution
    console.log(`[FxSwap Monitoring] Manually triggering swap for order: ${orderId}`);
    
    // Execute asynchronously to avoid blocking the response
    fxSwapExecutionService.executeSwap(orderId)
      .then(() => {
        console.log(`[FxSwap Monitoring] Manual swap completed for order: ${orderId}`);
      })
      .catch(error => {
        console.error(`[FxSwap Monitoring] Manual swap failed for order: ${orderId}`, error);
      });

    res.json({
      success: true,
      message: 'Swap execution triggered',
      orderId
    });
  } catch (error: any) {
    console.error('[FxSwap Monitoring] Test swap failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Test swap failed'
    });
  }
});

/**
 * GET /api/fx-swap/monitoring/rate-history
 * Get FX rate history for validation
 */
router.get('/monitoring/rate-history', async (req, res) => {
  try {
    const { hours = 24, currency = 'GBP' } = req.query;
    
    const startTime = new Date(Date.now() - parseInt(hours as string) * 60 * 60 * 1000);
    
    const rates = await db
      .select()
      .from(fxRateSnapshots)
      .where(
        and(
          gte(fxRateSnapshots.timestamp, startTime),
          eq(fxRateSnapshots.fromCurrency, currency as string)
        )
      )
      .orderBy(desc(fxRateSnapshots.timestamp))
      .limit(1000);

    // Calculate rate statistics
    const rateValues = rates.map(r => parseFloat(r.rate));
    const stats = {
      min: Math.min(...rateValues),
      max: Math.max(...rateValues),
      avg: rateValues.reduce((a, b) => a + b, 0) / rateValues.length,
      volatility: calculateVolatility(rateValues),
    };

    res.json({
      success: true,
      data: {
        rates: rates.map(rate => ({
          timestamp: rate.timestamp,
          rate: parseFloat(rate.rate),
          source: rate.source,
          confidence: parseFloat(rate.confidenceScore),
        })),
        statistics: stats,
        timeRange: {
          start: startTime,
          end: new Date(),
          hours: parseInt(hours as string),
        }
      }
    });
  } catch (error: any) {
    console.error('[FxSwap Monitoring] Rate history failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get rate history'
    });
  }
});

// Helper functions

async function checkStripeHealth(): Promise<any> {
  try {
    // Check if Stripe is configured and responding
    const stripe = require('../services/stripe-service').stripe;
    
    // Try to list a few payment intents to verify connectivity
    const paymentIntents = await stripe.paymentIntents.list({ limit: 1 });
    
    return {
      status: 'healthy',
      configured: true,
      testMode: !stripe.getApiKey().startsWith('sk_live_'),
      lastResponse: paymentIntents ? 'ok' : 'failed',
    };
  } catch (error: any) {
    return {
      status: 'unhealthy',
      configured: false,
      error: error.message,
    };
  }
}

async function checkBlockchainHealth(): Promise<any> {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com');
    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);
    
    if (!block) {
      return {
        status: 'unhealthy',
        error: 'Could not fetch latest block',
      };
    }
    
    const blockAge = Date.now() - (block.timestamp * 1000);
    const isSynced = blockAge < 60000; // Less than 1 minute old
    
    return {
      status: isSynced ? 'healthy' : 'warning',
      blockNumber,
      blockAge: Math.floor(blockAge / 1000), // seconds
      synced: isSynced,
    };
  } catch (error: any) {
    return {
      status: 'unhealthy',
      error: error.message,
    };
  }
}

async function checkZeroXHealth(): Promise<any> {
  try {
    const response = await fetch('https://api.0x.org/swap/v1/health', {
      headers: {
        '0x-api-key': process.env.ZERO_X_API_KEY || '',
      },
    });
    
    const healthData = await response.json();
    
    return {
      status: response.ok ? 'healthy' : 'unhealthy',
      apiStatus: healthData,
      responseTime: response.headers.get('x-response-time'),
    };
  } catch (error: any) {
    return {
      status: 'unhealthy',
      error: error.message,
    };
  }
}

async function checkDatabaseHealth(): Promise<any> {
  try {
    // Simple query to check database connectivity
    const result = await db.select({ count: sql`count(*)` }).from(fxSwapOrders).limit(1);
    
    return {
      status: 'healthy',
      queryTime: new Date().toISOString(),
      totalOrders: result[0]?.count || 0,
    };
  } catch (error: any) {
    return {
      status: 'unhealthy',
      error: error.message,
    };
  }
}

function calculateExecutionTimeline(order: any): any[] {
  const timeline = [];
  const events = [
    { time: order.createdAt, event: 'Order Created', status: order.status },
    { time: order.stripeConfirmedAt, event: 'Stripe Payment Confirmed', status: 'stripe_confirmed' },
    { time: order.fxRateLockedAt, event: 'FX Rate Locked', status: 'fx_rate_locked' },
    { time: order.swapStartedAt, event: 'Swap Execution Started', status: 'swap_executing' },
    { time: order.swapCompletedAt, event: 'Swap Completed', status: 'swap_completed' },
    { time: order.transferStartedAt, event: 'Transfer Started', status: 'transfer_executing' },
    { time: order.completedAt, event: 'Order Completed', status: 'completed' },
    { time: order.failedAt, event: 'Order Failed', status: 'failed' },
  ].filter(item => item.time);

  let previousTime = new Date(order.createdAt);
  
  for (const event of events) {
    if (event.time) {
      const duration = new Date(event.time).getTime() - previousTime.getTime();
      timeline.push({
        ...event,
        duration: duration,
        durationSeconds: Math.floor(duration / 1000),
      });
      previousTime = new Date(event.time);
    }
  }

  return timeline;
}

function calculateTotalExecutionTime(order: any): number | null {
  if (!order.createdAt) return null;
  const endTime = order.completedAt || order.failedAt || new Date();
  return new Date(endTime).getTime() - new Date(order.createdAt).getTime();
}

function calculateVolatility(rates: number[]): number {
  if (rates.length < 2) return 0;
  
  const mean = rates.reduce((a, b) => a + b, 0) / rates.length;
  const variance = rates.reduce((sum, rate) => sum + Math.pow(rate - mean, 2), 0) / rates.length;
  return Math.sqrt(variance);
}

function identifyPotentialIssues(order: any, walletOps: any[]): string[] {
  const issues = [];
  
  // Check for rate expiration
  if (order.fxRateTimestamp) {
    const rateAge = Date.now() - new Date(order.fxRateTimestamp).getTime();
    if (rateAge > 30000) { // 30 seconds
      issues.push('FX rate may be expired');
    }
  }
  
  // Check for long execution times
  const executionTime = calculateTotalExecutionTime(order);
  if (executionTime && executionTime > 10 * 60 * 1000) { // 10 minutes
    issues.push('Execution time exceeds 10 minutes');
  }
  
  // Check for missing transactions
  if (order.status === 'swap_executing' && !order.swapTxHash) {
    issues.push('Swap executing but no transaction hash');
  }
  
  if (order.status === 'transfer_executing' && !order.transferTxHash) {
    issues.push('Transfer executing but no transaction hash');
  }
  
  // Check for failed wallet operations
  const failedOps = walletOps.filter(op => op.status === 'failed');
  if (failedOps.length > 0) {
    issues.push(`${failedOps.length} failed wallet operations`);
  }
  
  return issues;
}

export default router;
