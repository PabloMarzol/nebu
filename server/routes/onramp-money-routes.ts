import { Router, Request, Response } from 'express';
import { onRampMoneyService } from '../services/onramp-money-service';
import { requireAuth } from '../middleware/auth';

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
 * Handle OnRamp Money Redirect Callback (User redirect after payment)
 * GET /api/onramp-money/callback
 */
router.get('/callback', async (req: Request, res: Response) => {
  try {
    const { orderId, status } = req.query;

    console.log('[OnRamp Money] Received redirect callback:', {
      orderId,
      status
    });

    // Redirect to frontend with status
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5000';

    if (!orderId || !status) {
      return res.redirect(`${frontendUrl}/fx-swap?error=missing_params`);
    }

    const redirectUrl = `${frontendUrl}/fx-swap?onramp_order=${orderId}&status=${status}`;
    return res.redirect(redirectUrl);

  } catch (error: any) {
    console.error('[OnRamp Money] Redirect callback error:', error);

    // Redirect to frontend with error
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
    return res.redirect(`${frontendUrl}/fx-swap?error=callback_failed`);
  }
});

/**
 * Handle OnRamp Money Webhook (Server-to-server notification)
 * POST /api/onramp-money/webhook
 */
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    // Get signature and payload from headers
    const payload = req.headers['x-onramp-payload'] as string;
    const signature = req.headers['x-onramp-signature'] as string;

    if (!payload || !signature) {
      console.error('[OnRamp Money] Webhook missing required headers');
      return res.status(400).json({
        success: false,
        error: 'Missing x-onramp-payload or x-onramp-signature headers'
      });
    }

    // Verify webhook signature
    const isValid = onRampMoneyService.verifyWebhookSignature(payload, signature);

    if (!isValid) {
      console.error('[OnRamp Money] Webhook signature verification failed');
      return res.status(403).json({
        success: false,
        error: 'Invalid signature'
      });
    }

    // Parse webhook data
    let webhookData;
    try {
      webhookData = JSON.parse(payload);
    } catch (parseError) {
      console.error('[OnRamp Money] Failed to parse webhook payload:', parseError);
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON payload'
      });
    }

    console.log('[OnRamp Money] Received valid webhook:', {
      orderId: webhookData.orderId,
      status: webhookData.status,
      statusDescription: webhookData.statusDescription,
      merchantRecognitionId: webhookData.merchantRecognitionId
    });

    // Map OnRamp status codes to our status
    // Status codes: 6,14,40 = completed, 7,15,41 = webhook sent, others = pending/processing
    let ourStatus = 'pending';
    if ([6, 14, 15, 19, 40, 41].includes(webhookData.status)) {
      ourStatus = 'success';
    } else if ([-4, -2, -1].includes(webhookData.status)) {
      ourStatus = 'failed';
    }

    // Update order in database
    const result = await onRampMoneyService.handleWebhook(
      webhookData.orderId?.toString() || webhookData.merchantRecognitionId,
      ourStatus
    );

    if (!result.success) {
      console.error('[OnRamp Money] Failed to update order:', result.error);
      return res.status(500).json(result);
    }

    console.log('[OnRamp Money] Webhook processed successfully');

    // Return success response within 5 seconds as required
    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error: any) {
    console.error('[OnRamp Money] Webhook processing error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
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
