import { Router } from 'express';
import { changeNowService } from '../services/changenow-service';
import { fxSwapService } from '../services/fx_swap_service';
import { paymentProviderService } from '../services/payment-provider-service';

const router = Router();

/**
 * FX-CRY-Swap Dedicated Routes
 * Isolated routes for ChangeNow instant crypto exchange with professional branding
 */

/**
 * Create FX-CRY-Swap exchange
 * POST /api/fx-cry-swap/create-exchange
 */
router.post('/create-exchange', async (req, res) => {
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
    if (gbpAmount < 10 || gbpAmount > 100000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
        message: 'Amount must be between £10 and £100,000'
      });
    }

    console.log('[FX-CRY-Swap] Creating exchange:', {
      gbpAmount,
      destinationWallet,
      targetToken,
      userId,
      clientOrderId
    });

    // Create exchange using the payment provider service
    const result = await paymentProviderService.createPayment({
      gbpAmount,
      destinationWallet,
      targetToken,
      userId,
      clientOrderId,
      preferredProvider: 'changenow',
      fiatCurrency: 'USD'
    });

    console.log('[FX-CRY-Swap] Exchange created successfully:', {
      provider: result.provider,
      exchangeId: result.paymentData.exchangeId,
      amount: result.paymentData.amount
    });

    res.json({
      success: true,
      message: 'FX-CRY-Swap exchange created successfully',
      data: {
        exchangeId: result.paymentData.exchangeId,
        clientOrderId: result.paymentData.clientOrderId,
        amount: result.paymentData.amount,
        currency: result.paymentData.currency,
        status: result.paymentData.status,
        payinAddress: result.paymentData.payinAddress,
        estimatedCryptoAmount: result.paymentData.estimatedCryptoAmount,
        comparison: result.comparison
      }
    });

  } catch (error: any) {
    console.error('[FX-CRY-Swap] Exchange creation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Exchange creation failed',
      message: error.message || 'Failed to create FX-CRY-Swap exchange'
    });
  }
});

/**
 * Get FX-CRY-Swap exchange status
 * GET /api/fx-cry-swap/exchange-status/:exchangeId
 */
router.get('/exchange-status/:exchangeId', async (req, res) => {
  try {
    const { exchangeId } = req.params;

    if (!exchangeId) {
      return res.status(400).json({
        success: false,
        error: 'Missing exchange ID',
        message: 'exchangeId is required'
      });
    }

    console.log('[FX-CRY-Swap] Getting exchange status:', exchangeId);

    // Get exchange status from ChangeNow
    const exchangeStatus = await changeNowService.getExchangeStatus(exchangeId);

    res.json({
      success: true,
      message: 'Exchange status retrieved successfully',
      data: exchangeStatus
    });

  } catch (error: any) {
    console.error('[FX-CRY-Swap] Exchange status check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Exchange status check failed',
      message: error.message || 'Failed to get exchange status'
    });
  }
});

/**
 * Get FX-CRY-Swap supported currencies
 * GET /api/fx-cry-swap/supported-currencies
 */
router.get('/supported-currencies', async (req, res) => {
  try {
    console.log('[FX-CRY-Swap] Getting supported currencies');

    // Get supported currencies from ChangeNow
    const currencies = await changeNowService.getSupportedCurrencies();

    res.json({
      success: true,
      message: 'Supported currencies retrieved successfully',
      data: {
        totalCurrencies: currencies.length,
        cryptoCurrencies: currencies.filter(c => !c.isFiat).length,
        fiatCurrencies: currencies.filter(c => c.isFiat).length,
        currencies: currencies.slice(0, 50) // Return first 50 for brevity
      }
    });

  } catch (error: any) {
    console.error('[FX-CRY-Swap] Currencies retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Currencies retrieval failed',
      message: error.message || 'Failed to get supported currencies'
    });
  }
});

/**
 * Get FX-CRY-Swap minimum amount
 * GET /api/fx-cry-swap/min-amount
 */
router.get('/min-amount', async (req, res) => {
  try {
    const { from_currency = 'USD', to_currency = 'USDT' } = req.query;

    if (!from_currency || !to_currency) {
      return res.status(400).json({
        success: false,
        error: 'Missing currency parameters',
        message: 'from_currency and to_currency are required'
      });
    }

    console.log('[FX-CRY-Swap] Getting minimum amount:', { from_currency, to_currency });

    // Get minimum amount from ChangeNow
    const minAmount = await changeNowService.getMinAmount(
      from_currency as string,
      to_currency as string
    );

    res.json({
      success: true,
      message: 'Minimum amount retrieved successfully',
      data: {
        minAmount: minAmount,
        from_currency: from_currency,
        to_currency: to_currency
      }
    });

  } catch (error: any) {
    console.error('[FX-CRY-Swap] Minimum amount retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Minimum amount retrieval failed',
      message: error.message || 'Failed to get minimum amount'
    });
  }
});

/**
 * Get FX-CRY-Swap estimated amount
 * GET /api/fx-cry-swap/estimated-amount
 */
router.get('/estimated-amount', async (req, res) => {
  try {
    const { from_currency = 'USD', to_currency = 'USDT', from_amount } = req.query;

    if (!from_currency || !to_currency || !from_amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        message: 'from_currency, to_currency, and from_amount are required'
      });
    }

    console.log('[FX-CRY-Swap] Getting estimated amount:', { from_currency, to_currency, from_amount });

    // Get estimated amount from ChangeNow
    const estimatedAmount = await changeNowService.getEstimatedAmount(
      from_currency as string,
      to_currency as string,
      parseFloat(from_amount as string)
    );

    res.json({
      success: true,
      message: 'Estimated amount retrieved successfully',
      data: estimatedAmount
    });

  } catch (error: any) {
    console.error('[FX-CRY-Swap] Estimated amount retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Estimated amount retrieval failed',
      message: error.message || 'Failed to get estimated amount'
    });
  }
});

/**
 * Get FX-CRY-Swap configuration
 * GET /api/fx-cry-swap/config
 */
router.get('/config', async (req, res) => {
  try {
    console.log('[FX-CRY-Swap] Getting configuration');

    res.json({
      success: true,
      message: 'FX-CRY-Swap configuration retrieved',
      data: {
        minAmount: 10,
        maxAmount: 100000,
        supportedCurrencies: ['USD', 'CAD', 'EUR', 'GBP'],
        supportedTokens: ['USDT', 'USDC', 'BTC', 'ETH', 'BCH', 'LTC', 'XRP', 'SOL', 'BNB', 'ADA', 'DOT', 'LINK'],
        processingFees: {
          percentage: 0.75,
          currency: 'GBP'
        },
        features: [
          'Fixed-rate exchange protection',
          'Wide range of cryptocurrencies',
          'Fast exchange processing',
          'No chargeback risk',
          'Competitive exchange rates'
        ]
      }
    });

  } catch (error: any) {
    console.error('[FX-CRY-Swap] Configuration retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Configuration retrieval failed',
      message: error.message || 'Failed to get configuration'
    });
  }
});

/**
 * Test FX-CRY-Swap connectivity
 * GET /api/fx-cry-swap/test
 */
router.get('/test', async (req, res) => {
  try {
    console.log('[FX-CRY-Swap] Testing connectivity');

    // Test ChangeNow API connectivity by getting supported currencies
    const currencies = await changeNowService.getSupportedCurrencies();

    res.json({
      success: true,
      message: 'FX-CRY-Swap test completed successfully',
      data: {
        status: 'operational',
        changeNowConnected: true,
        totalCurrencies: currencies.length,
        cryptoCurrencies: currencies.filter(c => !c.isFiat).length,
        fiatCurrencies: currencies.filter(c => c.isFiat).length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('[FX-CRY-Swap] Test failed:', error);
    res.status(500).json({
      success: false,
      error: 'Test failed',
      message: error.message || 'FX-CRY-Swap test failed'
    });
  }
});

export default router;
