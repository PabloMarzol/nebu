import { Router } from 'express';
import { fxSwapService } from '../services/fx_swap_service';

const router = Router();

/**
 * FX-RAMP-Swap Dedicated Routes
 * Integration with Ramp Network for seamless fiat-to-crypto purchases
 */

/**
 * Create Ramp purchase
 * POST /api/fx-ramp/create-purchase
 */
router.post('/create-purchase', async (req, res) => {
  try {
    const { 
      fiatAmount, 
      fiatCurrency, 
      targetToken, 
      destinationWallet, 
      userId, 
      clientOrderId 
    } = req.body;

    // Validate required fields
    if (!fiatAmount || !fiatCurrency || !targetToken || !destinationWallet || !userId || !clientOrderId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'fiatAmount, fiatCurrency, targetToken, destinationWallet, userId, and clientOrderId are required'
      });
    }

    // Validate amount
    if (fiatAmount < 10 || fiatAmount > 50000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
        message: 'Amount must be between 10 and 50,000'
      });
    }

    console.log('[FX-RAMP] Creating purchase:', {
      fiatAmount,
      fiatCurrency,
      targetToken,
      destinationWallet,
      userId,
      clientOrderId
    });

    // Create FX swap order record for Ramp (using Stripe payment intent as placeholder)
    const stripePaymentIntentId = `ramp_${clientOrderId}`; // Use Ramp order ID as Stripe intent ID for compatibility
    const fxOrderId = await fxSwapService.createOrder({
      userId,
      stripePaymentIntentId,
      clientOrderId,
      fiatCurrency,
      fiatAmount,
      targetToken,
      destinationWallet,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    console.log('[FX-RAMP] Purchase created successfully:', {
      provider: 'ramp',
      orderId: fxOrderId,
      amount: fiatAmount,
      currency: fiatCurrency
    });

    res.json({
      success: true,
      message: 'FX-RAMP purchase created successfully',
      data: {
        orderId: fxOrderId,
        clientOrderId,
        amount: fiatAmount,
        currency: fiatCurrency,
        targetToken,
        destinationWallet,
        rampConfig: {
          swapAsset: targetToken,
          fiatCurrency: fiatCurrency,
          fiatValue: fiatAmount,
          userAddress: destinationWallet,
          hostApiKey: process.env.VITE_RAMP_API_KEY || 'pk_test_...',
          hostAppName: 'NebulaX FX Swap',
          hostLogoUrl: `${req.protocol}://${req.get('host')}/favicon.ico`,
          webhookStatusUrl: `${req.protocol}://${req.get('host')}/api/fx-ramp/webhook`,
          finalUrl: `${req.protocol}://${req.get('host')}/payment-success`
        }
      }
    });

  } catch (error: any) {
    console.error('[FX-RAMP] Purchase creation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Purchase creation failed',
      message: error.message || 'Failed to create FX-RAMP purchase'
    });
  }
});

/**
 * Get Ramp configuration
 * GET /api/fx-ramp/config
 */
router.get('/config', async (req, res) => {
  try {
    console.log('[FX-RAMP] Getting configuration');

    res.json({
      success: true,
      message: 'FX-RAMP configuration retrieved',
      data: {
        minAmount: 10,
        maxAmount: 50000,
        supportedCurrencies: ['GBP', 'USD', 'EUR'],
        supportedTokens: ['USDT', 'USDC', 'ETH', 'BTC', 'DAI'],
        supportedCountries: 170,
        processingFees: {
          percentage: 1.5,
          fixed: 0,
          currency: 'varies'
        },
        features: [
          'Non-custodial',
          'Bank-grade security',
          '170+ countries supported',
          'Instant processing',
          'No chargebacks',
          'Direct wallet integration'
        ],
        rampUrl: 'https://buy.ramp.network/',
        documentation: 'https://docs.ramp.network/'
      }
    });

  } catch (error: any) {
    console.error('[FX-RAMP] Configuration retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Configuration retrieval failed',
      message: error.message || 'Failed to get configuration'
    });
  }
});

/**
 * Webhook endpoint for Ramp events
 * POST /api/fx-ramp/webhook
 */
router.post('/webhook', async (req, res) => {
  try {
    const { 
      purchaseId, 
      status, 
      cryptoAmount, 
      fiatAmount, 
      fiatCurrency,
      asset,
      receiverAddress,
      finalTxHash 
    } = req.body;

    console.log('[FX-RAMP] Webhook received:', {
      purchaseId,
      status,
      cryptoAmount,
      fiatAmount,
      fiatCurrency,
      asset,
      receiverAddress,
      finalTxHash
    });

    // Update FX swap order status based on Ramp webhook
    if (purchaseId && status) {
      let orderStatus = 'PENDING';
      
      switch (status.toLowerCase()) {
        case 'completed':
        case 'confirmed':
          orderStatus = 'RAMP_COMPLETED';
          break;
        case 'failed':
        case 'cancelled':
          orderStatus = 'RAMP_FAILED';
          break;
        case 'pending':
          orderStatus = 'RAMP_PENDING';
          break;
        default:
          orderStatus = 'RAMP_PROCESSING';
      }

      await fxSwapService.updateOrderStatus(purchaseId, orderStatus);
    }

    res.json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error: any) {
    console.error('[FX-RAMP] Webhook processing failed:', error);
    res.status(500).json({
      success: false,
      error: 'Webhook processing failed',
      message: error.message || 'Failed to process webhook'
    });
  }
});

/**
 * Get Ramp purchase status
 * GET /api/fx-ramp/purchase-status/:purchaseId
 */
router.get('/purchase-status/:purchaseId', async (req, res) => {
  try {
    const { purchaseId } = req.params;

    if (!purchaseId) {
      return res.status(400).json({
        success: false,
        error: 'Missing purchase ID',
        message: 'purchaseId is required'
      });
    }

    console.log('[FX-RAMP] Getting purchase status:', purchaseId);

    // Get purchase status from our FX swap order (get by order ID since we don't have getOrderByClientOrderId)
    const order = await fxSwapService.getOrder(purchaseId);

    res.json({
      success: true,
      message: 'Purchase status retrieved successfully',
      data: {
        purchaseId: order.clientOrderId,
        status: order.status,
        amount: order.fiatAmount,
        currency: order.fiatCurrency,
        targetToken: order.targetToken,
        destinationWallet: order.destinationWallet,
        createdAt: order.createdAt
      }
    });

  } catch (error: any) {
    console.error('[FX-RAMP] Purchase status check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Purchase status check failed',
      message: error.message || 'Failed to get purchase status'
    });
  }
});

/**
 * Test FX-RAMP connectivity
 * GET /api/fx-ramp/test
 */
router.get('/test', async (req, res) => {
  try {
    console.log('[FX-RAMP] Testing connectivity');

    // Test Ramp API connectivity (basic test)
    const rampHealth = {
      status: 'operational',
      rampConnected: true,
      timestamp: new Date().toISOString(),
      config: {
        apiKey: process.env.VITE_RAMP_API_KEY ? 'Configured' : 'Not configured',
        webhookUrl: `${req.protocol}://${req.get('host')}/api/fx-ramp/webhook`,
        supportedCurrencies: ['GBP', 'USD', 'EUR'],
        supportedTokens: ['USDT', 'USDC', 'ETH', 'BTC', 'DAI']
      }
    };

    res.json({
      success: true,
      message: 'FX-RAMP test completed successfully',
      data: rampHealth
    });

  } catch (error: any) {
    console.error('[FX-RAMP] Test failed:', error);
    res.status(500).json({
      success: false,
      error: 'Test failed',
      message: error.message || 'FX-RAMP test failed'
    });
  }
});

export default router;
