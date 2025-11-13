import { Router, Request, Response } from 'express';
import { onRampMoneyService } from '../services/onramp-money-service';
import { requireAuth } from '../middleware/auth-middleware';

const router = Router();

/**
 * OnRamp Money Routes
 * For buying cryptocurrency with fiat using OnRamp Money LP infrastructure
 */

/**
 * Create OnRamp Money Order
 * Generates a customized OnRamp Money URL for fiat-to-crypto conversion
 * POST /api/onramp-money/create-order
 */
router.post('/create-order', requireAuth, async (req: Request, res: Response) => {
  try {
    const {
      fiatAmount,
      fiatCurrency,
      cryptoCurrency,
      network,
      walletAddress,
      paymentMethod,
      phoneNumber,
      language,
      redirectUrl
    } = req.body;

    // Get user ID from authenticated session
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Validate required fields
    if (!fiatAmount || !fiatCurrency || !cryptoCurrency || !network || !walletAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'fiatAmount, fiatCurrency, cryptoCurrency, network, walletAddress, and paymentMethod are required'
      });
    }

    // Validate fiat amount
    if (fiatAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
        message: 'Fiat amount must be greater than 0'
      });
    }

    // Validate wallet address format (basic check)
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address',
        message: 'Wallet address must be a valid Ethereum address'
      });
    }

    console.log('[OnRamp Money] Creating order:', {
      userId,
      fiatAmount,
      fiatCurrency,
      cryptoCurrency,
      network,
      walletAddress,
      paymentMethod
    });

    // Create order using service
    const result = await onRampMoneyService.createOrder({
      userId,
      fiatAmount: parseFloat(fiatAmount),
      fiatCurrency,
      cryptoCurrency,
      network,
      walletAddress,
      paymentMethod: parseInt(paymentMethod),
      phoneNumber,
      language,
      redirectUrl
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    console.log('[OnRamp Money] Order created successfully:', result.data);

    return res.json(result);

  } catch (error: any) {
    console.error('[OnRamp Money] Create order error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * Handle OnRamp Money Webhook/Redirect
 * Processes the redirect callback from OnRamp Money after transaction
 * GET /api/onramp-money/callback
 */
router.get('/callback', async (req: Request, res: Response) => {
  try {
    const { orderId, status } = req.query;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        error: 'Missing orderId or status in callback'
      });
    }

    console.log('[OnRamp Money] Received callback:', {
      orderId,
      status
    });

    // Update order status
    const result = await onRampMoneyService.handleWebhook(
      orderId as string,
      status as string
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Redirect to frontend with status
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
    const redirectUrl = `${frontendUrl}/fx-swap?onramp_order=${orderId}&status=${status}`;

    return res.redirect(redirectUrl);

  } catch (error: any) {
    console.error('[OnRamp Money] Callback error:', error);

    // Redirect to frontend with error
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
    return res.redirect(`${frontendUrl}/fx-swap?error=callback_failed`);
  }
});

/**
 * Get Order Status
 * Retrieves the current status of an OnRamp Money order
 * GET /api/onramp-money/order/:identifier
 */
router.get('/order/:identifier', requireAuth, async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        error: 'Order identifier is required'
      });
    }

    console.log('[OnRamp Money] Getting order status:', identifier);

    const result = await onRampMoneyService.getOrderStatus(identifier);

    return res.json(result);

  } catch (error: any) {
    console.error('[OnRamp Money] Get order status error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * Get User Orders
 * Retrieves all OnRamp Money orders for the authenticated user
 * GET /api/onramp-money/orders
 */
router.get('/orders', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const limit = parseInt(req.query.limit as string) || 10;

    console.log('[OnRamp Money] Getting user orders:', userId);

    const orders = await onRampMoneyService.getUserOrders(userId, limit);

    return res.json({
      success: true,
      data: orders
    });

  } catch (error: any) {
    console.error('[OnRamp Money] Get user orders error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * Get Supported Currencies
 * Returns list of supported fiat currencies
 * GET /api/onramp-money/currencies
 */
router.get('/currencies', async (req: Request, res: Response) => {
  try {
    const currencies = onRampMoneyService.getSupportedCurrencies();

    return res.json({
      success: true,
      data: currencies
    });

  } catch (error: any) {
    console.error('[OnRamp Money] Get currencies error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * Get Supported Cryptocurrencies
 * Returns list of supported cryptocurrencies and their networks
 * GET /api/onramp-money/cryptos
 */
router.get('/cryptos', async (req: Request, res: Response) => {
  try {
    const cryptos = onRampMoneyService.getSupportedCryptos();

    return res.json({
      success: true,
      data: cryptos
    });

  } catch (error: any) {
    console.error('[OnRamp Money] Get cryptos error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

export default router;
