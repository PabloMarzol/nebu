import { Router } from 'express';
import { fxSwapService } from '../services/fx_swap_service';
import { fxSwapExecutionService } from '../services/fx_swap_execution_service';
import { ethers } from 'ethers';
import { db } from '../db';
import { fxSwapOrders } from '@shared/fx_swap_schema';
import { eq, and, desc } from 'drizzle-orm';

const router = Router();

/**
 * Recovery Routes
 * Handles failed or stuck FX swap transactions
 */

/**
 * Check USDT transaction status for a payment intent
 * POST /api/recovery/check-usdt-status
 */
router.post('/check-usdt-status', async (req, res) => {
  try {
    const { paymentIntentId, destinationWallet } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment intent ID is required'
      });
    }

    console.log(`[Recovery] Checking USDT status for payment: ${paymentIntentId}`);

    // Find the FX swap order by payment intent
    const order = await fxSwapService.getOrderByPaymentIntent(paymentIntentId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'No swap order found for this payment'
      });
    }

    console.log(`[Recovery] Found order ${order.id} with status: ${order.status}`);

    let status = 'checking';
    let txHash = null;
    let confirmations = 0;
    let error = null;

    // Check order status and determine USDT transaction state
    switch (order.status) {
      case 'STRIPE_CONFIRMED':
        status = 'pending';
        break;
        
      case 'SWAP_EXECUTING':
        status = 'processing';
        break;
        
      case 'SWAP_COMPLETED':
        // Check if transfer was actually sent
        if (order.transferTxHash) {
          status = 'completed';
          txHash = order.transferTxHash;
          confirmations = 0; // Will be updated by blockchain verification
        } else {
          status = 'processing'; // Swap completed but transfer not sent yet
        }
        break;
        
      case 'TRANSFER_EXECUTING':
        status = 'processing';
        break;
        
      case 'COMPLETED':
        status = 'completed';
        txHash = order.transferTxHash;
        confirmations = 12; // Assume fully confirmed
        break;
        
      case 'STRIPE_FAILED':
      case 'SWAP_FAILED':
      case 'TRANSFER_FAILED':
        status = 'failed';
        error = order.errorMessage || 'Transaction failed';
        break;
        
      default:
        status = 'checking';
    }

    // If we have a transaction hash, verify it on blockchain
    if (txHash && destinationWallet) {
      try {
        const expectedAmount = order.targetTokenAmount ? parseFloat(order.targetTokenAmount) : 0;
        const txStatus = await verifyUSDTransaction(txHash, destinationWallet, expectedAmount);
        if (txStatus.isValid) {
          confirmations = txStatus.confirmations;
          if (confirmations >= 12) {
            status = 'completed';
          }
        } else {
          status = 'failed';
          error = 'Transaction verification failed';
        }
      } catch (verifyError) {
        console.error('[Recovery] Transaction verification failed:', verifyError);
        // Keep existing status, don't fail just because verification failed
      }
    }

    console.log(`[Recovery] USDT status: ${status}, txHash: ${txHash}, confirmations: ${confirmations}`);

    res.json({
      success: true,
      data: {
        status,
        txHash,
        confirmations,
        error,
        orderId: order.id,
        expectedAmount: order.targetTokenAmount,
        destinationWallet: order.destinationWallet,
        currentStep: order.status,
        createdAt: order.createdAt
      }
    });

  } catch (error: any) {
    console.error('[Recovery] USDT status check failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to check USDT transaction status'
    });
  }
});

/**
 * Verify USDT transaction on blockchain
 */
async function verifyUSDTransaction(txHash: string, destinationWallet: string, expectedAmount: number) {
  try {
    // Connect to Ethereum network
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID');
    
    // Get transaction details
    const tx = await provider.getTransaction(txHash);
    
    if (!tx) {
      return { isValid: false, confirmations: 0, error: 'Transaction not found' };
    }

    // Get transaction receipt
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt || receipt.status !== 1) {
      return { isValid: false, confirmations: 0, error: 'Transaction failed or not confirmed' };
    }

    // Check if transaction is to the correct destination
    if (tx.to?.toLowerCase() !== destinationWallet.toLowerCase()) {
      return { isValid: false, confirmations: 0, error: 'Destination mismatch' };
    }

    // Get current block number for confirmations
    const currentBlock = await provider.getBlockNumber();
    const confirmations = currentBlock - receipt.blockNumber;

    console.log(`[Recovery] Transaction verified: ${txHash}, confirmations: ${confirmations}`);

    return {
      isValid: true,
      confirmations,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };

  } catch (error) {
    console.error('[Recovery] Blockchain verification error:', error);
    return { isValid: false, confirmations: 0, error: 'Verification failed' };
  }
}

/**
 * Get pending recovery orders for a user
 * GET /api/recovery/pending-orders
 */
router.get('/pending-orders', async (req, res) => {
  try {
    // Get all orders that need recovery (failed orders)
    const orders = await db.select()
      .from(fxSwapOrders)
      .where(eq(fxSwapOrders.status, 'FAILED'))
      .orderBy(desc(fxSwapOrders.createdAt));

    res.json({
      success: true,
      data: { orders }
    });

  } catch (error: any) {
    console.error('[Recovery] Failed to fetch pending orders:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch pending orders'
    });
  }
});

/**
 * Execute recovery for a specific order
 * POST /api/recovery/execute-swap
 */
router.post('/execute-swap', async (req, res) => {
  try {
    const { orderId, force } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'Order ID is required'
      });
    }

    console.log(`[Recovery] Executing recovery for order: ${orderId}`);

    // Get the order
    const [order] = await db.select()
      .from(fxSwapOrders)
      .where(eq(fxSwapOrders.id, orderId));

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Execute the recovery based on current status
    let recoveryResult;
    
    try {
      switch (order.status) {
        case 'STRIPE_CONFIRMED':
          // Payment confirmed, need to execute swap
          recoveryResult = await fxSwapExecutionService.executeSwap(orderId);
          break;
          
        case 'SWAP_COMPLETED':
          // Swap completed, need to send transfer - use the existing transfer method
          recoveryResult = await fxSwapExecutionService.executeSwap(orderId);
          break;
          
        case 'SWAP_FAILED':
        case 'TRANSFER_FAILED':
          // Retry the failed step - just retry the swap execution
          recoveryResult = await fxSwapExecutionService.executeSwap(orderId);
          break;
          
        default:
          return res.status(400).json({
            success: false,
            error: `Cannot recover order in status: ${order.status}`
          });
      }

      // Recovery completed successfully
      res.json({
        success: true,
        data: {
          orderId,
          recoveryAction: 'swap_execution',
          newStatus: 'processing',
          message: 'Recovery executed successfully - swap in progress'
        }
      });

    } catch (error: any) {
      console.error(`[Recovery] Recovery execution failed for order ${orderId}:`, error);
      
      res.status(500).json({
        success: false,
        error: error.message || 'Recovery execution failed'
      });
    }

  } catch (error: any) {
    console.error('[Recovery] Recovery execution error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to execute recovery'
    });
  }
});

/**
 * Check recovery status for a specific order
 * GET /api/recovery/check-order/:orderId
 */
router.get('/check-order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const [order] = await db.select()
      .from(fxSwapOrders)
      .where(eq(fxSwapOrders.id, orderId));

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Determine if recovery is needed
    const canRecover = order.status === 'FAILED' || 
                      (order.status === 'STRIPE_CONFIRMED' && !order.swapTxHash) ||
                      (order.status === 'SWAP_COMPLETED' && !order.transferTxHash);

    let recoveryAction = null;
    
    if (canRecover) {
      switch (order.status) {
        case 'STRIPE_CONFIRMED':
          recoveryAction = 'Execute swap';
          break;
        case 'SWAP_COMPLETED':
          recoveryAction = 'Send USDT payment';
          break;
        case 'SWAP_FAILED':
        case 'TRANSFER_FAILED':
          recoveryAction = 'Retry failed step';
          break;
      }
    }

    res.json({
      success: true,
      data: {
        order,
        canRecover,
        recoveryAction
      }
    });

  } catch (error: any) {
    console.error('[Recovery] Order check failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to check order status'
    });
  }
});

/**
 * Get payment details for auto-creation
 * POST /api/recovery/get-payment-details
 */
router.post('/get-payment-details', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment intent ID is required'
      });
    }

    console.log(`[Recovery] Getting payment details for: ${paymentIntentId}`);

    // Try to find existing swap order first
    const existingOrder = await fxSwapService.getOrderByPaymentIntent(paymentIntentId);
    
    if (existingOrder) {
      return res.json({
        success: true,
        data: {
          userId: existingOrder.userId,
          fiatAmount: existingOrder.fiatAmount,
          fiatCurrency: existingOrder.fiatCurrency,
          destinationWallet: existingOrder.destinationWallet,
          targetToken: existingOrder.targetToken,
          estimatedOutput: existingOrder.targetTokenAmount,
          orderId: existingOrder.id,
          status: existingOrder.status
        }
      });
    }

    // If no existing order, return mock data for testing
    // In production, this would fetch from Stripe or payment service
    res.json({
      success: true,
      data: {
        userId: 'cd58399b-b81c-4e1a-bc8c-a41cc76e4325',
        fiatAmount: 10,
        fiatCurrency: 'GBP',
        destinationWallet: '0x3b2495e0f639bd4f942efd6cae2c15caa4efd312',
        targetToken: 'USDT',
        estimatedOutput: 13.286207,
        status: 'payment_confirmed'
      }
    });

  } catch (error: any) {
    console.error('[Recovery] Get payment details failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get payment details'
    });
  }
});

/**
 * Get recovery statistics
 * GET /api/recovery/stats
 */
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await db.select({ count: fxSwapOrders.id })
      .from(fxSwapOrders);

    const needsRecovery = await db.select({ count: fxSwapOrders.id })
      .from(fxSwapOrders)
      .where(eq(fxSwapOrders.status, 'FAILED'));

    const completed = await db.select({ count: fxSwapOrders.id })
      .from(fxSwapOrders)
      .where(eq(fxSwapOrders.status, 'COMPLETED'));

    const failed = await db.select({ count: fxSwapOrders.id })
      .from(fxSwapOrders)
      .where(eq(fxSwapOrders.status, 'FAILED'));

    res.json({
      success: true,
      data: {
        total: totalOrders[0]?.count || 0,
        needsRecovery: needsRecovery[0]?.count || 0,
        completed: completed[0]?.count || 0,
        failed: failed[0]?.count || 0
      }
    });

  } catch (error: any) {
    console.error('[Recovery] Stats fetch failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch recovery statistics'
    });
  }
});

export default router;
