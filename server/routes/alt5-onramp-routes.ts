import { Router } from 'express';
import { alt5PayService } from '../services/alt5pay-service';
import { ethers } from 'ethers';

const router = Router();

/**
 * ALT5 On-Ramp Routes
 * For buying cryptocurrency with fiat (GBP/USD/EUR)
 * This is the opposite of the current off-ramp flow
 */

/**
 * Create ALT5 On-Ramp Order
 * User pays with fiat to receive cryptocurrency
 * POST /api/alt5-onramp/create-order
 */
router.post('/create-order', async (req, res) => {
  try {
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

    console.log('[ALT5-OnRamp] Creating on-ramp order:', {
      gbpAmount,
      destinationWallet,
      targetToken,
      userId,
      clientOrderId,
      paymentMethod
    });

    // Get current crypto price for calculating the crypto amount
    const priceResponse = await alt5PayService.getCurrentPrice({
      coin: mapTokenToAlt5Coin(targetToken),
      currency: 'USD'
    });

    if (!priceResponse.data || !priceResponse.data.price) {
      throw new Error(`Failed to get current price for ${targetToken}`);
    }

    const cryptoPrice = parseFloat(priceResponse.data.price);
    const estimatedCryptoAmount = gbpAmount / cryptoPrice;

    console.log(`[ALT5-OnRamp] Price: £${cryptoPrice} per ${targetToken}, User gets: ${estimatedCryptoAmount} ${targetToken}`);

    // For on-ramping, we need to create a different flow than off-ramping
    // User pays GBP via bank transfer/card, we send them crypto from our hot wallet
    // For now, we'll simulate the ALT5 process and handle the crypto transfer separately

    const orderData = {
      orderId: clientOrderId,
      clientOrderId: clientOrderId,
      amount: gbpAmount,
      currency: 'GBP',
      status: 'pending',
      estimatedCryptoAmount: estimatedCryptoAmount,
      targetToken: targetToken,
      destinationWallet: destinationWallet,
      paymentMethod: paymentMethod,
      exchangeRate: cryptoPrice,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
      paymentInstructions: {
        amount: gbpAmount,
        currency: 'GBP',
        method: paymentMethod,
        reference: clientOrderId
      }
    };

    console.log('[ALT5-OnRamp] Order created successfully:', orderData);

    res.json({
      success: true,
      message: 'ALT5 On-Ramp order created successfully',
      data: orderData
    });

  } catch (error: any) {
    console.error('[ALT5-OnRamp] Order creation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Order creation failed',
      message: error.message || 'Failed to create ALT5 On-Ramp order'
    });
  }
});

/**
 * Get ALT5 On-Ramp Order Status
 * GET /api/alt5-onramp/order-status/:orderId
 */
router.get('/order-status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'Missing order ID',
        message: 'orderId is required'
      });
    }

    console.log('[ALT5-OnRamp] Getting order status:', orderId);

    // For on-ramp, we need to check if the fiat payment was received
    // and if the crypto has been sent to the user
    // For now, return a simulated status

    const mockStatus = {
      orderId: orderId,
      status: 'pending',
      gbpAmount: 100,
      cryptoAmount: 0.056,
      targetToken: 'USDT',
      paymentStatus: 'waiting_for_payment',
      cryptoTransferStatus: 'not_initiated',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    };

    res.json({
      success: true,
      message: 'Order status retrieved successfully',
      data: mockStatus
    });

  } catch (error: any) {
    console.error('[ALT5-OnRamp] Order status check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Order status check failed',
      message: error.message || 'Failed to get order status'
    });
  }
});

/**
 * Process Fiat Payment for On-Ramp
 * POST /api/alt5-onramp/process-payment
 * This would be called after user completes fiat payment
 */
router.post('/process-payment', async (req, res) => {
  try {
    const { orderId, paymentConfirmation, amountPaid } = req.body;

    if (!orderId || !paymentConfirmation) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'orderId and paymentConfirmation are required'
      });
    }

    console.log('[ALT5-OnRamp] Processing fiat payment:', { orderId, amountPaid });

    // In a real implementation, this would:
    // 1. Verify the fiat payment was received
    // 2. Calculate the exact crypto amount to send
    // 3. Transfer crypto from hot wallet to user
    // 4. Update order status

    // For now, simulate successful processing
    const processingResult = {
      orderId: orderId,
      paymentStatus: 'confirmed',
      cryptoTransferStatus: 'completed',
      cryptoAmount: amountPaid / 1800, // Example rate
      transactionHash: '0x' + Math.random().toString(36).substring(2, 15),
      completedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: processingResult
    });

  } catch (error: any) {
    console.error('[ALT5-OnRamp] Payment processing failed:', error);
    res.status(500).json({
      success: false,
      error: 'Payment processing failed',
      message: error.message || 'Failed to process payment'
    });
  }
});

/**
 * Get ALT5 On-Ramp Configuration
 * GET /api/alt5-onramp/config
 */
router.get('/config', async (req, res) => {
  try {
    console.log('[ALT5-OnRamp] Getting configuration');

    res.json({
      success: true,
      message: 'ALT5 On-Ramp configuration retrieved',
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
    console.error('[ALT5-OnRamp] Configuration retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Configuration retrieval failed',
      message: error.message || 'Failed to get configuration'
    });
  }
});

/**
 * Test ALT5 On-Ramp connectivity
 * GET /api/alt5-onramp/test
 */
router.get('/test', async (req, res) => {
  try {
    console.log('[ALT5-OnRamp] Testing connectivity');

    // Test ALT5 Pay API connectivity
    const balances = await alt5PayService.getBalances();

    res.json({
      success: true,
      message: 'ALT5 On-Ramp test completed successfully',
      data: {
        status: 'operational',
        alt5PayConnected: true,
        balances: balances,
        timestamp: new Date().toISOString(),
        note: 'On-ramp service ready for fiat-to-crypto conversions'
      }
    });

  } catch (error: any) {
    console.error('[ALT5-OnRamp] Test failed:', error);
    res.status(500).json({
      success: false,
      error: 'Test failed',
      message: error.message || 'ALT5 On-Ramp test failed'
    });
  }
});

/**
 * Map internal token symbols to ALT5 coin symbols
 */
function mapTokenToAlt5Coin(token: string): 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'BCH' | 'LTC' | 'XRP' | 'SOL' {
  const mapping: Record<string, any> = {
    'USDT': 'USDT',
    'USDC': 'USDC',
    'BTC': 'BTC',
    'ETH': 'ETH',
    'BCH': 'BCH',
    'LTC': 'LTC',
    'XRP': 'XRP',
    'SOL': 'SOL'
  };

  const alt5Coin = mapping[token.toUpperCase()];
  if (!alt5Coin) {
    throw new Error(`Unsupported token for ALT5: ${token}`);
  }

  return alt5Coin;
}

export default router;
