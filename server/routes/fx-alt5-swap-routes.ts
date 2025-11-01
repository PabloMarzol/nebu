import { Router } from 'express';
import { alt5PayService } from '../services/alt5pay-service';
import { fxSwapService } from '../services/fx_swap_service';
import { paymentProviderService } from '../services/payment-provider-service';

const router = Router();

/**
 * FX-ALT5-Swap Dedicated Routes
 * Isolated routes for ALT5 Pay cryptocurrency exchange with professional branding
 */

/**
 * Create FX-ALT5-Swap order
 * POST /api/fx-alt5-swap/create-order
 */
router.post('/create-order', async (req, res) => {
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
    if (gbpAmount < 25 || gbpAmount > 50000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
        message: 'Amount must be between £25 and £50,000'
      });
    }

    console.log('[FX-ALT5-Swap] Creating order:', {
      gbpAmount,
      destinationWallet,
      targetToken,
      userId,
      clientOrderId
    });

    // Get current crypto price for calculating the crypto amount
    const alt5Coin = mapTokenToAlt5Coin(targetToken);
    const priceResponse = await alt5PayService.getCurrentPrice({
      coin: alt5Coin,
      currency: 'USD'
    });

    if (!priceResponse.data || !priceResponse.data.price) {
      throw new Error(`Failed to get current price for ${targetToken}`);
    }

    const cryptoPrice = parseFloat(priceResponse.data.price);
    const estimatedCryptoAmount = gbpAmount / cryptoPrice;

    // Create order using the payment provider service
    const result = await paymentProviderService.createPayment({
      gbpAmount,
      destinationWallet,
      targetToken,
      userId,
      clientOrderId,
      preferredProvider: 'alt5pay',
      fiatCurrency: 'USD'
    });

    console.log('[FX-ALT5-Swap] Payment provider result:', JSON.stringify(result, null, 2));

    // Extract the payment data from ALT5 Pay service
    const paymentData = result.paymentData;
    
    console.log('[FX-ALT5-Swap] ALT5 Pay payment data:', JSON.stringify(paymentData, null, 2));

    // Map the ALT5 Pay response to the expected frontend format
    const responseData = {
      orderId: paymentData.orderId || clientOrderId,
      clientOrderId: paymentData.orderId || clientOrderId,
      amount: paymentData.amount || gbpAmount,
      currency: 'USD',
      status: 'pending',
      payinAddress: paymentData.paymentAddress || paymentData.clientSecret,
      estimatedCryptoAmount: estimatedCryptoAmount,
      exchangeId: paymentData.orderId || clientOrderId,
      expiresAt: paymentData.expiresAt,
      comparison: result.comparison
    };

    console.log('[FX-ALT5-Swap] Mapped response data:', JSON.stringify(responseData, null, 2));

    res.json({
      success: true,
      message: 'FX-ALT5-Swap order created successfully',
      data: responseData
    });

  } catch (error: any) {
    console.error('[FX-ALT5-Swap] Order creation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Order creation failed',
      message: error.message || 'Failed to create FX-ALT5-Swap order'
    });
  }
});

/**
 * Get FX-ALT5-Swap order status
 * GET /api/fx-alt5-swap/order-status/:orderId
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

    console.log('[FX-ALT5-Swap] Getting order status:', orderId);

    // Get order status from ALT5 Pay
    const orderStatus = await alt5PayService.verifyPaymentStatus(orderId);

    res.json({
      success: true,
      message: 'Order status retrieved successfully',
      data: orderStatus
    });

  } catch (error: any) {
    console.error('[FX-ALT5-Swap] Order status check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Order status check failed',
      message: error.message || 'Failed to get order status'
    });
  }
});

/**
 * Get current ALT5 price for cryptocurrency
 * GET /api/fx-alt5-swap/current-price
 */
router.get('/current-price', async (req, res) => {
  try {
    const { coin, currency = 'USD' } = req.query;

    if (!coin) {
      return res.status(400).json({
        success: false,
        error: 'Missing coin parameter',
        message: 'coin is required'
      });
    }

    console.log('[FX-ALT5-Swap] Getting current price:', { coin, currency });

    // Map token to ALT5 coin type
    const alt5Coin = mapTokenToAlt5Coin(coin as string);
    
    // Get current price from ALT5 Pay
    const priceData = await alt5PayService.getCurrentPrice({
      coin: alt5Coin,
      currency: currency as 'USD' | 'CAD' | 'EUR'
    });

    res.json({
      success: true,
      message: 'Current price retrieved successfully',
      data: priceData
    });

  } catch (error: any) {
    console.error('[FX-ALT5-Swap] Price retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Price retrieval failed',
      message: error.message || 'Failed to get current price'
    });
  }
});

/**
 * Get FX-ALT5-Swap configuration
 * GET /api/fx-alt5-swap/config
 */
router.get('/config', async (req, res) => {
  try {
    console.log('[FX-ALT5-Swap] Getting configuration');

    res.json({
      success: true,
      message: 'FX-ALT5-Swap configuration retrieved',
      data: {
        minAmount: 25,
        maxAmount: 50000,
        supportedCurrencies: ['USD', 'CAD', 'EUR'],
        supportedTokens: ['USDT', 'USDC', 'BTC', 'ETH', 'BCH', 'LTC', 'XRP', 'SOL'],
        processingFees: {
          percentage: 2.0,
          currency: 'GBP'
        },
        features: [
          'Fast cryptocurrency settlement',
          'No chargeback risk',
          'Global availability',
          'Multiple crypto options',
          'Lower processing fees'
        ]
      }
    });

  } catch (error: any) {
    console.error('[FX-ALT5-Swap] Configuration retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Configuration retrieval failed',
      message: error.message || 'Failed to get configuration'
    });
  }
});

/**
 * Test FX-ALT5-Swap connectivity
 * GET /api/fx-alt5-swap/test
 */
router.get('/test', async (req, res) => {
  try {
    console.log('[FX-ALT5-Swap] Testing connectivity');

    // Test ALT5 Pay API connectivity by getting balances
    const balances = await alt5PayService.getBalances();

    res.json({
      success: true,
      message: 'FX-ALT5-Swap test completed successfully',
      data: {
        status: 'operational',
        alt5PayConnected: true,
        balances: balances,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('[FX-ALT5-Swap] Test failed:', error);
    res.status(500).json({
      success: false,
      error: 'Test failed',
      message: error.message || 'FX-ALT5-Swap test failed'
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
