import { Router } from 'express';
import { nowPaymentsService } from '../services/nowpayments-service';
import { fxSwapService } from '../services/fx_swap_service';
import { paymentProviderService } from '../services/payment-provider-service';

const router = Router();

/**
 * FX-NOW-Swap Dedicated Routes
 * Isolated routes for NOWPayments hosted crypto payments with professional branding
 */

/**
 * Create FX-NOW-Swap hosted invoice
 * POST /api/fx-now-swap/create-invoice
 */
router.post('/create-invoice', async (req, res) => {
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
    if (gbpAmount < 10 || gbpAmount > 75000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
        message: 'Amount must be between £10 and £75,000'
      });
    }

    console.log('[FX-NOW-Swap] Creating hosted invoice:', {
      gbpAmount,
      destinationWallet,
      targetToken,
      userId,
      clientOrderId
    });

    // Create invoice using the payment provider service
    const result = await paymentProviderService.createPayment({
      gbpAmount,
      destinationWallet,
      targetToken,
      userId,
      clientOrderId,
      preferredProvider: 'nowpayments',
      fiatCurrency: 'USD'
    });

    console.log('[FX-NOW-Swap] Invoice created successfully:', {
      provider: result.provider,
      paymentId: result.paymentData.paymentId,
      amount: result.paymentData.amount
    });

    res.json({
      success: true,
      message: 'FX-NOW-Swap invoice created successfully',
      data: {
        invoiceUrl: result.paymentData.invoiceUrl,
        paymentId: result.paymentData.paymentId,
        clientOrderId: result.paymentData.clientOrderId,
        amount: result.paymentData.amount,
        currency: result.paymentData.currency,
        status: result.paymentData.status,
        hostedUrl: result.paymentData.hostedUrl,
        comparison: result.comparison
      }
    });

  } catch (error: any) {
    console.error('[FX-NOW-Swap] Invoice creation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Invoice creation failed',
      message: error.message || 'Failed to create FX-NOW-Swap invoice'
    });
  }
});

/**
 * Get FX-NOW-Swap payment status
 * GET /api/fx-now-swap/payment-status/:paymentId
 */
router.get('/payment-status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment ID',
        message: 'paymentId is required'
      });
    }

    console.log('[FX-NOW-Swap] Getting payment status:', paymentId);

    // Get payment status from NOWPayments
    const paymentStatus = await nowPaymentsService.verifyPaymentStatus(paymentId);

    res.json({
      success: true,
      message: 'Payment status retrieved successfully',
      data: paymentStatus
    });

  } catch (error: any) {
    console.error('[FX-NOW-Swap] Payment status check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Payment status check failed',
      message: error.message || 'Failed to get payment status'
    });
  }
});

/**
 * Get FX-NOW-Swap supported currencies
 * GET /api/fx-now-swap/supported-currencies
 */
router.get('/supported-currencies', async (req, res) => {
  try {
    console.log('[FX-NOW-Swap] Getting supported currencies');

    // Get supported currencies from NOWPayments
    const currencies = await nowPaymentsService.getSupportedCurrencies();

    res.json({
      success: true,
      message: 'Supported currencies retrieved successfully',
      data: currencies
    });

  } catch (error: any) {
    console.error('[FX-NOW-Swap] Currencies retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Currencies retrieval failed',
      message: error.message || 'Failed to get supported currencies'
    });
  }
});

/**
 * Get FX-NOW-Swap minimum amount
 * GET /api/fx-now-swap/min-amount
 */
router.get('/min-amount', async (req, res) => {
  try {
    const { currency = 'USD', fiat_currency = 'USD' } = req.query;

    console.log('[FX-NOW-Swap] Getting minimum amount:', { currency, fiat_currency });

    // Get minimum amount from NOWPayments
    const minAmount = await nowPaymentsService.getMinAmount(
      currency as string,
      fiat_currency as string
    );

    res.json({
      success: true,
      message: 'Minimum amount retrieved successfully',
      data: minAmount
    });

  } catch (error: any) {
    console.error('[FX-NOW-Swap] Minimum amount retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Minimum amount retrieval failed',
      message: error.message || 'Failed to get minimum amount'
    });
  }
});

/**
 * Get FX-NOW-Swap estimated amount
 * GET /api/fx-now-swap/estimated-amount
 */
router.get('/estimated-amount', async (req, res) => {
  try {
    const { amount, currency_from = 'USD', currency_to = 'USDT' } = req.query;

    if (!amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing amount parameter',
        message: 'amount is required'
      });
    }

    console.log('[FX-NOW-Swap] Getting estimated amount:', { amount, currency_from, currency_to });

    // Get estimated amount from NOWPayments
    const estimatedAmount = await nowPaymentsService.getEstimatedAmount(
      parseFloat(amount as string),
      currency_from as string,
      currency_to as string
    );

    res.json({
      success: true,
      message: 'Estimated amount retrieved successfully',
      data: estimatedAmount
    });

  } catch (error: any) {
    console.error('[FX-NOW-Swap] Estimated amount retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Estimated amount retrieval failed',
      message: error.message || 'Failed to get estimated amount'
    });
  }
});

/**
 * Get FX-NOW-Swap configuration
 * GET /api/fx-now-swap/config
 */
router.get('/config', async (req, res) => {
  try {
    console.log('[FX-NOW-Swap] Getting configuration');

    res.json({
      success: true,
      message: 'FX-NOW-Swap configuration retrieved',
      data: {
        minAmount: 10,
        maxAmount: 75000,
        supportedCurrencies: ['USD', 'CAD', 'EUR', 'GBP'],
        supportedTokens: ['USDT', 'USDC', 'BTC', 'ETH', 'BCH', 'LTC', 'XRP', 'SOL', 'BNB', 'ADA', 'DOT', 'LINK', 'MATIC', 'AVAX'],
        processingFees: {
          percentage: 0.5,
          currency: 'GBP'
        },
        features: [
          'Low processing fees',
          'Hosted payment pages',
          'Wide cryptocurrency support',
          'No chargeback risk',
          'Easy integration'
        ]
      }
    });

  } catch (error: any) {
    console.error('[FX-NOW-Swap] Configuration retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Configuration retrieval failed',
      message: error.message || 'Failed to get configuration'
    });
  }
});

/**
 * Test FX-NOW-Swap connectivity
 * GET /api/fx-now-swap/test
 */
router.get('/test', async (req, res) => {
  try {
    console.log('[FX-NOW-Swap] Testing connectivity');

    // Test NOWPayments API connectivity by getting supported currencies
    const currencies = await nowPaymentsService.getSupportedCurrencies();

    res.json({
      success: true,
      message: 'FX-NOW-Swap test completed successfully',
      data: {
        status: 'operational',
        nowPaymentsConnected: true,
        totalCurrencies: currencies.currencies.length,
        totalFiat: currencies.fiat.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('[FX-NOW-Swap] Test failed:', error);
    res.status(500).json({
      success: false,
      error: 'Test failed',
      message: error.message || 'FX-NOW-Swap test failed'
    });
  }
});

export default router;
