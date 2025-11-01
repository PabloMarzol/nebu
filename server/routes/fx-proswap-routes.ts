import { Router } from 'express';
import { enhancedStripeService } from '../services/stripe-service';
import { fxSwapService } from '../services/fx_swap_service';
import { paymentProviderService } from '../services/payment-provider-service';
import { stripe } from '../services/stripe-service';

const router = Router();

/**
 * FX-ProSwap (Stripe) Dedicated Routes
 * Isolated routes for Stripe payment processing with professional branding
 */

/**
 * Create FX-ProSwap payment intent
 * POST /api/fx-proswap/create-payment
 */
router.post('/create-payment', async (req, res) => {
  try {
    const { 
      gbpAmount, 
      destinationWallet, 
      targetToken, 
      userId, 
      clientOrderId 
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
    if (gbpAmount < 10 || gbpAmount > 10000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
        message: 'Amount must be between £10 and £10,000'
      });
    }

    console.log('[FX-ProSwap] Creating payment intent:', {
      gbpAmount,
      destinationWallet,
      targetToken,
      userId,
      clientOrderId
    });

    // Create actual Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(gbpAmount * 100), // Convert to cents
      currency: 'gbp',
      metadata: {
        destinationWallet,
        targetToken,
        userId,
        clientOrderId,
        provider: 'stripe'
      },
      description: `FX-ProSwap: ${gbpAmount} GBP to ${targetToken}`
    });

    // Create FX swap order record
    const fxOrder = await fxSwapService.createOrder({
      stripePaymentIntentId: paymentIntent.id,
      userId,
      fiatAmount: gbpAmount,
      destinationWallet,
      targetToken,
      clientOrderId,
      fiatCurrency: 'GBP',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    console.log('[FX-ProSwap] Payment created successfully:', {
      provider: 'stripe',
      paymentIntentId: paymentIntent.id,
      amount: gbpAmount
    });

    res.json({
      success: true,
      message: 'FX-ProSwap payment created successfully',
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        clientOrderId,
        amount: gbpAmount,
        currency: 'gbp',
        status: paymentIntent.status,
        checkoutUrl: `/payment?client_secret=${paymentIntent.client_secret}`,
        swapEstimate: {
          estimatedCryptoAmount: (gbpAmount * 1.34 * 0.97).toFixed(4), // Approximate rate
          exchangeRate: 1.34,
          fees: {
            processing: gbpAmount * 0.029,
            fixed: 0.30,
            total: (gbpAmount * 0.029 + 0.30).toFixed(2)
          }
        }
      }
    });

  } catch (error: any) {
    console.error('[FX-ProSwap] Payment creation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Payment creation failed',
      message: error.message || 'Failed to create FX-ProSwap payment'
    });
  }
});

/**
 * Get FX-ProSwap payment status
 * GET /api/fx-proswap/payment-status/:paymentIntentId
 */
router.get('/payment-status/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment intent ID',
        message: 'paymentIntentId is required'
      });
    }

    console.log('[FX-ProSwap] Getting payment status:', paymentIntentId);

    // Get payment status from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      success: true,
      message: 'Payment status retrieved successfully',
      data: {
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        created: paymentIntent.created
      }
    });

  } catch (error: any) {
    console.error('[FX-ProSwap] Payment status check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Payment status check failed',
      message: error.message || 'Failed to get payment status'
    });
  }
});

/**
 * Confirm FX-ProSwap payment
 * POST /api/fx-proswap/confirm-payment
 */
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment intent ID',
        message: 'paymentIntentId is required'
      });
    }

    console.log('[FX-ProSwap] Confirming payment:', paymentIntentId);

    // Confirm the payment intent
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

    // Update FX swap order status if payment is successful
    if (paymentIntent.status === 'succeeded') {
      await fxSwapService.updateOrderStatus(paymentIntentId, 'STRIPE_CONFIRMED');
    }

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      }
    });

  } catch (error: any) {
    console.error('[FX-ProSwap] Payment confirmation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Payment confirmation failed',
      message: error.message || 'Failed to confirm payment'
    });
  }
});

/**
 * Cancel FX-ProSwap payment
 * POST /api/fx-proswap/cancel-payment
 */
router.post('/cancel-payment', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment intent ID',
        message: 'paymentIntentId is required'
      });
    }

    console.log('[FX-ProSwap] Canceling payment:', paymentIntentId);

    // Cancel the payment intent
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);

    // Update FX swap order status
    await fxSwapService.updateOrderStatus(paymentIntentId, 'STRIPE_CANCELLED');

    res.json({
      success: true,
      message: 'Payment canceled successfully',
      data: {
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status
      }
    });

  } catch (error: any) {
    console.error('[FX-ProSwap] Payment cancellation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Payment cancellation failed',
      message: error.message || 'Failed to cancel payment'
    });
  }
});

/**
 * Get FX-ProSwap configuration
 * GET /api/fx-proswap/config
 */
router.get('/config', async (req, res) => {
  try {
    console.log('[FX-ProSwap] Getting configuration');

    res.json({
      success: true,
      message: 'FX-ProSwap configuration retrieved',
      data: {
        minAmount: 10,
        maxAmount: 10000,
        supportedCurrencies: ['GBP', 'USD', 'EUR', 'CAD'],
        supportedTokens: ['USDT', 'USDC', 'BTC', 'ETH', 'BCH', 'LTC', 'XRP', 'SOL'],
        processingFees: {
          percentage: 2.9,
          fixed: 0.30,
          currency: 'GBP'
        },
        features: [
          'Instant payment processing',
          'Bank-level security',
          'Fraud protection',
          'Global availability',
          'Chargeback protection'
        ]
      }
    });

  } catch (error: any) {
    console.error('[FX-ProSwap] Configuration retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Configuration retrieval failed',
      message: error.message || 'Failed to get configuration'
    });
  }
});

/**
 * Test FX-ProSwap connectivity
 * GET /api/fx-proswap/test
 */
router.get('/test', async (req, res) => {
  try {
    console.log('[FX-ProSwap] Testing connectivity');

    // Test Stripe API connectivity
    const balance = await stripe.balance.retrieve();

    res.json({
      success: true,
      message: 'FX-ProSwap test completed successfully',
      data: {
        status: 'operational',
        stripeConnected: true,
        availableBalance: balance.available,
        pendingBalance: balance.pending,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('[FX-ProSwap] Test failed:', error);
    res.status(500).json({
      success: false,
      error: 'Test failed',
      message: error.message || 'FX-ProSwap test failed'
    });
  }
});

export default router;
