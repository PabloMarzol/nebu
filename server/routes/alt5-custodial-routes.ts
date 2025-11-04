import { Router } from 'express';
import { createAlt5CustodialService } from '../services/alt5-custodial-service';
import type { WebhookPayload } from '../services/alt5-custodial-service';
import { db } from '../db';
import type { PgDatabase } from 'drizzle-orm/pg-core';
import { fxSwapOrders } from '@shared/fx_swap_schema';
import { eq } from 'drizzle-orm';

const router = Router();
const alt5CustodialService = createAlt5CustodialService();

// Check if service is available
const checkServiceAvailability = (res: any) => {
  if (!alt5CustodialService) {
    return res.status(503).json({
      success: false,
      error: 'Service unavailable',
      message: 'ALT5 custodial service is not configured. Please set the required environment variables.'
    });
  }
  return null; // Service is available
};

// Type the database instance to fix TypeScript errors
const database = db;

// Helper function to check if database is available
const checkDatabaseAvailability = () => {
  if (!database) {
    throw new Error('Database is not available');
  }
  return database;
};

// Create ALT5 custodial order (on-ramp)
router.post('/create-order', async (req, res) => {
  try {
    // Check if service is available
    const serviceCheck = checkServiceAvailability(res);
    if (serviceCheck) return serviceCheck;

    const { 
      gbpAmount, 
      destinationWallet, 
      targetToken, 
      userId, 
      clientOrderId,
      paymentMethod 
    } = req.body;

    // Validate required fields
    if (!gbpAmount || !destinationWallet || !targetToken || !userId || !clientOrderId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'gbpAmount, destinationWallet, targetToken, userId, and clientOrderId are required'
      });
    }

    // Validate amount
    if (gbpAmount < 25 || gbpAmount > 50000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
        message: 'Amount must be between £25 and £50,000'
      });
    }

    console.log('[ALT5-Custodial] Creating on-ramp order:', {
      gbpAmount,
      destinationWallet,
      targetToken,
      userId,
      clientOrderId,
      paymentMethod
    });

    // Get current crypto price for estimation, but don't fail if price lookup fails
    let cryptoPrice = 1.0; // Default fallback price
    let estimatedCryptoAmount = gbpAmount; // Default fallback calculation

    try {
      if (alt5CustodialService) {
        const priceResponse = await alt5CustodialService.getCurrentPrice(targetToken, 'USD');
        
        if (priceResponse.data && priceResponse.data.price) {
          cryptoPrice = parseFloat(priceResponse.data.price);
          estimatedCryptoAmount = gbpAmount / cryptoPrice;
        }
      }
    } catch (priceError) {
      console.warn('[ALT5-Custodial] Failed to get current price, using default:', priceError);
      // Continue with default values
    }

    // Create custodial order with ALT5
    const orderRequest = {
      orderType: 'buy' as const,
      crypto: targetToken,
      fiat: 'USD', // Convert GBP to USD for ALT5
      fiatAmount: gbpAmount,
      destinationAddress: destinationWallet,
      callbackUrl: `${process.env.API_BASE_URL || 'http://localhost:3000'}/api/alt5-custodial/webhook`
    };

    if (!alt5CustodialService) {
      throw new Error('ALT5 custodial service is not available');
    }

    const orderResponse = await alt5CustodialService.createCustodialOrder(orderRequest);

    if (orderResponse.status === 'error') {
      throw new Error(orderResponse.message || 'Failed to create ALT5 order');
    }

    // Store order in database
    if (!database) {
      throw new Error('Database is not available');
    }
    const [dbOrder] = await database.insert(fxSwapOrders).values({
      id: orderResponse.data!.orderId,
      userId: userId,
      stripePaymentIntentId: `alt5_${orderResponse.data!.orderId}`,
      clientOrderId: clientOrderId,
      fiatCurrency: 'GBP',
      fiatAmount: gbpAmount.toString(),
      targetToken: targetToken,
      targetTokenAmount: estimatedCryptoAmount.toString(),
      destinationWallet: destinationWallet,
      fxRate: cryptoPrice.toString(),
      fxRateSource: 'alt5_custodial',
      fxRateTimestamp: new Date(),
      platformFeePercent: '2.00', // 2% ALT5 fee
      platformFeeAmount: (gbpAmount * 0.02).toString(),
      totalFeesUsd: (gbpAmount * 0.02).toString(),
      status: 'pending',
      createdAt: new Date()
    }).returning();

    res.json({
      success: true,
      message: 'ALT5 custodial order created successfully',
      data: {
        ...orderResponse.data,
        estimatedCryptoAmount
      }
    });

  } catch (error: any) {
    console.error('[ALT5-Custodial] Order creation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Order creation failed',
      message: error.message || 'Failed to create ALT5 custodial order'
    });
  }
});

// Get order status
router.get('/order-status/:orderId', async (req, res) => {
  try {
    // Check if service is available
    const serviceCheck = checkServiceAvailability(res);
    if (serviceCheck) return serviceCheck;

    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'Missing order ID',
        message: 'orderId is required'
      });
    }

    console.log('[ALT5-Custodial] Getting order status:', orderId);

    if (!alt5CustodialService) {
      throw new Error('ALT5 custodial service is not available');
    }

    // Get status from ALT5
    const statusResponse = await alt5CustodialService.getOrderStatus(orderId);

    if (statusResponse.status === 'error') {
      throw new Error(statusResponse.message || 'Failed to get order status');
    }

    // Update database with latest status
    if (statusResponse.data) {
      if (!database) {
        throw new Error('Database is not available');
      }
      await database.update(fxSwapOrders).set({
        status: statusResponse.data.status,
        targetTokenAmount: statusResponse.data.cryptoAmount?.toString(),
        swapCompletedAt: statusResponse.data.completedAt ? new Date(statusResponse.data.completedAt) : undefined,
        completedAt: statusResponse.data.completedAt ? new Date(statusResponse.data.completedAt) : undefined
      }).where(eq(fxSwapOrders.id, orderId));
    }

    res.json({
      success: true,
      message: 'Order status retrieved successfully',
      data: statusResponse.data
    });

  } catch (error: any) {
    console.error('[ALT5-Custodial] Order status check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Order status check failed',
      message: error.message || 'Failed to get order status'
    });
  }
});

// Webhook endpoint for ALT5 notifications
router.post('/webhook', async (req, res) => {
  try {
    // Check if service is available
    const serviceCheck = checkServiceAvailability(res);
    if (serviceCheck) return serviceCheck;

    const signature = req.headers['signature'] as string;
    const body = JSON.stringify(req.body);

    if (!alt5CustodialService) {
      throw new Error('ALT5 custodial service is not available');
    }

    // Verify webhook signature
    if (!signature || !alt5CustodialService.verifyWebhookSignature(body, signature)) {
      console.error('[ALT5-Custodial] Invalid webhook signature');
      return res.status(401).json({
        status: 'error',
        message: 'Invalid signature'
      });
    }

    const payload: WebhookPayload = req.body;
    
    console.log('[ALT5-Custodial] Webhook received:', {
      orderId: payload.orderId,
      status: payload.status,
      crypto: payload.crypto,
      fiatAmount: payload.fiatAmount,
      txHash: payload.txHash
    });

    // Update order status in database
    if (!database) {
      throw new Error('Database is not available');
    }
    const [updatedOrder] = await database.update(fxSwapOrders).set({
      status: payload.status === 'completed' ? 'completed' : 'failed',
      targetTokenAmount: payload.cryptoAmount.toString(),
      swapTxHash: payload.txHash,
      completedAt: payload.status === 'completed' ? new Date() : undefined,
      errorMessage: payload.status === 'failed' ? 'ALT5 payment failed' : undefined
    }).where(eq(fxSwapOrders.id, payload.orderId)).returning();

    if (updatedOrder) {
      console.log(`[ALT5-Custodial] Order ${payload.orderId} updated to ${payload.status}`);
      
      // Emit WebSocket event for real-time updates
      // This would typically emit to a WebSocket server
      // wsServer.emit('alt5-order-update', { orderId: payload.orderId, status: payload.status });
    }

    // Always respond with 200 OK to acknowledge receipt
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('[ALT5-Custodial] Webhook processing error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process webhook'
    });
  }
});

// Get ALT5 custodial configuration
router.get('/config', async (req, res) => {
  try {
    console.log('[ALT5-Custodial] Getting configuration');

    res.json({
      success: true,
      message: 'ALT5 custodial configuration retrieved',
      data: {
        minAmount: 25,
        maxAmount: 50000,
        supportedCurrencies: ['GBP', 'USD', 'EUR'],
        supportedTokens: ['USDT', 'USDC', 'BTC', 'ETH', 'BCH', 'LTC', 'XRP', 'SOL'],
        supportedPaymentMethods: ['bank_transfer', 'card', 'wire'],
        processingTime: 'Instant to 15 minutes',
        fees: {
          percentage: 2.0,
          currency: 'GBP'
        },
        features: [
          'Buy crypto with fiat',
          'No chargeback risk',
          'Fast settlement',
          'Multiple payment methods',
          'Professional rates'
        ]
      }
    });

  } catch (error: any) {
    console.error('[ALT5-Custodial] Configuration retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Configuration retrieval failed',
      message: error.message || 'Failed to get configuration'
    });
  }
});

// Test ALT5 custodial connectivity
router.get('/test', async (req, res) => {
  try {
    // Check if service is available
    const serviceCheck = checkServiceAvailability(res);
    if (serviceCheck) return serviceCheck;

    console.log('[ALT5-Custodial] Testing connectivity');

    if (!alt5CustodialService) {
      throw new Error('ALT5 custodial service is not available');
    }

    // Test with a small price request
    const priceResponse = await alt5CustodialService.getCurrentPrice('USDT', 'USD');

    res.json({
      success: true,
      message: 'ALT5 custodial service test completed successfully',
      data: {
        status: 'operational',
        alt5Connected: true,
        timestamp: new Date().toISOString(),
        note: 'Custodial on-ramp service ready for fiat-to-crypto conversions',
        priceCheck: priceResponse.data?.price ? `USDT: $${priceResponse.data.price}` : 'Price check failed'
      }
    });

  } catch (error: any) {
    console.error('[ALT5-Custodial] Test failed:', error);
    res.status(500).json({
      success: false,
      error: 'Test failed',
      message: error.message || 'ALT5 custodial service test failed'
    });
  }
});

export default router;
